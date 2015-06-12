"use strict";

var IntelIotAnalytics = lib("adaptor");
var rest = require("restler");

describe("Cylon.Adaptors.IntelIotAnalytics", function() {
  var adaptor;

  beforeEach(function() {
    adaptor = new IntelIotAnalytics({ username: "user1", password: "passwd" });
  });

  describe("#constructor", function() {
    it("sets the username", function() {
      expect(adaptor.username).to.be.eql("user1");
    });
    it("sets the password", function() {
      expect(adaptor.password).to.be.eql("passwd");
    });
    it("sets the baseUrl", function() {
      var baseUrl = "https://dashboard.us.enableiot.com/v1/api";
      expect(adaptor.baseUrl).to.be.eql(baseUrl);
    });
  });

  describe("#connect", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      stub(adaptor, "_getToken");
      stub(adaptor, "emit");
    });

    afterEach(function() {
      adaptor._getToken.restore();
      adaptor.emit.restore();
    });

    describe("when API login successfull", function() {
      beforeEach(function() {
        adaptor._getToken.yields(null, { token: "123456" });
        adaptor.connect(callback);
      });

      it("gets a new token for the API", function() {
        expect(callback).to.be.calledOnce;
      });

      it("sets the API @token", function() {
        expect(adaptor.token).to.be.eql("123456");
      });
    });

    describe("when API login NOT successfull", function() {
      beforeEach(function() {
        adaptor._getToken.yields("LOGIN INCORRECT!", null);
        adaptor.connect(callback);
      });

      it("gets a new token for the API", function() {
        expect(callback).to.be.calledOnce;
      });

      it("@token should not be set", function() {
        expect(adaptor.token).to.be.eql(undefined);
      });
      it("should #emit error event", function() {
        var errMsg = "Access token could not be retrieved!";
        expect(adaptor.emit).to.be.calledWith("error", errMsg);
      });
    });
  });

  describe("#disconnect", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      adaptor.disconnect(callback);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.calledOnce;
    });
  });

  describe("#_defCb", function() {
    var callback, defCb;

    describe("callback is a function", function() {
      beforeEach(function() {
        callback = spy();
        defCb = adaptor._defCb(callback);
      });

      afterEach(function() {
      });

      it("returns a default function for REST calls", function() {
        expect(typeof defCb).to.be.eql("function");
      });

      describe("result is instance of Error", function() {
        var err;

        beforeEach(function() {
          err = new Error("Can't reach API");
          defCb(err);
        });

        it("triggers the callback with params", function() {
          expect(callback).to.be.calledWith(err, null);
        });
      });

      describe("result is NOT and instance of Error", function() {
        beforeEach(function() {
          defCb({ data: "success" });
        });

        it("triggers the callback with params", function() {
          expect(callback).to.be.calledWith(null, { data: "success" });
        });
      });
    });

    describe("callback is not a function", function() {
      beforeEach(function() {
        stub(adaptor, "emit");
        defCb = adaptor._defCb();
      });

      afterEach(function() {
        adaptor.emit.restore();
      });

      describe("result is instance of Error", function() {
        var err;

        beforeEach(function() {
          err = new Error("Can't reach API");
          defCb(err);
        });

        it("emits an error event", function() {
          expect(adaptor.emit).to.be.calledWith("error", err);
        });
      });

      describe("result is NOT and instance of Error", function() {
        beforeEach(function() {
          defCb({ data: "success" });
        });

        it("emits a success event", function() {
          expect(adaptor.emit).to.be.calledWith("success", { data: "success" });
        });
      });
    });
  });

  describe("#_restOptions", function() {
    var params;

    beforeEach(function() {
      params = adaptor._restOptions(
        "/account",
        { value: 10 },
        { value: 20 },
        "123456"
      );
    });

    it("appends path to @baseUrl", function() {
      expect(params.url).to.be.eql(adaptor.baseUrl + "/account");
    });

    it("sets query inside options", function() {
      expect(params.options.query).to.be.eql({ value: 20 });
    });

    it("sets data inside options", function() {
      expect(params.options.data).to.be.eql({ value: 10 });
    });

    it("uses token in params when one provided", function() {
      expect(params.options.accessToken).to.be.eql("123456");
    });

    describe("when no token is provided as param", function() {
      beforeEach(function() {
        adaptor.token = "789abc";
        params = adaptor._restOptions(
          "/account",
          { value: 10 },
          { value: 20 }
        );
      });

      it("uses @token as default", function() {
        expect(params.options.accessToken).to.be.eql("789abc");
      });
    });
  });

  describe("#_rest", function() {
    var callback, restObj, options, path;

    beforeEach(function() {
      path = adaptor.baseUrl + "/accounts";
      options = {
        headers: {
          "content-type": "application/json"
        },
        accessToken: adaptor.token,
        query: {},
        data: {}
      };

      restObj = { on: stub() };
      restObj.on.yields();

      callback = spy;

      stub(adaptor, "_defCb").returns(callback);

      spy(adaptor, "_restOptions");

      stub(rest, "post").returns(restObj);
      stub(rest, "get").returns(restObj);
      stub(rest, "del").returns(restObj);
      stub(rest, "put").returns(restObj);
      stub(rest, "postJson").returns(restObj);
      stub(rest, "putJson").returns(restObj);
    });

    afterEach(function() {
      adaptor._restOptions.reset();
      adaptor._defCb.reset();
      rest.post.restore();
      rest.get.restore();
      rest.put.restore();
      rest.del.restore();
      rest.postJson.restore();
      rest.putJson.restore();
    });

    it("calls rest#get", function() {
      adaptor._rest("get", "/accounts", {}, {}, callback);
      expect(rest.get).to.be.calledWith(path, options);
      expect(restObj.on).to.be.calledWith("complete", callback);
    });

    it("calls rest#post", function() {
      adaptor._rest("post", "/accounts", {}, {}, callback);
      expect(rest.post).to.be.calledWith(path, options);
    });

    it("calls rest#postJson", function() {
      adaptor._rest("postJson", "/accounts", {}, {}, callback);
      expect(rest.postJson).to.be.calledWith(path, {}, options);
    });

    it("calls rest#put", function() {
      adaptor._rest("put", "/accounts", {}, {}, callback);
      expect(rest.put).to.be.calledWith(path, options);
    });

    it("calls rest#putJson", function() {
      adaptor._rest("putJson", "/accounts", {}, {}, callback);
      expect(rest.putJson).to.be.calledWith(path, {}, options);
    });

    it("calls rest#del", function() {
      adaptor._rest("del", "/accounts", {}, {}, callback);
      expect(rest.del).to.be.calledWith(path, options);
    });
  });

  describe("#_get", function() {
    beforeEach(function() {
      stub(adaptor, "_rest");
      adaptor._get("/accounts", { value: 123 });
    });

    afterEach(function() {
      adaptor._rest.restore();
    });

    it("calls #_rest with 'get'", function() {
      expect(adaptor._rest).to.be.calledWith(
        "get",
        "/accounts",
        null,
        { value: 123 }
      );
    });
  });


  describe("#_post", function() {
    beforeEach(function() {
      stub(adaptor, "_rest");
      adaptor._post("/accounts", { value: 123 });
    });

    afterEach(function() {
      adaptor._rest.restore();
    });

    it("calls #_rest with post", function() {
      expect(adaptor._rest).to.be.calledWith(
        "post",
        "/accounts",
        { value: 123 }
      );
    });
  });

  describe("#_postJson", function() {
    beforeEach(function() {
      stub(adaptor, "_rest");
      adaptor._postJson("/accounts", { value: 123 });
    });

    afterEach(function() {
      adaptor._rest.restore();
    });

    it("calls #_rest with postJson", function() {
      expect(adaptor._rest).to.be.calledWith(
        "postJson",
        "/accounts",
        { value: 123 }
      );
    });
  });

  describe("#_put", function() {
    beforeEach(function() {
      stub(adaptor, "_rest");
      adaptor._put("/accounts", { value: 123 });
    });

    afterEach(function() {
      adaptor._rest.restore();
    });

    it("calls #_rest with put", function() {
      expect(adaptor._rest).to.be.calledWith(
        "put",
        "/accounts",
        { value: 123 }
      );
    });
  });

  describe("#_putJson", function() {
    beforeEach(function() {
      stub(adaptor, "_rest");
      adaptor._putJson("/accounts", { value: 123 });
    });

    afterEach(function() {
      adaptor._rest.restore();
    });

    it("calls #_rest with putJson", function() {
      expect(adaptor._rest).to.be.calledWith(
        "putJson",
        "/accounts",
        { value: 123 }
      );
    });
  });

  describe("#_del", function() {
    beforeEach(function() {
      stub(adaptor, "_rest");
      adaptor._del("/accounts", { value: 123 });
    });

    afterEach(function() {
      adaptor._rest.restore();
    });

    it("calls #_rest with putJson", function() {
      expect(adaptor._rest).to.be.calledWith(
        "del",
        "/accounts",
        { value: 123 }
      );
    });
  });

  describe("#_getToken", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_post");
      adaptor._getToken(callback);
    });

    afterEach(function() {
      adaptor._post.restore();
    });

    it("calls #_post with params", function() {
      expect(adaptor._post).to.be.calledWith(
        "/auth/token",
        {
          username: "user1",
          password: "passwd"
        }
      );
    });
  });

  describe("#accountInfo", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_get");
      adaptor.accountInfo("123456", callback);
    });

    afterEach(function() {
      adaptor._get.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._get).to.be.calledWith(
        "/accounts/123456",
        null,
        callback
      );
    });
  });

  describe("#activationCode", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_get");
      adaptor.activationCode("123456", callback);
    });

    afterEach(function() {
      adaptor._get.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._get).to.be.calledWith(
        "/accounts/123456/activationcode",
        null,
        callback
      );
    });
  });

  describe("#refreshActivationCode", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_put");
      adaptor.refreshActivationCode("123456", callback);
    });

    afterEach(function() {
      adaptor._put.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._put).to.be.calledWith(
        "/accounts/123456/activationcode/refresh",
        null,
        null,
        callback
      );
    });
  });

  describe("#devices", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_get");
      adaptor.devices("123456", callback);
    });

    afterEach(function() {
      adaptor._get.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._get).to.be.calledWith(
        "/accounts/123456/devices",
        {},
        callback
      );
    });
  });

  describe("#device", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_get");
      adaptor.device("123456", "abc123", callback);
    });

    afterEach(function() {
      adaptor._get.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._get).to.be.calledWith(
        "/accounts/123456/devices/abc123",
        null,
        callback
      );
    });
  });

  describe("#createDevice", function() {
    var callback, device;

    beforeEach(function() {
      device = {
        id: "abc123",
        desc: "MyDevice"
      };

      callback = spy();
      stub(adaptor, "_postJson");
      adaptor.createDevice("123456", device, callback);
    });

    afterEach(function() {
      adaptor._postJson.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._postJson).to.be.calledWith(
        "/accounts/123456/devices",
        device,
        callback
      );
    });
  });

  describe("#updateDevice", function() {
    var callback, device;

    beforeEach(function() {
      device = {
        id: "abc123",
        desc: "MyDevice"
      };

      callback = spy();
      stub(adaptor, "_putJson");
      adaptor.updateDevice("123456", "abc123", device, callback);
    });

    afterEach(function() {
      adaptor._putJson.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._putJson).to.be.calledWith(
        "/accounts/123456/devices/abc123",
        device,
        callback
      );
    });
  });

  describe("#activateDevice", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_putJson");
      adaptor.activateDevice("123456", "abc123", "activationcode", callback);
    });

    afterEach(function() {
      adaptor._putJson.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._putJson).to.be.calledWith(
        "/accounts/123456/devices/abc123/activation",
        { activationCode: "activationcode"},
        callback
      );
    });
  });

  describe("#deleteDevice", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_del");
      adaptor.deleteDevice("123456", "abc123", callback);
    });

    afterEach(function() {
      adaptor._del.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._del).to.be.calledWith(
        "/accounts/123456/devices/abc123",
        null,
        null,
        callback
      );
    });
  });

  describe("#addComponent", function() {
    var callback, component;

    beforeEach(function() {
      component = {
        id: "abc123",
        desc: "MyDevice"
      };

      callback = spy();
      stub(adaptor, "_postJson");
      adaptor.addComponent("123456", "abc123", "qwerty", component, callback);
    });

    afterEach(function() {
      adaptor._postJson.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._postJson).to.be.calledWith(
        "/accounts/123456/devices/abc123/components",
        component,
        callback
      );
    });
  });

  describe("#removeComponent", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_del");
      adaptor.removeComponent("123456", "abc123", "qwerty", callback);
    });

    afterEach(function() {
      adaptor._del.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._del).to.be.calledWith(
        "/accounts/123456/devices/abc123/components/qwerty",
        null,
        null,
        callback
      );
    });
  });

  describe("#getAllTags", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_get");
      adaptor.getAllTags("123456", callback);
    });

    afterEach(function() {
      adaptor._get.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._get).to.be.calledWith(
        "/accounts/123456/devices/tags",
        null,
        callback
      );
    });
  });

  describe("#getAllAttrs", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_get");
      adaptor.getAllAttrs("123456", callback);
    });

    afterEach(function() {
      adaptor._get.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._get).to.be.calledWith(
        "/accounts/123456/devices/attributes",
        null,
        callback
      );
    });
  });

  describe("#getAllComponents", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_get");
      adaptor.getAllComponents("123456", callback);
    });

    afterEach(function() {
      adaptor._get.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._get).to.be.calledWith(
        "/accounts/123456/cmpcatalog",
        { full: true },
        callback
      );
    });
  });

  describe("#component", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_get");
      adaptor.component("123456", "abcdef", callback);
    });

    afterEach(function() {
      adaptor._get.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._get).to.be.calledWith(
        "/accounts/123456/cmpcatalog/abcdef",
        { full: true },
        callback
      );
    });
  });

  describe("#createComponent", function() {
    var callback, component;

    beforeEach(function() {
      component = {
        id: "comid123",
        unit: "celsius"
      };
      callback = spy();
      stub(adaptor, "_postJson");
      adaptor.createComponent("123456", component, callback);
    });

    afterEach(function() {
      adaptor._postJson.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._postJson).to.be.calledWith(
        "/accounts/123456/cmpcatalog",
        component,
        callback
      );
    });
  });

  describe("#updateComponent", function() {
    var callback, component;

    beforeEach(function() {
      component = {
        id: "comid123",
        unit: "celsius"
      };
      callback = spy();
      stub(adaptor, "_putJson");
      adaptor.updateComponent("123456", "comid123", component, callback);
    });

    afterEach(function() {
      adaptor._putJson.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._putJson).to.be.calledWith(
        "/accounts/123456/cmpcatalog/comid123",
        component,
        callback
      );
    });
  });

  describe("#submitData", function() {
    var callback, data;

    beforeEach(function() {
      data = [{
        cid: "cid123",
        value: "10"
      }];

      callback = spy();
      stub(Date, "now").returns(123456789);
      stub(adaptor, "_postJson");

      adaptor.submitData("aid123", "did123", "dtoken", data, callback);
    });

    afterEach(function() {
      adaptor._postJson.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._postJson).to.be.calledWith(
        "/data/did123",
        {
          on: 123456789,
          accountId: "aid123",
          data: data
        },
        callback
      );
    });
  });

  describe("#retrieveData", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(adaptor, "_postJson");
      adaptor.retrieveData("aid123", {}, callback);
    });

    afterEach(function() {
      adaptor._postJson.restore();
    });

    it("calls #_get with params", function() {
      expect(adaptor._postJson).to.be.calledWith(
        "/accounts/aid123/data/search",
        {},
        callback
      );
    });
  });
});

