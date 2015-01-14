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
    var data = [
      {
        "componentId": "arduino-uno-id1-dist.v1.0",
        "on": Date.now() - 120,
        "loc": [ 45.5434085, -122.654422, 124.3 ],
        "value": "10.7"
      },
      {
        "componentId": "arduino-uno-id1-dist.v1.0",
        "on": Date.now() - 60,
        "loc": [ 45.5434085, -122.654422 ],
        "value": "26.8"
      },
      {
        "componentId": "arduino-uno-id1-dist.v1.0",
        "on": Date.now(),
        "value": "35",
        "attributes": {
          "accuracy": "±2%RH",
          "reading": "digital"
        }
      }
    ];

    var deviceToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJS...";

    var aId = "f5dbea6a-7115-4f77-9919-63c23ec83d9b",
        dId = "arduino-uno-id1";

    console.log("Connecting to IoT analytics:");
    my.iot.submitData(aId, dId, deviceToken, data, function(err, res) {
      console.log("error:", err);
      console.log("Component:", res);
    });
  }

}).start();
