"use strict";

var Cylon = require("cylon");

Cylon.robot({

  connections: {
    "iot-analytics": {
      adaptor: "intel-iot-analytics",
      username: "username",
      password: "password"
    }
  },

  devices: {
    iot: { driver: "iot" }
  },

  work: function(my) {
    var accountId = "f5dbea6a-7115-4f77-9919-63c23ec83d9b";
    console.log("Connecting to IoT analytics:");
    my.iot.getAllTags(accountId, function(err, devices) {
      console.log("error:", err);
      console.log("Account tags:", devices);
    });
  }

}).start();
