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
    var filters = {
      from: -3600,
      to: Date.now(),
      targetFilter: {
        deviceList: [
          "arduino-uno-id1"
        ]
      },
      metrics: [
        { id: "arduino-uno-id1-dist.v1.0" }
      ]
    };

    var aId = "f5dbea6a-7115-4f77-9919-63c23ec83d9b";

    console.log("Connecting to IoT analytics:");
    my.iot.retrieveData(aId, filters, function(err, res) {
      console.log("error:", err);
      console.log("Data:", res);
      if (!err && (res.series.length > 0)) {
        console.log("Data:", res.series[0]);
      }
    });
  }

}).start();
