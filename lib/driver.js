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
  // Include a list of commands that will be made available to the API.
  var commands = [
    "accountInfo",
    "activationCode",
    "refreshActivationCode",
    "devices",
    "device",
    "createDevice",
    "activateDevice",
    "deleteDevice",
    "addComponent",
    "removeComponent",
    "getAllAttrs",
    "getAllTags",
    "getAllComponents",
    "createComponent",
    "updateComponent",
    "submitData",
    "retrieveData"
  ];

  Driver.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.setupCommands(commands);
};

Cylon.Utils.subclass(Driver, Cylon.Driver);

/**
 * Starts the driver.
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
Driver.prototype.start = function(callback) {
  callback();
};

/**
 * Stops the driver.
 *
 * @param {Function} callback to be triggered when halted
 * @return {void}
 */
Driver.prototype.halt = function(callback) {
  callback();
};

/**
 * Get account details
 *
 * @param {String} accountId The account to get details for
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.accountInfo = function(accountId, callback) {
  this.connection.accountInfo(accountId, callback);
};

/**
 * Retrieve account activation code
 *
 * @param {String} accountId The account to get details for
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.activationCode = function(accountId, callback) {
  this.connection.activationCode(accountId, callback);
};

/**
 * Refresh account activation code
 *
 * @param {String} accountId The account to get details for
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.refreshActivationCode = function(accountId, callback) {
  this.connection.refreshActivationCode(accountId, callback);
};

/**
 * Get a list of all devices
 *
 * @param {String} accountId The account to get details for
 * @param {String} filters The account to get details for
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.devices = function(accountId, filters, callback) {
  this.connection.devices(accountId, filters, callback);
};

/**
 * Get device details
 *
 * @param {String} accountId The account to get details for
 * @param {String} filters filters to use when fetching
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.device = function(accountId, filters, callback) {
  this.connection.device(accountId, filters, callback);
};

/**
 * Create a new device
 *
 * @param {String} accountId The account we want to add the  device to
 * @param {Object} device The device details
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.createDevice = function(accountId, device, callback) {
  this.connection.createDevice(accountId, device, callback);
};

/**
 * Update an existing device
 *
 * @param {String} accountId The account the device belongs to
 * @param {String} dId The device to be updated
 * @param {Object} device The device details
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.updateDevice = function(accountId, dId, device, callback) {
  this.connection.updateDevice(accountId, dId, device, callback);
};

/**
 * Activate a existing device
 *
 * @param {String} accountId The account the device belongs to
 * @param {String} dId The device to be updated
 * @param {Object} code activation code
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.activateDevice = function(accountId, dId, code, callback) {
  this.connection.activateDevice(accountId, dId, code, callback);
};

/**
 * Delete a device
 *
 * @param {String} accountId The account the device belongs to
 * @param {String} deviceId The device to be deleted
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.deleteDevice = function(accountId, deviceId, callback) {
  this.connection.deleteDevice(accountId, deviceId, callback);
};

 /**
 * Add a component to a device
 *
 * @param {String} aId The account the device belongs to
 * @param {String} dId The device to be updated
 * @param {String} token token
 * @param {Object} component The component to be added
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.addComponent = function(aId, dId, token, component, callback) {
  this.connection.addComponent(aId, dId, token, component, callback);
};

 /**
 * Delete a component from a device
 *
 * @param {String} aId The account the device belongs to
 * @param {String} dId The device the component belongs to
 * @param {String} cId The component to be deleted
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.removeComponent = function(aId, dId, cId, callback) {
  this.connection.removeComponent(aId, dId, cId, callback);
};

/**
 * List all tags for devices
 *
 * @param {String} accountId The account the device belongs to
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.getAllTags = function(accountId, callback) {
  this.connection.getAllTags(accountId, callback);
};


/**
 * List all attributes for devices
 *
 * @param {String} accountId The account the device belongs to
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.getAllAttrs = function(accountId, callback) {
  this.connection.getAllAttrs(accountId, callback);
};

/**
 * List all components for an account
 *
 * @param {String} accountId The account the device belongs to
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.getAllComponents = function(accountId, callback) {
  this.connection.getAllComponents(accountId, callback);
};

/**
 * Get component details
 *
 * @param {String} accountId The account the device belongs to
 * @param {String} componentId The component ID
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.component = function(accountId, componentId, callback) {
  this.connection.component(accountId, componentId, callback);
};

/**
 * Create a new component
 *
 * @param {String} accountId The account we want to add the  device to
 * @param {Object} component The component details
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.createComponent = function(accountId, component, callback) {
  this.connection.createComponent(accountId, component, callback);
};

/**
 * Update a component
 *
 * @param {String} aId The account we want to add the  device to
 * @param {String} cId The account we want to add the  device to
 * @param {Object} component The component details
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.updateComponent = function(aId, cId, component, callback) {
  this.connection.updateComponent(aId, cId, component, callback);
};

/**
 * Submit data to a device component
 *
 * @param {String} aId The account we want to add the new component to
 * @param {String} dId The device we want to add data to
 * @param {String} token device token
 * @param {Array} data Array of objects with component data details
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.submitData = function(aId, dId, token, data, callback) {
  this.connection.submitData(aId, dId, token, data, callback);
};

/**
 * Retrieve data from device
 *
 * @param {String} accountId The account we want to add the new component to
 * @param {Object} filters filters for the search
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Driver.prototype.retrieveData = function(accountId, filters, callback) {
  this.connection.retrieveData(accountId, filters, callback);
};
