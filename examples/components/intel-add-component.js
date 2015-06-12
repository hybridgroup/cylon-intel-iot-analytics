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
    var com = {
      cid: "arduino-uno-id1-altitute.v1.0",
      name: "altitude 01",
      type: "altitude.v1.1"
    };

    // This is the device authorization token generated when
    // the device arduino-uno-id1 was activated
    var deviceToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...";

    var aId = "f5dbea6a-7115-4f77-9919-63c23ec83d9b";

    var callback = function(err, res) {
      console.log("error:", err);
      console.log("Component:", res);
    };

    console.log("Connecting to IoT analytics:");
    my.iot.addComponent(aId, "arduino-uno-id1", deviceToken, com, callback);
  }

}).start();
