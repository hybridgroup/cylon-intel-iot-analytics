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
    console.log("Connecting to IoT analytics:");
    my.iot.device("f5dbea6a-7115-4f77-9919-63c23ec83d9b", "arduino-uno-id1", function(err, device) {
      console.log("error:", err);
      console.log("Device details:", device);
    });
  }

}).start();
