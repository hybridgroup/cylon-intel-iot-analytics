/*
 * cylon-intel-iot-analytics adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var rest = require("restler");

 /**
 * Intel-IoT-Analytics Adaptor
 *
 * @constructor
 *
 * @param {Object} opts - Options to setup the adaptor
 * @property {String} username - Used to login to enable.iot dev portal
 * @property {String} password - Used to login to enable.iot dev portal
 * @property {String} [baseUrl] - Optional baseUrl for different API version
 */
var Adaptor = module.exports = function Adaptor(opts) {
  Adaptor.__super__.constructor.apply(this, arguments);

  this.baseUrl = opts.baseUrl || "https://dashboard.us.enableiot.com/v1/api";

  this.username = opts.username;
  this.password = opts.password;

  opts = opts || {};
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

/**
 * Setups connections to the device and starts work
 * @param {function} callback - To start work when connected
 */
Adaptor.prototype.connect = function(callback) {
  this._getToken(function(err, result) {
    if (!!err) {
      this.emit("error", "Access token could not be retrieved!");
    } else {
      this.token = result.token;
    }
    callback();
  }.bind(this));
};

/**
 * Terminates connections, disconnects device and kills all pending work
 * @param {function} callback - To start work when connected
 */
Adaptor.prototype.disconnect = function(callback) {
  callback();
};

 /**
 * Returns a default callback function for rest calls
 *
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._defCb = function(callback) {
  return function(result) {
    if (typeof(callback) === "function") {
      if (result instanceof Error) {
        callback(result, null);
      } else {
        callback(null, result);
      }
    } else {
      if (result instanceof Error) {
        this.emit("error", result);
      }
    }
  };
};

/**
 * Returns default params for rest calls
 *
 * @param {String} path - Route to the API resource
 * @param {Object} data - To be passed to the rest call
 * @private
 */
Adaptor.prototype._restOptions = function(path, data, query) {
  return({
    url: this.baseUrl + path,
    options: {
      headers: {
        "content-type": "application/json"
      },
      accessToken: this.token,
      query: query || {},
      data: data || {}
    }
  });
};

/**
 * Executes a REST request
 *
 * @param {String} Type - GET, POST, PUT or DELETE
 * @param {String} path - Route to the API resource
 * @param {Object} data - Body parameters (POST)
 * @param {Object} query - Query parameters (GET)
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._rest = function(type, path, data, query, userCb) {
 var params =  this._restOptions(path, data, query);

 switch(type.toLowerCase()) {
   case "get":
     rest
        .get(params.url, params.options)
        .on("complete", this._defCb(userCb).bind(this));
     break;
   case "post":
     rest
        .post(params.url, params.options)
        .on("complete", this._defCb(userCb).bind(this));
     break;
   case "put":
     rest
        .put(params.url, params.options)
        .on("complete", this._defCb(userCb).bind(this));
     break;
   case "post-json":
     rest
        .postJson(params.url, data, params.options)
        .on("complete", this._defCb(userCb).bind(this));
     break;
 }
};

/**
 * Executes REST POST request
 *
 * @param {String} path - Route to the API resource
 * @param {Object} data - To be passed to the rest call
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._post = function(path, data, query, userCb) {
  this._rest("post", path, data, query, userCb);
};

/**
 * Executes REST POST with json type
 *
 * @param {String} path - Route to the API resource
 * @param {Object} data - The object to be passed as json param
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._postJson = function(path, data, userCb) {
  this._rest("post-json", path, data, null, userCb);
};

/**
 * Executes REST GET request
 *
 * @param {String} path - Route to the API resource
 * @param {Object} data - To be passed to the rest call
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._get = function(path, query, userCb) {
  this._rest("get", path, null, query, userCb);
};

/**
 * Executes REST PUT request
 *
 * @param {String} path - Route to the API resource
 * @param {Object} data - To be passed to the rest call
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._put = function(path, data, query, userCb) {
  this._rest("put", path, data, query, userCb);
};

/**
 * Request a new token
 * POST /auth/token
 *
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._getToken = function(userCb) {
  var data = {
    username: this.username,
    password: this.password
  };

  this._post("/auth/token", data, null, userCb);
};

/**
 * Get account details
 * GET /accounts/<account_id>
 *
 * @param {String} accountId - The account to get details for
 * @param {Function} callback - called on complete: function(err, res) {}
 * @public
 */
Adaptor.prototype.accountInfo = function(accountId, userCb) {
  this._get("/accounts/" + accountId, null, userCb);
};

/**
 * Retrieve account activation code
 * GET /accounts/<account_id>/activationcode
 *
 * @param {String} accountId - The account to get details for
 * @param {Function} callback - called on complete: function(err, res) {}
 * @public
 */
Adaptor.prototype.activationCode = function(accountId, userCb) {
  this._get("/accounts/" + accountId + "/activationcode", null, userCb);
};

/**
 * Forces the renewal of the account activation code
 * PUT /accounts/<account_id>/activationcode/refresh
 *
 * @param {String} accountId - The account to get details for
 * @param {Function} callback - called on complete: function(err, res) {}
 * @public
 */
Adaptor.prototype.refreshActivationCode = function(accountId, userCb) {
  var route = "/accounts/" + accountId + "/activationcode/refresh";
  this._put(route, null, null, userCb);
};

/**
 * Get a list of devices
 * GET /accounts/<account_id>/devices
 *
 * @param {String} accountId - The account to get details for
 * @param {String} [filters] - Filter the list of devices
 * @param {Function} callback - called on complete: function(err, res) {}
 * @public
 */
Adaptor.prototype.devices = function(accountId, filters, userCb) {
  if (typeof(filters) === "function") {
    userCb = filters;
    filters = {};
  }

  this._get("/accounts/" + accountId + "/devices", filters, userCb);
};

/**
 * Get device details
 * GET /accounts/<account_id>/devices/<device_id>
 *
 * @param {String} accountId - The account to get details for
 * @param {String} deviceId - The Id of the device
 * @param {Function} callback - called on complete: function(err, res) {}
 * @public
 */
Adaptor.prototype.device = function(accountId, deviceId, userCb) {
  if (typeof(deviceId) === "function") {
    userCb = deviceId;
    deviceId = {};
  }

  this._get("/accounts/" + accountId + "/devices/" + deviceId, null, userCb);
};

/**
 * Creates a new device
 * POST /accounts/<account_id>/devices
 *
 * @param {String} accountId - The account to get details for
 * @param {String} deviceId - The Id of the device
 * @param {Function} callback - called on complete: function(err, res) {}
 * @public
 */
Adaptor.prototype.createDevice = function(accountId, device, userCb) {
  this._postJson("/accounts/" + accountId + "/devices", device, userCb);
};
