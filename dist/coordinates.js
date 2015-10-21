"use strict";

var Coordinates = function Coordinates(_x, _y, _z) {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.setCoords(_x, _y, _z);
};

Coordinates.prototype.setCoords = function (_x, _y, _z) {
	if (_x === undefined || isNaN(_x)) {
		_x = 0;
	}
	if (_y === undefined || isNaN(_y)) {
		_y = 0;
	}
	if (_z === undefined || isNaN(_z)) {
		_z = 0;
	}
	this.x = _x;
	this.y = _y;
	this.z = _z;
};

module.exports = Coordinates;