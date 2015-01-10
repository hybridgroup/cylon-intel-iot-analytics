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

var Adaptor = module.exports = function Adaptor(opts) {
  Adaptor.__super__.constructor.apply(this, arguments);

  this.baseUrl = opts.baseUrl || "https://dashboard.us.enableiot.com/v1/api";

  this.username = opts.username;
  this.password = opts.password;

  opts = opts || {};
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

Adaptor.prototype.connect = function(callback) {
  this._getToken(function(err, result) {
    this.token = result.token;
    callback();
  }.bind(this));
};

Adaptor.prototype.disconnect = function(callback) {
  callback();
};


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

Adaptor.prototype._restParams = function(path, data) {
  return({
    url: this.baseUrl + path,
    options: {
      headers: {
        "content-type": "application/json"
      },
      accessToken: this.token,
      data: data || {}
    }
  });
};

Adaptor.prototype._post = function(path, data, userCb) {
 var params =  this._restParams(path, data);

 rest
    .post(params.url, params.options)
    .on("complete", this._defCb(userCb).bind(this));
};

Adaptor.prototype._get = function(path, data, userCb) {
 var params =  this._restParams(path, data);

 rest
    .get(params.url, params.options)
    .on("complete", this._defCb(userCb).bind(this));
};

// POST /auth/token
Adaptor.prototype._getToken = function(userCb) {
  var data = {
    username: this.username,
    password: this.password
  };

  this._post("/auth/token", data, userCb);
};

// GET /accounts/<account_id>
Adaptor.prototype.accountInfo = function(accountId, userCb) {
  this._get("/accounts/" + accountId, null, userCb);
};
