//Require the OpenNI library
var kinect = require("./openni")();
//Require the Kinect Gestures library
var tracker = require("../../dist")(kinect, {delayBetweenGestures: 1000});
//Require the an express server
var app = require("express")();
//Require the HTTP lib to server the index page
var http = require("http").Server(app);
//Require Socket.IO
var io = require("socket.io")(http);
//Require Johnny-five
var five = require("johnny-five");
//Require the song to be played be the piezo
var song = require("./song");
var board = new five.Board({
//  port: "/dev/cu.NodeBot-DevB"
});

//Constants
var c = {
	SERVER_PORT: 3000,
	READY: true,
	STANDBY: false,
	MOTOR_SPEED: 200,
	MOTOR_DELAY: 1000
};
var states = {
	socket: false,
	emitter: true,
	board: false
};

//Robot components
var robot = {};

/**
* Web server initialization and start 
**/
app.get("*", function(req, res) {
	console.log(req.url);
	res.sendfile(req.url.substr(1));
});

http.listen(c.SERVER_PORT, function() {
	console.log("Server started on port " + c.SERVER_PORT);
});

tracker.on("skeletonChanged", function(skeleton) {
	if (states.emitter === c.READY) {
		io.emit("skeleton", skeleton);
		states.emitter = c.STANDBY;
		setTimeout(function() {
			states.emitter = c.READY;
		}, 100);
	}
});


/**
 * Initialize robot
 **/
board.on("ready", function() {
    robot.lmotor = new five.Motor([ 3, 12 ]);
    robot.rmotor = new five.Motor([11, 13]);
    robot.greenLed = new five.Led(30);
    robot.yellowLed = new five.Led(28);

    blinkLeds();

    robot.piezo = new five.Piezo(32);

    states.board = c.READY;
});

function moveRobot(direction) {
    if (states.board !== c.READY) return;
    robot.lmotor[direction](c.MOTOR_SPEED);
    robot.rmotor[direction](c.MOTOR_SPEED*0.8);
    setTimeout(function() {
        robot.lmotor.stop();
        robot.rmotor.stop();
    }, c.MOTOR_DELAY);
}

function blinkLeds() {
    if (states.board !== c.READY) return;
    robot.greenLed.blink(500);
    setTimeout(function() {
        robot.yellowLed.blink(500);
    }, 250);
}

function quickFlash() {
    robot.greenLed.off();
    robot.yellowLed.blink(100);
    setTimeout(function() {
        robot.yellowLed.off();
        blinkLeds();
    }, 3000);
}

/**
* Register Gestures 
**/

tracker.registerGesture("rightHandSwipeLeft");
tracker.registerGesture("rightHandSwipeRight");
tracker.registerGesture("leftHandSwipeLeft");
tracker.registerGesture("leftHandSwipeRight");
tracker.on("gesture:rightHandSwipeLeft", function() {
	io.emit("rightHandSwipeLeft");
	moveRobot("reverse");
});
tracker.on("gesture:rightHandSwipeRight", function() {
	io.emit("rightHandSwipeRight");
	moveRobot("forward");
});
tracker.on("gesture:leftHandSwipeLeft", function() {
	io.emit("leftHandSwipeLeft");
	if (states.board === c.READY) quickFlash();
});
tracker.on("gesture:leftHandSwipeRight", function() {
	io.emit("leftHandSwipeRight");
    if (states.board === c.READY) robot.yellowLed.toggle();
    if (states.board === c.READY) robot.piezo.play(song);
});

//Close the kinect and exit
process.on("SIGINT", function() {
	kinect.close();
	process.exit();
});