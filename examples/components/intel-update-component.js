"use strict";

var Cylon = require("cylon");

Cylon.robot({

  connections: {
    "iot-analytics": {
      adaptor: "intel-iot-analytics",
      username: "edgar@hybridgroup.com",
      password: "V0lvag1aIA"
    }
  },

  devices: {
    iot: { driver: "iot" }
  },

  work: function(my) {
    var aId = "f5dbea6a-7115-4f77-9919-63c23ec83d9b";
    var component = {
      format: "integer",
      min: -50,
      max: 9000
    };

    console.log("Connecting to IoT analytics:");
    my.iot.updateComponent(aId, "altitute.v1.0", component, function(err, res) {
      console.log("error:", err);
      console.log("Component:", res);
    });
  }

}).start();
