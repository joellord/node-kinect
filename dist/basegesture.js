"use strict";

var DEBUG = false;

var util = require("util");
var EventEmitter = require("events").EventEmitter;

/**
* Default properties for base gestures
**/
var defaults = {
	duration: 1000,
	frames: 10,
	detectionRate: 100
};

var params = {};

var _frameDuration;

var initialSkeleton;
var _tracking = false;
var _currentFrame = 0;

/**
* BaseGesture constructor 
**/
var BaseGesture = function BaseGesture(skeleton, _options) {
	this._skeleton = skeleton;
	if (_options === undefined) {
		_options = {};
	}

	params.duration = _options.duration === undefined ? defaults.duration : _options.duration;
	params.frames = _options.frames === undefined ? defaults.frames : _options.frames;
	params.detectionRate = _options.detectionRate === undefined ? defaults.detectionRate : _options.detectionRate;

	_frameDuration = parseInt(params.duration / params.frames);

	this._trackingTimer = {};
	this._detectorTimer = {};
};

//Add event emitter functions
util.inherits(BaseGesture, EventEmitter);

BaseGesture._skeleton = {};
BaseGesture._gestureStartSkeleton = {};

BaseGesture.prototype.getGestureProperties = function () {
	//This should be overridden
	return {
		name: "baseGesture"
	};
};

/**
* BaseGesture.initialConditionMet
* this function should be overridden by gesture libraries
* this is the initial condition that will start the tracking for this gesture
**/
BaseGesture.prototype.initialConditionMet = function () {
	//This should be overridden
	return false;
};

/**
* BaseGesture.conditionStillMet
* this function should be overridden by gesture libraries
* This function will check if the joints are still within the conditions
**/
BaseGesture.prototype.conditionStillMet = function () {
	//This should be overridden
	return false;
};

/**
* BaseGesture.finalConditionMet
* this function should be overridden by gesture libraries
* This function checks if the final condition is met or not
**/
BaseGesture.prototype.finalConditionMet = function () {
	//This should be overridden
	return false;
};

/**
* BaseGesture.startTracking
* this function is triggered when the initial condition was met
* it will check every x frames to see if the final condition is met
* if the final condition is not met, it will call itself again to check in a few
* ms.  If we exceed the number of permitted frames and the final condition was not
* met, we exit the tracking mode.
**/
BaseGesture.prototype.startTracking = function () {
	if (DEBUG) {
		console.log("startTracking");
	}
	//Check every frameDuration to see if the condition is still met
	_tracking = true;
	var self = this;

	//Stop the initial gesture detection
	this.stopDetection();

	var trackingFn = function trackingFn() {
		_currentFrame++;
		if (self.finalConditionMet()) {
			if (DEBUG) {
				console.log("detected final condition met");
			}
			self.startDetection();
			self.gestureDetected();
			self.resetTrackingParams();
			return;
		} else if (_currentFrame <= params.frames && self.conditionStillMet()) {
			self.trackingTimer = setTimeout(trackingFn, _frameDuration);
		} else {
			if (DEBUG) {
				console.log("gesture was not completed");
			}
			self.resetTrackingParams();
			//Restart the detection right away
			self.startDetection();
		}
	};

	self.trackingTimer = setTimeout(trackingFn, _frameDuration);
};

/**
* BaseGesture.resetTrackingParams
* Resets the tracking parameters, used internally after a gesture was detected
* or ended due to unmet conditions
**/
BaseGesture.prototype.resetTrackingParams = function () {
	_tracking = false;
	_currentFrame = 0;
	clearTimeout(this.trackingTimer);
};

/**
* BaseGesture.gestureDetected
* This function is triggered when a full gesture was detected
* it will emit an event named gesture:gestureName
**/
BaseGesture.prototype.gestureDetected = function () {
	var name = this.getGestureProperties().name;
	if (DEBUG) console.log("Gesture detected " + name);
	//We have a gesture, emit it
	this.emit("gesture:" + name, {});
};

/**
* BaseGesture.startDetection
* Starts the detection of the initial condition for the gesture
**/
BaseGesture.prototype.startDetection = function () {
	if (DEBUG) console.log("Starting gesture detection");
	var self = this;
	var detect = function detect() {
		if (self.initialConditionMet() && !_tracking) {
			self._gestureStartSkeleton = self._skeleton.getDataClone();
			self.startTracking();
		}
	};
	self.detectorTimer = setInterval(function () {
		detect.call(self);
	}, params.detectionRate);
};

/**
* BaseGesture.stopDetection
* Stop looking for the initial condition
* Used internally to pause looking for an initial condition when we
* are tracking a gesture
**/
BaseGesture.prototype.stopDetection = function () {
	if (DEBUG) console.log("Stopping gesture detection");
	clearInterval(this.detectorTimer);
};

/**
* BaseGesture.pauseDetection
* Stop looking for the initial condition and then restart the initial
* condition detection after x ms
* @param int ms Number of milliseconds to wait before detection is restarted
**/
BaseGesture.prototype.pauseDetection = function (ms) {
	var self = this;
	this.stopDetection();
	setTimeout(function () {
		self.startDetection.call(self);
	}, ms);
};

//Export the module
module.exports = BaseGesture;