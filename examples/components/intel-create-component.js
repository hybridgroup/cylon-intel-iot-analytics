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
    var component ={
      "dimension": "altitute",
      "version": "1.0",
      "type": "sensor",
      "dataType":"Number",
      "format": "float",
      "min": -150,
      "max": 150,
      "measureunit": "Meters",
      "display": "timeSeries"
    };

    console.log("Connecting to IoT analytics:");
    my.iot.createComponent("f5dbea6a-7115-4f77-9919-63c23ec83d9b", component, function(err, res) {
      console.log("error:", err);
      console.log("Component:", res);
    });
  }

}).start();
