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
 * @constructor IntelIOTAnalytics
 *
 * @param {Object} opts options to setup the adaptor
 * @param {String} opts.username used to login to enable.iot dev portal
 * @param {String} opts.password used to login to enable.iot dev portal
 * @param {String} [opts.baseUrl] optional baseUrl for different API version
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
 * @param {function} callback function to invoke when connected
 * @return {void}
 */
Adaptor.prototype.connect = function(callback) {
  this._getToken(function(err, result) {
    if (err) {
      this.emit("error", "Access token could not be retrieved!");
      return callback(err);
    }

    this.token = result.token;
    callback();
  }.bind(this));
};

/**
 * Terminates connections, disconnects device and kills all pending work
 * @param {function} callback function to invoke when disconnected
 * @return {void}
 */
Adaptor.prototype.disconnect = function(callback) {
  callback();
};

 /**
 * Returns a default callback function for rest calls
 *
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {Function} a callback function
 * @private
 */
Adaptor.prototype._defCb = function(callback) {
  return function(result) {
    if (typeof callback === "function") {
      if (result instanceof Error) {
        return callback(result, null);
      }

      return callback(null, result);
    }

    if (result instanceof Error) {
      return this.emit("error", result);
    }

    this.emit("success", result);
  }.bind(this);
};

/**
 * Returns default params for rest calls
 *
 * @param {String} path route to the API resource
 * @param {Object} data to be passed to the rest call
 * @param {Object} query request query data
 * @param {String} token access token
 * @return {void}
 * @private
 */
Adaptor.prototype._restOptions = function(path, data, query, token) {
  return {
    url: this.baseUrl + path,
    options: {
      headers: {
        "content-type": "application/json"
      },
      accessToken: token || this.token,
      query: query || {},
      data: data || {}
    }
  };
};

/**
 * Executes a REST request
 *
 * @param {String} verb GET, POST, PUT or DELETE
 * @param {String} path Route to the API resource
 * @param {Object} data Body params (form data)
 * @param {Object} query URL Params
 * @param {Function} callback called on complete: function(err, res) {}
 * @param {String} token authentication token
 * @return {void}
 * @private
 */
Adaptor.prototype._rest = function(verb, path, data, query, callback, token) {
  var params = this._restOptions(path, data, query, token);

  switch (verb) {
    case "postJson":
    case "putJson":
      rest[verb].call(null, params.url, data, params.options)
        .on("complete", this._defCb(callback));
      break;
    default:
      rest[verb].call(null, params.url, params.options)
        .on("complete", this._defCb(callback));
      break;
  }
};

/**
 * Executes REST GET request
 *
 * @param {String} path Route to the API resource
 * @param {Object} query URL Params
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @private
 */
Adaptor.prototype._get = function(path, query, callback) {
  this._rest("get", path, null, query, callback);
};

/**
 * Executes REST POST request
 *
 * @param {String} path Route to the API resource
 * @param {Object} data Body params (form data)
 * @param {Object} query URL Params
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @private
 */
Adaptor.prototype._post = function(path, data, query, callback) {
  this._rest("post", path, data, query, callback);
};

/**
 * Executes REST POST request with json type
 *
 * @param {String} path Route to the API resource
 * @param {Object} data The object to be passed as json param
 * @param {Function} callback called on complete: function(err, res) {}
 * @param {String} token authentication token
 * @return {void}
 * @private
 */
Adaptor.prototype._postJson = function(path, data, callback, token) {
  this._rest("postJson", path, data, null, callback, token);
};

/**
 * Executes REST PUT request
 *
 * @param {String} path Route to the API resource
 * @param {Object} data Body params (form data)
 * @param {Object} query URL Params
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @private
 */
Adaptor.prototype._put = function(path, data, query, callback) {
  this._rest("put", path, data, query, callback);
};

/**
 * Executes REST PUT request with json type
 *
 * @param {String} path Route to the API resource
 * @param {Object} data Body params (form data)
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @private
 */
Adaptor.prototype._putJson = function(path, data, callback) {
  this._rest("putJson", path, data, null, callback);
};

/**
 * Executes REST DELETE request
 *
 * @param {String} path Route to the API resource
 * @param {Object} data Body params (form data)
 * @param {Object} query URL Params
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @private
 */
Adaptor.prototype._del = function(path, data, query, callback) {
  this._rest("del", path, data, query, callback);
};

/**
 * Request a new token
 * POST /auth/token
 *
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @private
 */
Adaptor.prototype._getToken = function(callback) {
  var data = {
    username: this.username,
    password: this.password
  };

  this._post("/auth/token", data, null, callback);
};

