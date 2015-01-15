"use strict";

var mod = source("cylon-intel-iot-analytics");

var Adaptor = source("adaptor"),
    Driver = source("driver");

describe("Cylon.IntelIotAnalytics", function() {
  describe("#adaptors", function() {
    it("is an array of supplied adaptors", function() {
      expect(mod.adaptors).to.be.eql(["intel-iot-analytics"]);
    });
  });

  describe("#drivers", function() {
    it("is an array of supplied drivers", function() {
      expect(mod.drivers).to.be.eql(["iot"]);
    });
  });

  describe("#dependencies", function() {
    it("is an array of supplied dependencies", function() {
      expect(mod.dependencies).to.be.eql([]);
    });
  });

  describe("#driver", function() {
    it("returns an instance of the Driver", function() {
      expect(mod.driver({ driver: "iot" })).to.be.instanceOf(Driver);
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the Adaptor", function() {
      var opts = { username: "", password: ""};
      expect(mod.adaptor(opts)).to.be.instanceOf(Adaptor);
    });
  });
});
