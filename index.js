/**
* Gesture recognition
**/

var Skeleton = require("./skeleton.js");
var util = require("util");
var EventEmitter = require("events").EventEmitter;

var user = new Skeleton();
var kinectContext;
var delayBetweenGestures = 500;
var registeredGestures = [];

/**
* GestureRecognition.constructor
* Initialize the kinect and start the tracking
* @param _kinectContext The Kinect
**/
var GestureRecognition = function(_kinectContext) {
	kinectContext = _kinectContext;
	this.startTracking();
}

//Add the event emitter
util.inherits(GestureRecognition, EventEmitter);

/**
* GestureRecognition.getUserSkeleton
* Returns the user skeleton
* @return Skeleton The user skeleton
**/
GestureRecognition.prototype.getUserSkeleton = function() {
	return user;
}

/**
* GestureRecognition.startTracking
* Start tracking the kinect events
* Emits a skeletonChanged event when a joint event was triggered
**/
GestureRecognition.prototype.startTracking = function() {
	var self = this;

	kinectContext.emit = function() {
		//Arguments:
		// 0: event name
		// 1: userId
		// 2: x coordinate when this is a joint event
		// 3: y coordinate when this is a joint event
		// 4: z coordinate when this is a joint event
		if (user.jointExists(arguments["0"])) {
			user.jointChanged(arguments["0"], arguments["2"], arguments["3"], arguments["4"]);
			self.emit("skeletonChanged", user);
		}
	}
}

/**
* GestureRecognition.registerGesture
* Registers a new gesture for tracking
* This function will require the gesture in the /gestures/ folder, initialize
* it and start the gesture detection.  It will also trigger a gesture:gestureName
* event when the gesture is detected.
**/
GestureRecognition.prototype.registerGesture = function(gestureName) {
	var self = this;
	var id = registeredGestures.length;
	var G = require("./gestures/" + gestureName);
	registeredGestures.push(new G(user));
	//Define a name in case it wasn't done in the gesture lib
	var props = registeredGestures[id].getGestureProperties();
	if (props === undefined) {props = {};}
	if (props.name === undefined) {
		props.name = "gesture" + (registeredGestures.length-1);
		registeredGestures[id].getGestureProperties = function() {
			return props;
		}
	}
	console.log("Register Gesture " + gestureName);
	//Start the gesture detection
	registeredGestures[id].startDetection();
	//When a gesture is detected, pause all gesture detection for
	// delayBetweenGestures ms and emit a gesture:gestureName event
	registeredGestures[id].on("gesture:"+gestureName, function() {
		for (var i=0; i<registeredGestures.length; i++) {
			registeredGestures[i].pauseDetection(delayBetweenGestures);
		}
		self.emit("gesture:"+gestureName);
	});
}

module.exports = function(kc) {
	return new GestureRecognition(kc);
}