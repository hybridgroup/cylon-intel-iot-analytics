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
    var filters = {
      sort: "name",
      order: "asc",
      limit: 5,
      skip: 0,
      status: "created"
    };

    console.log("Connecting to IoT analytics:");
    my.iot.devices(aId, filters, function(err, devices) {
      console.log("error:", err);
      console.log("Devices:", devices);
    });
  }

}).start();
