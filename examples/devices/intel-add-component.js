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
      "cid": "raspi-01-temperature.v1.0-01",
      "name": "temp",
      "type": "temperature.v1.0"
    };

    var deviceToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJ-b7A....",
        aId = "f5dbea6a-7115-4f77-9919-63c23ec83d9b";

    var callback =  function(err, res) {
      console.log("error:", err);
      console.log("Component:", res);
    };

    console.log("Connecting to IoT analytics:");

    my.iot.addComponent(aId, "raspi-01", com, deviceToken, callback);
  }

}).start();
