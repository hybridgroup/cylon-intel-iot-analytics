/*
 * cylon-intel-iot-analytics driver
 * http://cylonjs.com
 *
 * Copyright (c) 2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var Driver = module.exports = function Driver(opts) {
  Driver.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  // Include a list of commands that will be made available to the API.
  this.commands = {
    accountInfo: this.accountInfo,
    activationCode: this.activationCode,
    refreshActivationCode: this.refreshActivationCode,
    devices: this.devices,
    device: this.device,
    createDevice: this.createDevice
  };
};

Cylon.Utils.subclass(Driver, Cylon.Driver);

/**
 * Starts the driver.
 *
 * @param {Function} callback to be triggered when started
 * @return {null}
 */
Driver.prototype.start = function(callback) {
  callback();
};

/**
 * Stops the driver.
 *
 * @param {Function} callback to be triggered when halted
 * @return {null}
 */
Driver.prototype.halt = function(callback) {
  callback();
};

/**
 * Get account details
 *
 * @param {String} accountId - The account to get details for
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Driver.prototype.accountInfo = function(accountId, callback) {
  this.connection.accountInfo(accountId, callback);
};

/**
 * Retrieve account activation code
 *
 * @param {String} accountId - The account to get details for
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Driver.prototype.activationCode = function(accountId, callback) {
  this.connection.activationCode(accountId, callback);
};

/**
 * Refresh account activation code
 *
 * @param {String} accountId - The account to get details for
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Driver.prototype.refreshActivationCode = function(accountId, callback) {
  this.connection.refreshActivationCode(accountId, callback);
};

/**
 * Get a list of all devices
 *
 * @param {String} accountId - The account to get details for
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Driver.prototype.devices = function(accountId, filters, callback) {
  this.connection.devices(accountId, filters, callback);
};

/**
 * Get device details
 *
 * @param {String} accountId - The account to get details for
 * @param {String} deviceId - The Id of the device
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Driver.prototype.device = function(accountId, filters, callback) {
  this.connection.device(accountId, filters, callback);
};

/**
 * Creates a new device
 *
 * @param {String} accountId - The account to get details for
 * @param {Object} device - The device details
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Driver.prototype.createDevice = function(accountId, device, callback) {
  this.connection.createDevice(accountId, device, callback);
};
