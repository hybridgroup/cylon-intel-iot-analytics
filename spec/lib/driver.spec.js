// jshint expr:true
"use strict";

var IntelIotAnalytics = source("driver");

describe("Cylon.Drivers.IntelIotAnalytics", function() {
  var driver;

  beforeEach(function() {
    driver = new IntelIotAnalytics({
      connection: {}
    });
  });

  describe("#constructor", function() {
    it("sets commands object with the following", function() {
      var commands = [
        "accountInfo",
        "activationCode",
        "refreshActivationCode",
        "devices",
        "device",
        "createDevice",
        "activateDevice",
        "deleteDevice",
        "addComponent",
        "removeComponent",
        "getAllAttrs",
        "getAllTags",
        "getAllComponents",
        "createComponent",
        "updateComponent",
        "submitData",
        "retrieveData",
      ];

      for (var c in commands) {
        expect(driver.commands[commands[c]]).to.be.a("function");
      }
    });
  });


  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.start(callback);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.calledOnce;
    });
  });

  describe("#halt", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.halt(callback);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.calledOnce;
    });
  });

  describe("command", function() {
    var cb, connection;

    beforeEach(function() {
      cb = spy();

      connection = {
        accountInfo: spy(),
        activationCode: spy(),
        refreshActivationCode: spy(),
        devices: spy(),
        device: spy(),
        createDevice: spy(),
        updateDevice: spy(),
        activateDevice: spy(),
        deleteDevice: spy(),
        addComponent: spy(),
        removeComponent: spy()
      };

      driver.connection = connection;
    });

    afterEach(function() {
      driver.connection.restore;
    });

    it("#accountInfo calls #connection.accountInfo", function() {
      driver.accountInfo("123", cb);
      expect(driver.connection.accountInfo).to.be.calledOnce;
      expect(driver.connection.accountInfo).to.be.calledWith("123", cb);
    });

    it("#activationCode calls #connection.activationCode", function() {
      driver.activationCode("123", cb);
      expect(connection.activationCode).to.be.calledOnce;
      expect(connection.activationCode).to.be.calledWith("123", cb);
    });

    it("#refreshActivationCode calls #connection", function() {
      driver.refreshActivationCode("123", cb);
      expect(connection.refreshActivationCode).to.be.calledOnce;
      expect(connection.refreshActivationCode).to.be.calledWith("123", cb);
    });

    it("#devices calls #connection.devices", function() {
      driver.devices("123", {}, cb);
      expect(connection.devices).to.be.calledOnce;
      expect(connection.devices).to.be.calledWith("123", {}, cb);
    });

    it("#device calls #connection.device", function() {
      driver.device("aid123", "did123", cb);
      expect(connection.device).to.be.calledOnce;
      expect(connection.device).to.be.calledWith("aid123", "did123", cb);
    });

    it("#createDevice calls #connection.createDevice", function() {
      driver.createDevice("aid123", {}, cb);
      expect(connection.createDevice).to.be.calledOnce;
      expect(connection.createDevice).to.be.calledWith("aid123", {}, cb);
    });

    it("#updateDevice calls #connection.updateDevice", function() {
      driver.updateDevice("aid1", "did1", {}, cb);
      expect(connection.updateDevice).to.be.calledOnce;
      expect(connection.updateDevice).to.be.calledWith("aid1", "did1", {}, cb);
    });
  });
});
