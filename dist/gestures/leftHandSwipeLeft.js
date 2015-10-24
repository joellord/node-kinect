var DEBUG = false;

var BaseGesture = require("../basegesture.js");
var util = require("util");

LeftHandSwipeLeft = function() {
	BaseGesture.apply(this, arguments);
}
util.inherits(LeftHandSwipeLeft, BaseGesture);
LeftHandSwipeLeft.prototype.constructor = LeftHandSwipeLeft;

/**
* LeftHandSwipeLeft.initialConditionMet
* Check if the initial condition is met
* in this gesture, we check if the hand is in front of the center of mass
**/
LeftHandSwipeLeft.prototype.initialConditionMet = function() {
	var conditionMet = false;

	var distanceFromHandToCom = Math.abs(this._skeleton.left_hand.z - this._skeleton.centerOfMass().z);
	if (this._skeleton.distanceInBaseUnitZ(distanceFromHandToCom) >= 0.1) {
		if (DEBUG) console.log("initial condition met");
		conditionMet = true;
	}

	return conditionMet;
}

/**
* LeftHandSwipeLeft.conditionStillMet
* Check if the condition is still met
* in this gesture, we check if the hand is still in from of the center of mass and
* if the hand is to the left of the initial position
**/
LeftHandSwipeLeft.prototype.conditionStillMet = function() {
	var conditionMet = false;

	var distanceFromHandToCom = Math.abs(this._skeleton.left_hand.z - this._skeleton.centerOfMass());
	if (this._skeleton.distanceInBaseUnitZ(distanceFromHandToCom >= 0.1) && this._skeleton.left_hand.x < this._gestureStartSkeleton.left_hand.x) {
		conditionMet = true;
		if (DEBUG) console.log("condition still met");
	}

	return conditionMet;
}

/**
* LeftHandSwipeLeft.finalConditionMet
* Check if the final condition is met
* in this gesture, we look if the hand is still in from of the center of mass and if the 
* hand moved the equivalent of 0.2 baseUnits in x to the left of the initial position
**/
LeftHandSwipeLeft.prototype.finalConditionMet = function() {
	var conditionMet = false;

	var distanceFromHandToCom = Math.abs(this._skeleton.left_hand.z - this._skeleton.centerOfMass().z);
	var distanceHandMoved = Math.abs(this._skeleton.left_hand.x - this._gestureStartSkeleton.left_hand.x);
	if (this._skeleton.left_hand.x < this._gestureStartSkeleton.left_hand.x && this._skeleton.distanceInBaseUnitZ(distanceFromHandToCom) >= 0.1 && this._skeleton.distanceInBaseUnitX(distanceHandMoved) >= 0.2) {
		conditionMet = true;
		if (DEBUG) console.log("final condition met");
	} else {
		if (DEBUG) console.log (this._skeleton.distanceInBaseUnitZ(distanceFromHandToCom) + ">=0.1 && " + this._skeleton.distanceInBaseUnitX(distanceHandMoved) + ">=0.2");
	}

	return conditionMet;
}

/**
* LeftHandSwipeLeft.getGestureProperties
* Define various properties that can be accessed in the other functions
* here.  A "name" property is mandatory
**/
LeftHandSwipeLeft.prototype.getGestureProperties = function() {
	return {
		name: "leftHandSwipeLeft"
	};
}

module.exports = LeftHandSwipeLeft;