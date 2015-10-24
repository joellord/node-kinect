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

//Constants
var c = {
	SERVER_PORT: 3000,
	READY: true,
	STANDBY: false
};
var states = {
	socket: false,
	emitter: true
};

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
* Register Gestures 
**/

tracker.registerGesture("rightHandSwipeLeft");
tracker.registerGesture("rightHandSwipeRight");
tracker.registerGesture("leftHandSwipeLeft");
tracker.registerGesture("leftHandSwipeRight");
tracker.on("gesture:rightHandSwipeLeft", function() {
	io.emit("rightHandSwipeLeft");
});
tracker.on("gesture:rightHandSwipeRight", function() {
	io.emit("rightHandSwipeRight");
});
tracker.on("gesture:leftHandSwipeLeft", function() {
	io.emit("leftHandSwipeLeft");
});
tracker.on("gesture:leftHandSwipeRight", function() {
	io.emit("leftHandSwipeRight");
});

//Close the kinect and exit
process.on("SIGINT", function() {
	kinect.close();
	process.exit();
});