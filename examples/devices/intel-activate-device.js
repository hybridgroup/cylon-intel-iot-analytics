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
    var aId = "f5dbea6a-7115-4f77-9919-63c23ec83d9b";
    console.log("Connecting to IoT analytics:");
    my.iot.refreshActivationCode(aId, function(err, data) {
      if (err) { console.error(err); }

      console.log("Activation code: ", data);

      var ac = data.activationCode;

      my.iot.activateDevice(aId, "arduino-uno-id1", ac, function(error, res) {
        if (error) { console.error(error); }

        console.log("Result:", res);
      });
    });
  }

}).start();