/**
 * Get account details
 * GET /accounts/<account_id>
 *
 * @param {String} accountId The account to get details for
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.accountInfo = function(accountId, callback) {
  this._get("/accounts/" + accountId, null, callback);
};

/**
 * Retrieve account activation code
 * GET /accounts/<account_id>/activationcode
 *
 * @param {String} accountId The account to get details for
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.activationCode = function(accountId, callback) {
  this._get("/accounts/" + accountId + "/activationcode", null, callback);
};

/**
 * Forces the renewal of the account activation code
 * PUT /accounts/<account_id>/activationcode/refresh
 *
 * @param {String} accountId The account to get details for
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.refreshActivationCode = function(accountId, callback) {
  var route = "/accounts/" + accountId + "/activationcode/refresh";

  this._put(route, null, null, callback);
};

/**
 * Get a list of devices
 * GET /accounts/<account_id>/devices
 *
 * @param {String} accountId The account the devices belong to
 * @param {String} [filters] Filter the list of devices
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.devices = function(accountId, filters, callback) {
  if (typeof filters === "function") {
    callback = filters;
    filters = {};
  }

  this._get("/accounts/" + accountId + "/devices", filters, callback);
};

/**
 * Get device details
 * GET /accounts/<account_id>/devices/<device_id>
 *
 * @param {String} accountId The account the device belongs to
 * @param {String} deviceId The Id of the device
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.device = function(accountId, deviceId, callback) {
  this._get("/accounts/" + accountId + "/devices/" + deviceId, null, callback);
};

/**
 * Creates a new device
 * POST /accounts/<account_id>/devices
 *
 * @param {String} accountId The account to create the new device in
 * @param {Object} device The device
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.createDevice = function(accountId, device, callback) {
  this._postJson("/accounts/" + accountId + "/devices", device, callback);
};

/**
 * Update an existing device
 * PUT /accounts/<account_id>/devices/<device_id>
 *
 * @param {String} accountId The account the device belongs to
 * @param {String} deviceId The device to be updated
 * @param {Object} device The device details
 * @param {Function} cb called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.updateDevice = function(accountId, deviceId, device, cb) {
  var route = "/accounts/" + accountId + "/devices/" + deviceId;

  this._putJson(route, device, cb);
};

/**
 * Activate a existing device
 * PUT /accounts/<account_id>/devices/<device_id>
 *
 * @param {String} accountId The account the device belongs to
 * @param {String} deviceId The device to be updated
 * @param {Object} code device activation code
 * @param {Function} cb called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.activateDevice = function(accountId, deviceId, code, cb) {
  var route = "/accounts/" + accountId + "/devices/" + deviceId + "/activation";
  code = { activationCode: code };

  this._putJson(route, code, cb);
};

/**
 * Delete a device
 * DELETE /accounts/<account_id>/devices/<device_id>
 *
 * @param {String} accountId The account the device belongs to
 * @param {String} deviceId The device to be deleted
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.deleteDevice = function(accountId, deviceId, callback) {
  var route = "/accounts/" + accountId + "/devices/" + deviceId;

  this._del(route, null, null, callback);
};

/**
 * Add a componenent to a device
 * POST /accounts/<account_id>/devices/<device_id>/components
 *
 * @param {String} aId The account the device belongs to
 * @param {String} dId The device to be added to
 * @param {String} dToken token of the device to update
 * @param {Object} com The component to be added
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.addComponent = function(aId, dId, dToken, com, callback) {
  var route = "/accounts/" + aId + "/devices/" + dId + "/components";

  this._postJson(route, com, callback, dToken);
};

/**
 * Delete a componenent from a device
 * DELETE /accounts/<account_id>/devices/<device_id>/components/<cid>
 *
 * @param {String} aId The account the device belongs to
 * @param {String} dId The device the component belongs to
 * @param {String} cId The component to be deleted
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.removeComponent = function(aId, dId, cId, callback) {
  var route = "/accounts/" + aId + "/devices/" + dId + "/components/" + cId;

  this._del(route, null, null, callback);
};

/**
 * List all tags for devices
 * GET /accounts/<account_id>/devices/tags
 *
 * @param {String} aId The account the device belongs to
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.getAllTags = function(aId, callback) {
  this._get("/accounts/" + aId + "/devices/tags", null, callback);
};


/**
 * List all attributes for devices
 * GET /accounts/<account_id>/devices/attributes
 *
 * @param {String} aId The account the device belongs to
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.getAllAttrs = function(aId, callback) {
  this._get("/accounts/" + aId + "/devices/attributes", null, callback);
};

/**
 * List all componenets for an account
 * GET /accounts/<account_id>/cmpcatalog
 *
 * @param {String} aId The account the device belongs to
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.getAllComponents = function(aId, callback) {
  this._get("/accounts/" + aId + "/cmpcatalog", { full: true }, callback);
};

/**
 * Get component details
 * GET /accounts/<account_id>/cmpcatalog/<component_id>
 *
 * @param {String} aId The account the device belongs to
 * @param {String} cId The component ID
 * @param {Function} cb called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.component = function(aId, cId, cb) {
  this._get("/accounts/" + aId + "/cmpcatalog/" + cId, { full: true }, cb);
};

/**
 * Creates a new custom component
 * POST /accounts/<account_id>/cmpcatalog
 *
 * @param {String} accountId The account we want to add the new component to
 * @param {Object} component component data
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.createComponent = function(accountId, component, callback) {
  this._postJson("/accounts/" + accountId + "/cmpcatalog", component, callback);
};

/**
 * Update a custom component
 * POST /accounts/<account_id>/cmpcatalog/<cid>
 *
 * @param {String} aId The account we want to add the new component to
 * @param {String} cId The component to be modified
 * @param {Object} component the component data
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.updateComponent = function(aId, cId, component, callback) {
  this._putJson("/accounts/" + aId + "/cmpcatalog/" + cId, component, callback);
};

/**
 * Submit data to a devices component
 * POST /data/<device_id>
 *
 * @param {String} aId The account we want to add the new component to
 * @param {String} dId The device we want to add data to
 * @param {String} dToken token for device we want to add data to
 * @param {Array} data Array of objects with component data details
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.submitData = function(aId, dId, dToken, data, callback) {
  data = {
    on: Date.now(),
    accountId: aId,
    data: data
  };

  this._postJson("/data/" + dId, data, callback, dToken);
};

/**
 * Retrieve data from device
 * POST /accounts/<account_id>/data/search
 *
 * @param {String} aId the account we want to add the new component to
 * @param {Object} filters filters for the search
 * @param {Function} callback called on complete: function(err, res) {}
 * @return {void}
 * @publish
 */
Adaptor.prototype.retrieveData = function(aId, filters, callback) {
  this._postJson("/accounts/" + aId + "/data/search", filters, callback);
};
