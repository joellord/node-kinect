"use strict";

var Joint = require("./joint.js");
var Coordinates = require("./coordinates.js");

//List of tracked joints
var joints = ["head", "neck", "torso", "left_shoulder", "left_elbow", "left_hand", "right_shoulder", "right_elbow", "right_hand", "left_hip", "left_knee", "left_foot", "right_hip", "right_knee", "right_foot"];

/**
* Skeleton.constructor
* Creates a skeleton with all the tracked joints
**/
var Skeleton = function Skeleton() {
	for (var i = 0; i < joints.length; i++) {
		this[joints[i]] = new Joint(joints[i]);
	}
};

Skeleton.baseUnitX = 0;
Skeleton.baseUnitY = 0;
Skeleton.baseUnitZ = 0;

/**
* Skeleton.jointChanged
* Notify the skeleton that a joint coordinates has changed
* @param jointName string The name of the joint
* @param _x float The x coordinate of the joint
* @param _y float The y coordinate of the joint
* @param _z float The z coordinate of the joint
**/
Skeleton.prototype.jointChanged = function (jointName, _x, _y, _z) {
	if (this.jointExists(jointName)) {
		this[jointName].setCoords(_x, _y, _z);
	}
};

/** 
* Skeleton.calculateBaseUnits
* This function will calculate the body height and width in pixels
**/
Skeleton.prototype.calculateBaseUnits = function () {
	this.baseUnitX = Math.abs(this.left_hand.x - this.right_hand.x);
	this.baseUnitY = Math.abs(this.head.y - this.left_foot.y);
	this.baseUnitZ = this.baseUnitX;
};

/**
* Skeleton.distanceInBaseUnitX
* Returns the a distance as a ratio of baseUnits (body width == 1)
* @param float The distance in pixels to convert in baseUnits
* @return float The number of base units the distanceInPx represents
**/
Skeleton.prototype.distanceInBaseUnitX = function (distanceInPx) {
	this.calculateBaseUnits();
	return distanceInPx / this.baseUnitX;
};

/**
* Skeleton.distanceInBaseUnitY
* Returns the a distance as a ratio of baseUnits (body height == 1)
* @param float The distance in pixels to convert in baseUnits
* @return float The number of base units the distanceInPx represents
**/
Skeleton.prototype.distanceInBaseUnitY = function (distanceInPx) {
	this.calculateBaseUnits();
	return distanceInPx / this.baseUnitY;
};

/**
* Skeleton.distanceInBaseUnitZ
* Returns the a distance as a ratio of baseUnits (body width == 1)
* @param float The distance in pixels to convert in baseUnits
* @return float The number of base units the distanceInPx represents
**/
Skeleton.prototype.distanceInBaseUnitZ = function (distanceInPx) {
	this.calculateBaseUnits();
	return distanceInPx / this.baseUnitZ;
};

/**
* Skeleton.jointExists
* Returns true if a joint exists in the list of tracked joints
* @param string jointName Name of the joint to verify
* @return bool True if the joint exists
**/
Skeleton.prototype.jointExists = function (jointName) {
	return !!(joints.indexOf(jointName) > -1);
};

/**
* Skeleton.centerOfMass
* Calculates the coordinates of the center of mass
* @return Coordinates A coordinate object for the position of the COM
**/
Skeleton.prototype.centerOfMass = function () {
	var totalX = 0;
	var totalY = 0;
	var totalZ = 0;
	var count = 0;

	for (var i = 0; i < joints.length; i++) {
		totalX += this[joints[i]].x;
		totalY += this[joints[i]].y;
		totalZ += this[joints[i]].z;
		count++;
	}

	var com = new Coordinates(totalX / count, totalY / count, totalZ / count);

	return com;
};

/**
* Skeleton.getDataClone
* This functions returns a copy of the current skeleton joint coordinates
* The copy does not contain the prototype
* @return Object The skeleton joint coordinates
**/
Skeleton.prototype.getDataClone = function () {
	var clone = {};

	for (var i = 0; i < joints.length; i++) {
		clone[joints[i]] = new Coordinates(this[joints[i]].x, this[joints[i]].y, this[joints[i]].z);
	}

	return clone;
};

module.exports = Skeleton;