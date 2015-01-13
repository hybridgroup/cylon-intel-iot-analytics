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
    var component = {
      "cid": "raspi-01-com-01",
      "name": "temp",
      "type": "temperature.v1.0"
    };

    console.log("Connecting to IoT analytics:");
    my.iot.addComponent("f5dbea6a-7115-4f77-9919-63c23ec83d9b", "raspi-01", component, function(err, res) {
      console.log("error:", err);
      console.log("Component:", res);
    });
  }

}).start();
