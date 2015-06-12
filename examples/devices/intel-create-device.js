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
    var device = {
      deviceId: "raspi-01",
      gatewayId: "24-a5-80-21-5b-29",
      name: "Raspberry Pi 1",
      tags: ["raspi", "raspberry-pi", "cylon"],
      loc: [ 45.5434085, -122.654422, 124.3 ],
      attributes: {
        vendor: "intel",
        platform: "x86",
        os: "linux"
      }
    };

    console.log("Connecting to IoT analytics:");
    my.iot.createDevice(aId, device, function(err, res) {
      console.log("error:", err);
      console.log("New Device:", res);
    });
  }

}).start();
