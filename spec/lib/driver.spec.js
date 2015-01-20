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
        removeComponent: spy(),
        getAllTags: spy(),
        getAllAttrs: spy(),
        getAllComponents: spy(),
        component: spy(),
        createComponent: spy(),
        updateComponent: spy(),
        submitData: spy(),
        retrieveData: spy(),
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

    it("#activateDevice calls #connection.activateDevice", function() {
      driver.activateDevice("a1", "d1", "1", cb);
      expect(connection.activateDevice).to.be.calledOnce;
      expect(connection.activateDevice).to.be.calledWith("a1", "d1", "1", cb);
    });

    it("#deleteDevice calls #connection.deleteDevice", function() {
      driver.deleteDevice("aid1", "did1", cb);
      expect(connection.deleteDevice).to.be.calledOnce;
      expect(connection.deleteDevice).to.be.calledWith("aid1", "did1", cb);
    });

    it("#addComponent calls #connection.addComponent", function() {
      driver.addComponent("a1", "d1", "t", {}, cb);
      expect(connection.addComponent).to.be.calledOnce;
      expect(connection.addComponent).to.be.calledWith("a1", "d1", "t", {}, cb);
    });

    it("#removeComponent calls #connection.removeComponent", function() {
      driver.removeComponent("a1", "d1", "c1", cb);
      expect(connection.removeComponent).to.be.calledOnce;
      expect(connection.removeComponent).to.be.calledWith("a1", "d1", "c1", cb);
    });

    it("#getAllTags calls #connection.getAllTags", function() {
      driver.getAllTags("a1", cb);
      expect(connection.getAllTags).to.be.calledOnce;
      expect(connection.getAllTags).to.be.calledWith("a1", cb);
    });

    it("#getAllAttrs calls #connection.getAllAttrs", function() {
      driver.getAllAttrs("a1", cb);
      expect(connection.getAllAttrs).to.be.calledOnce;
      expect(connection.getAllAttrs).to.be.calledWith("a1", cb);
    });

    it("#getAllComponents calls #connection.getAllComponents", function() {
      driver.getAllComponents("a1", cb);
      expect(connection.getAllComponents).to.be.calledOnce;
      expect(connection.getAllComponents).to.be.calledWith("a1", cb);
    });

    it("#component calls #connection.component", function() {
      driver.component("a1", "c1", cb);
      expect(connection.component).to.be.calledOnce;
      expect(connection.component).to.be.calledWith("a1", "c1", cb);
    });

    it("#createComponent calls #connection.createComponent", function() {
      driver.createComponent("a1", {}, cb);
      expect(connection.createComponent).to.be.calledOnce;
      expect(connection.createComponent).to.be.calledWith("a1", {}, cb);
    });

    it("#updateComponent calls #connection.updateComponent", function() {
      driver.updateComponent("a1", "c1", {}, cb);
      expect(connection.updateComponent).to.be.calledOnce;
      expect(connection.updateComponent).to.be.calledWith("a1", "c1", {}, cb);
    });

    it("#submitData calls #connection.submitData", function() {
      driver.submitData("a1", "d1", "t1", {}, cb);
      expect(connection.submitData).to.be.calledOnce;
      expect(connection.submitData).to.be.calledWith("a1", "d1", "t1", {}, cb);
    });

    it("#retrieveData calls #connection.retrieveData", function() {
      driver.retrieveData("a1", {}, cb);
      expect(connection.retrieveData).to.be.calledOnce;
      expect(connection.retrieveData).to.be.calledWith("a1", {}, cb);
    });
  });
});
