"use strict";

var request = require("request");
var fs = require("fs");

var config = {
  writeToFile: false
};

/**
 * Constructor
 * defaults: list of options to override the config object
 **/
var RUG = function RUG(defaults) {
  //constructor
  this.API_URL = "randomuser.me/api";
  this.LOGGER = false;

  config.writeToFile = defaults && defaults.writeToFile !== undefined ? defaults.writeToFile : false;
  config.fields = defaults && defaults.fields !== undefined ? defaults.fields : undefined;
  config.map = defaults && defaults.map !== undefined ? defaults.map : undefined;
  config.gender = defaults && defaults.gender !== undefined ? defaults.gender : undefined;
  config.nationality = defaults && defaults.nationality !== undefined ? defaults.nationality : undefined;
  config.seed = defaults && defaults.seed !== undefined ? defaults.seed : undefined;
};

/**
 * getOne
 * This function will return a single user
 * cb: A callback function that is called when the function is done
 * The parameter of the function is the single user object
 **/
RUG.prototype.getOne = function (options, cb) {
  //If there is no options, cb is the first param
  if (cb === undefined && typeof options === "function") {
    cb = options;
    options = {};
  }

  this.log("Intiating getOne() function");

  this.getMany(1, options, function (users) {
    if (typeof cb === "function") cb(users[0]);
  });

  return;
};

/**
 * getMany
 * This function returns a group of users
 * howMany: A number indicating the number of users in the array
 * cb: A callback function that is called when the function is done
 * The parameter of the function is an array of users
 **/
RUG.prototype.getMany = function (howMany, options, cb) {
  //If there is no options, cb is the first param
  if (cb === undefined && typeof options === "function") {
    cb = options;
    options = {};
  }

  //Use defaults instead of options
  var currentScopeConfig = config;
  for (var option in options) {
    currentScopeConfig[option] = options[option];
  }
  options = currentScopeConfig;

  if (typeof howMany !== "number") {
    throw "The first parameter of getMany() should be a number";
  }

  this.log("Intiating getMany() function");
  this.log("using options");
  this.log(options);
  var self = this;

  var queryString = "?results=" + howMany;
  queryString += options.gender ? "&gender=" + options.gender : "";
  queryString += options.nationality ? "&nat=" + options.nationality : "";
  queryString += options.seed ? "&seed=" + options.seed : "";

  request.get("http://" + this.API_URL + queryString, function (error, response, body) {
    if (error) {
      throw "Could not reach server";
    }

    self.log("Got a valid response");

    body = JSON.parse(body);

    //If the API is down, it send an object with an error property
    if (body.error) {
      throw body.error;
    }

    var users = [];

    for (var i = 0; i < howMany; i++) {
      //Transform users
      var newUser = {};
      if (options && options.fields) {
        //Only specific fields
        for (var j = 0; j < options.fields.length; j++) {
          var field = options.fields[j];
          newUser[field] = body.results[i].user[field] ? body.results[i].user[field] : undefined;
        }
      } else if (options && options.map) {
        //Map the fields
        for (var mappedField in options.map) {
          //map: {firstName: 'name.first'}
          //mappedField if firstName and target is name.first

          var target = options.map[mappedField];

          //check for deep fields (ie name.first)
          var fieldValue;
          if (target.indexOf(".") > -1) {
            var fields = target.split(".");
            //according to the current documentation, it can't be deeper than 2 levels
            fieldValue = body.results[i].user[fields[0]][fields[1]];
          } else {
            fieldValue = body.results[i].user[target];
          }

          //Add to the new User
          newUser[mappedField] = fieldValue;
        }
      } else {
        newUser = body.results[i].user;
      }

      //Then push it
      users.push(newUser);
    }

    //TODO Fix this code smell
    if (config.writeToFile) {
      self.outputToFile(users, function () {
        if (typeof cb === "function") cb(users);
      });
    } else {
      if (typeof cb === "function") cb(users);
    }
  });

  return;
};

/**
 * log
 * A simple and naive console logger
 * text: The text to be logged
 **/
RUG.prototype.log = function (text) {
  if (this.LOGGER) {
    console.log(text);
  }

  return true;
};

/**
 * outputToFile
 * This function outputs data to a filename that is specified in the config.writeToFile
 * data: Data to write to file
 * cb: The callback function
 **/
RUG.prototype.outputToFile = function (data, cb) {
  var filename = config.writeToFile || "output.txt";

  this.log("Outputting to file " + config.writeToFile);

  fs.writeFile(filename, JSON.stringify(data), function (err) {
    if (err) {
      throw err;
    }

    cb(data);
  });
};

module.exports = RUG;