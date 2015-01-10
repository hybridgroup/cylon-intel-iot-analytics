/*
 * cylon-intel-iot-analytics
 * http://cylonjs.com
 *
 * Copyright (c) 2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Adaptor = require("./adaptor"),
    Driver = require("./driver");

module.exports = {
  // Adaptors your module provides, e.g. ['spark']
  adaptors: ["intel-iot-analytics"],

  // Drivers your module provides, e.g. ['led', 'button']
  drivers: ["iot"],

  // Modules intended to be used with yours, e.g. ['cylon-gpio']
  dependencies: [],

  adaptor: function(opts) {
    return new Adaptor(opts);
  },

  driver: function(opts) {
    if (opts.driver === "iot") {
      return new Driver(opts);
    }
  }
};
