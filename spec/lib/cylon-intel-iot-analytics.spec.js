"use strict";

var module = source("cylon-intel-iot-analytics");

var Adaptor = source('adaptor'),
    Driver = source('driver');

describe("Cylon.IntelIotAnalytics", function() {
  describe("#adaptors", function() {
    it('is an array of supplied adaptors', function() {
      expect(module.adaptors).to.be.eql(["intel-iot-analytics"]);
    });
  });

  describe("#drivers", function() {
    it('is an array of supplied drivers', function() {
      expect(module.drivers).to.be.eql(["iot"]);
    });
  });

  describe("#dependencies", function() {
    it('is an array of supplied dependencies', function() {
      expect(module.dependencies).to.be.eql([]);
    });
  });

  describe("#driver", function() {
    it("returns an instance of the Driver", function() {
      expect(module.driver({ driver: 'iot' })).to.be.instanceOf(Driver);
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the Adaptor", function() {
      expect(module.adaptor({ username: '', password: ''})).to.be.instanceOf(Adaptor);
    });
  });
});
