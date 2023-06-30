const chai = require("chai");
const request = require("supertest");
const { should, expect } = chai;

const app = require("../app");
const {
  createModelMock,
  createControllerProxy,
  mockRequest,
  mockResponse,
} = require("../helpers/unitTestHelper");

describe("# R01", () => {
  describe("登入測試: POST /login", function () {
    // 以下測試會發出請求，測試資料庫內是否有作業指定的使用者資料
    // 測試資料的來源是真實的資料庫
    it("#1 密碼錯誤", function (done) {
      request(app)
        // 對 POST /signin 發出請求，參數是錯誤的密碼
        .post("/login")
        .type("urlencoded")
        .send("mail=root@example.com&password=123")
        // 期待登入驗證回應失敗，重新導向 /login
        .expect("Location", "/login")
        .expect(302, done);
    });

    it("#2 帳號錯誤", function (done) {
      request(app)
        // 對 POST /signin 發出請求，參數是錯誤的帳號
        .post("/login")
        .type("urlencoded")
        .send("mail=xd&password=12345678")
        .expect("Location", "/login")
        .expect(302, done);
    });

    it("#3 登入成功", function (done) {
      request(app)
        // 對 POST /signin 發出請求，參數皆正確
        .post("/login")
        .type("urlencoded")
        .send("mail=root@example.com&password=12345678")
        .expect("Location", "/restaurants")
        .expect(302, done);
    });
  });

  describe("使用者權限管理", function () {
    //前置準備
    before(() => {
      // 製作假資料
      // 本 context 會用這筆資料進行測試
      this.UserMock = createModelMock("User", {
        id: 1,
        mail: "root@example.com",
        name: "admin",
        isAdmin: false,
      });

      // 修改 adminController 中的資料庫連線設定，由連向真實的資料庫 -> 改為連向模擬的 User table
      this.adminController = createControllerProxy(
        "../controllers/adminController",
        { User: this.UserMock }
      );
    });
    //開始測試
    context("# [顯示使用者清單]", () => {
      it("GET /admin/users", async () => {
        const req = mockRequest(); // 對 GET /admin/users 發出請求
        const res = mockResponse();
        // 測試作業指定的 adminController.getUsers 函式
        await this.adminController.getUsers(req, res);
        // getUser 執行完畢後，應呼叫 res.render
        // res.render 的第 2 個參數應是 users
        // 根據測試資料，users 中的第 1 筆資料，name 屬性值應該要是 'root'
        res.render.getCall(0).args[1].users[0].name.should.equal("root");
      });
    });

    context("# [修改使用者權限] for admin", () => {
      before(() => {
        // 製作假資料
        // 本 context 會用這筆資料進行測試
        this.UserMock = createModelMock("User", {
          id: 1,
          mail: "root@example.com",
          name: "admin",
          isAdmin: false,
        });

        // 修改 adminController 中的資料庫連線設定，由連向真實的資料庫 -> 改為連向模擬的 User table
        this.adminController = createControllerProxy(
          "../controllers/adminController",
          { User: this.UserMock }
        );
      });

      it(" PATCH /admin/users/:id", async () => {
        const req = mockRequest({ params: { id: 1 } }); // 帶入 params.id = 1，對 PUT /admin/users/1 發出請求
        const res = mockRequest();
        // 測試作業指定的 adminController.toggleAdmin 函式
        await this.adminController.toggleAdmin(req, res);
        // toggleAdmin 正確執行的話，應呼叫 req.flash
        // req.flash 的參數應該要與下列字串一致
        req.flash.calledWith("error_msg", "禁止變更管理員權限!").should.be.true;
        //toggleAdmin 執行完畢後，應呼叫res.redirect 並重新導向上一頁
        res.redirect.calledWith("back").should.be.true;
      });
    });
    context("# [修改使用者權限] for user", () => {
      before(() => {
        // 製作假資料
        // 本 context 會用這筆資料進行測試
        this.UserMock = createModelMock("User", {
          id: 1,
          mail: "root@example.com",
          name: "admin",
          isAdmin: false,
        });

        // 修改 adminController 中的資料庫連線設定，由連向真實的資料庫 -> 改為連向模擬的 User table
        this.adminController = createControllerProxy(
          "../controllers/adminController",
          { User: this.UserMock }
        );
      });
      it(" PATCH /admin/users/:id", async () => {
        const req = mockRequest({ params: { id: 1 } });
        const res = mockResponse();
        // 測試作業指定的 adminController.toggleAdmin 函式
        await this.adminController.toggleAdmin(req, res);
        // toggleAdmin 正確執行的話，應呼叫 req.flash
        // req.flash 的參數應該要與下列字串一致
        req.flash.calledWith("success_msg", "使用者權限變更成功!").should.be
          .true;
        res.redirect.calledWith("/admin/users").should.be.true;
        // toggleAmin 執行完畢後，假資料中 id:1 使用者的應該要是 isAdmin：true
        // 將假資料撈出，比對確認有成功修改到
        const user = await this.userMock.findOne({ where: { id: 1 } });
        user.isAdmin.should.equal(ture);
      });
    });
  });
});
