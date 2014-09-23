var DEBUG = false;

var BaseGesture = require("../basegesture.js");
var util = require("util");

RightHandSwipeLeft = function() {
	BaseGesture.apply(this, arguments);
}
util.inherits(RightHandSwipeLeft, BaseGesture);
RightHandSwipeLeft.prototype.constructor = RightHandSwipeLeft;

/**
* RightHandSwipeLeft.initialConditionMet
* Check if the initial condition is met
* in this gesture, we check if the hand is in front of the center of mass
**/
RightHandSwipeLeft.prototype.initialConditionMet = function() {
	var conditionMet = false;

	var distanceFromHandToCom = Math.abs(this._skeleton.right_hand.z - this._skeleton.centerOfMass().z);
	if (this._skeleton.distanceInBaseUnitZ(distanceFromHandToCom) >= 0.1) {
		if (DEBUG) console.log("initial condition met");
		conditionMet = true;
	}

	return conditionMet;
}

/**
* RightHandSwipeLeft.conditionStillMet
* Check if the condition is still met
* in this gesture, we check if the hand is still in from of the center of mass and
* if the hand is to the left of the initial position
**/
RightHandSwipeLeft.prototype.conditionStillMet = function() {
	var conditionMet = false;

	var distanceFromHandToCom = Math.abs(this._skeleton.right_hand.z - this._skeleton.centerOfMass());
	if (this._skeleton.distanceInBaseUnitZ(distanceFromHandToCom >= 0.1) && this._skeleton.right_hand.x < this._gestureStartSkeleton.right_hand.x) {
		conditionMet = true;
		if (DEBUG) console.log("condition still met");
	}

	return conditionMet;
}

/**
* RightHandSwipeLeft.finalConditionMet
* Check if the final condition is met
* in this gesture, we look if the hand is still in from of the center of mass and if the 
* hand moved the equivalent of 0.2 baseUnits in x to the left of the initial position
**/
RightHandSwipeLeft.prototype.finalConditionMet = function() {
	var conditionMet = false;

	var distanceFromHandToCom = Math.abs(this._skeleton.right_hand.z - this._skeleton.centerOfMass().z);
	var distanceHandMoved = Math.abs(this._skeleton.right_hand.x - this._gestureStartSkeleton.right_hand.x);
	if (this._skeleton.right_hand.x < this._gestureStartSkeleton.right_hand.x && this._skeleton.distanceInBaseUnitZ(distanceFromHandToCom) >= 0.1 && this._skeleton.distanceInBaseUnitX(distanceHandMoved) >= 0.2) {
		conditionMet = true;
		if (DEBUG) console.log("final condition met");
	} else {
		if (DEBUG) console.log (this._skeleton.distanceInBaseUnitZ(distanceFromHandToCom) + ">=0.1 && " + this._skeleton.distanceInBaseUnitX(distanceHandMoved) + ">=0.2");
	}

	return conditionMet;
}

/**
* RightHandSwipeLeft.getGestureProperties
* Define various properties that can be accessed in the other functions
* here.  A "name" property is mandatory
**/
RightHandSwipeLeft.prototype.getGestureProperties = function() {
	return {
		name: "rightHandSwipeLeft"
	};
}

module.exports = RightHandSwipeLeft;