var Coordinates = require("./coordinates.js");

/**
* A joint is only a Coordinate with a label
**/
var Joint = function(label) {
	Coordinates.apply(this);
	this.label = label;
}

//Inherit the Coordinate prototype and override the constructor
Joint.prototype = Coordinates.prototype;
Joint.prototype.constructor = Joint;

module.exports = Joint;