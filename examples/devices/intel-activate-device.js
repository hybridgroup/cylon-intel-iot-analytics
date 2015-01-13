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
    my.iot.refreshActivationCode("f5dbea6a-7115-4f77-9919-63c23ec83d9b", function(err, data) {
      console.log("Activation code: ", data);
      var ac = data.activationCode;
      my.iot.activateDevice("f5dbea6a-7115-4f77-9919-63c23ec83d9b", "arduino-uno-id1", ac, function(err, res) {
        console.log("error:", err);
        console.log("Result:", res);
      });
    });
  }

}).start();
