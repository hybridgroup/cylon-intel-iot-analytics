// jshint expr:true
"use strict";

var IntelIotAnalytics = source("adaptor");
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

    describe("when API login successfull",function() {
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

    describe("when API login NOT successfull",function() {
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
        expect(typeof(defCb)).to.be.eql("function");
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
      options= {
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
});
