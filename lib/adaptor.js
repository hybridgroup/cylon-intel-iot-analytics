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
Adaptor.prototype._restOptions = function(path, data, query, token) {
  return({
    url: this.baseUrl + path,
    options: {
      headers: {
        "content-type": "application/json"
      },
      accessToken: token || this.token,
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
 * @param {Object} data - Body params (form data)
 * @param {Object} query - URL Params
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._rest = function(type, path, data, query, userCb, token) {
 var params =  this._restOptions(path, data, query, token);

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
   case "put-json":
     rest
        .putJson(params.url, data, params.options)
        .on("complete", this._defCb(userCb).bind(this));
     break;
   case "delete":
     rest
        .del(params.url, params.options)
        .on("complete", this._defCb(userCb).bind(this));
     break;
 }
};

/**
 * Executes REST GET request
 *
 * @param {String} path - Route to the API resource
 * @param {Object} query - URL Params
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._get = function(path, query, userCb) {
  this._rest("get", path, null, query, userCb);
};

/**
 * Executes REST POST request
 *
 * @param {String} path - Route to the API resource
 * @param {Object} data - Body params (form data)
 * @param {Object} query - URL Params
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._post = function(path, data, query, userCb) {
  this._rest("post", path, data, query, userCb);
};

/**
 * Executes REST POST request with json type
 *
 * @param {String} path - Route to the API resource
 * @param {Object} data - The object to be passed as json param
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._postJson = function(path, data, userCb, token) {
  this._rest("post-json", path, data, null, userCb, token);
};

/**
 * Executes REST PUT request
 *
 * @param {String} path - Route to the API resource
 * @param {Object} data - Body params (form data)
 * @param {Object} query - URL Params
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._put = function(path, data, query, userCb) {
  this._rest("put", path, data, query, userCb);
};

/**
 * Executes REST PUT request with json type
 *
 * @param {String} path - Route to the API resource
 * @param {Object} data - Body params (form data)
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._putJson = function(path, data, userCb) {
  this._rest("put-json", path, data, null, userCb);
};

/**
 * Executes REST DELETE request
 *
 * @param {String} path - Route to the API resource
 * @param {Object} data - Body params (form data)
 * @param {Object} query - URL Params
 * @param {Function} callback - called on complete: function(err, res) {}
 * @private
 */
Adaptor.prototype._del = function(path, data, query, userCb) {
  this._rest("delete", path, data, query, userCb);
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
 * @publish
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
 * @publish
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
 * @publish
 */
Adaptor.prototype.refreshActivationCode = function(accountId, userCb) {
  var route = "/accounts/" + accountId + "/activationcode/refresh";

  this._put(route, null, null, userCb);
};

/**
 * Get a list of devices
 * GET /accounts/<account_id>/devices
 *
 * @param {String} accountId - The account the devices belong to
 * @param {String} [filters] - Filter the list of devices
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
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
 * @param {String} accountId - The account the device belongs to
 * @param {String} deviceId - The Id of the device
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
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
 * @param {String} accountId - The account to create the new device in
 * @param {Object} device - The device
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.createDevice = function(accountId, device, userCb) {
  this._postJson("/accounts/" + accountId + "/devices", device, userCb);
};

/**
 * Update an existing device
 * POST /accounts/<account_id>/devices/<device_id>
 *
 * @param {String} accountId - The account the device belongs to
 * @param {String} DeviceId - The device to be updated
 * @param {Object} device - The device details
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.updateDevice = function(accountId, deviceId, device, userCb) {
  var route = "/accounts/" + accountId + "/devices/" + deviceId;

  this._postJson(route, device, userCb);
};

/**
 * Activate a existing device
 * POST /accounts/<account_id>/devices/<device_id>
 *
 * @param {String} accountId - The account the device belongs to
 * @param {String} DeviceId - The device to be updated
 * @param {Object} device - The device details
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.activateDevice = function(accountId, deviceId, code, userCb) {
  var route = "/accounts/" + accountId + "/devices/" + deviceId + "/activation";
  code = { activationCode: code };

  this._putJson(route, code, userCb);
};

/**
 * Delete a device
 * DELETE /accounts/<account_id>/devices/<device_id>
 *
 * @param {String} accountId - The account the device belongs to
 * @param {String} DeviceId - The device to be deleted
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.deleteDevice = function(accountId, deviceId, userCb) {
  var route = "/accounts/" + accountId + "/devices/" + deviceId;

  this._del(route, null, null, userCb);
};

/**
 * Add a componenent to a device
 * POST /accounts/<account_id>/devices/<device_id>/components
 *
 * @param {String} accountId - The account the device belongs to
 * @param {String} DeviceId - The device to be deleted
 * @param {Object} component - The component to be added
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.addComponent = function(aId, dId, dToken, com,  userCb) {
  var route = "/accounts/" + aId + "/devices/" + dId + "/components";

  this._postJson(route, com, userCb, dToken);
};

/**
 * Delete a componenent from a device
 * DELETE /accounts/<account_id>/devices/<device_id>/components/<cid>
 *
 * @param {String} accountId - The account the device belongs to
 * @param {String} DeviceId - The device the component belongs to
 * @param {String} componentId - The component to be deleted
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.removeComponent = function(aId, dId, cId, userCb) {
  var route = "/accounts/" + aId + "/devices/" + dId + "/components/" + cId;

  this._del(route, null, null, userCb);
};

/**
 * List all tags for devices
 * GET /accounts/<account_id>/devices/tags
 *
 * @param {String} accountId - The account the device belongs to
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.getAllTags = function(aId, userCb) {
  this._get("/accounts/" + aId + "/devices/tags", null, userCb);
};


/**
 * List all attributes for devices
 * GET /accounts/<account_id>/devices/attributes
 *
 * @param {String} accountId - The account the device belongs to
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.getAllAttrs = function(aId, userCb) {
  this._get("/accounts/" + aId + "/devices/attributes", null, userCb);
};

/**
 * List all componenets for an account
 * GET /accounts/<account_id>/cmpcatalog
 *
 * @param {String} accountId - The account the device belongs to
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.getAllComponents = function(aId, userCb) {
  this._get("/accounts/" + aId + "/cmpcatalog", { full: true }, userCb);
};

/**
 * Get component details
 * GET /accounts/<account_id>/cmpcatalog/<component_id>
 *
 * @param {String} accountId - The account the device belongs to
 * @param {String} componentId - The component ID
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.component = function(aId, cId, userCb) {
  this._get("/accounts/" + aId + "/cmpcatalog/" + cId, { full: true }, userCb);
};

/**
 * Creates a new custom component
 * POST /accounts/<account_id>/cmpcatalog
 *
 * @param {String} accountId - The account we want to add the new component to
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.createComponent = function(accountId, component, userCb) {
  this._postJson("/accounts/" + accountId + "/cmpcatalog", component, userCb);
};

/**
 * Update a custom component
 * POST /accounts/<account_id>/cmpcatalog/<cid>
 *
 * @param {String} accountId - The account we want to add the new component to
 * @param {String} componentId - The component to be modified
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.updateComponent = function(aId, cId, component, userCb) {
  this._putJson("/accounts/" + aId + "/cmpcatalog/" + cId, component, userCb);
};

/**
 * Submit data to a devices component
 * POST /data/<device_id>
 *
 * @param {String} accountId - The account we want to add the new component to
 * @param {String} deviceId - The device we want to add data to
 * @param {Array} data - Array of objects with component data details
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.submitData = function(aId, dId, dToken, data, userCb) {
  data = {
    on: Date.now(),
    accountId: aId,
    data: data
  };

  this._postJson("/data/" + dId, data, userCb, dToken);
};

/**
 * Retrieve data from device
 * POST /accounts/<account_id>/data/search
 *
 * @param {String} accountId - The account we want to add the new component to
 * @param {Object} filters - filters for the search
 * @param {Function} callback - called on complete: function(err, res) {}
 * @publish
 */
Adaptor.prototype.retrieveData = function(aId, filters, userCb) {
  this._postJson("/accounts/" + aId + "/data/search", filters, userCb);
};
