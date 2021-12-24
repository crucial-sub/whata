"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startGithubLogin = exports.see = exports.postLogin = exports.postJoin = exports.postEdit = exports.postChangePassword = exports.logout = exports.getLogin = exports.getJoin = exports.getEdit = exports.getChangePassword = exports.finishGithubLogin = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _Video = _interopRequireDefault(require("../models/Video"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getJoin = function getJoin(req, res) {
  res.render("users/join", {
    pageTitle: "Create Your WhatA Account"
  });
};

exports.getJoin = getJoin;

var postJoin = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, loginId, password, password2, name, email, pageTitle, exists;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, loginId = _req$body.loginId, password = _req$body.password, password2 = _req$body.password2, name = _req$body.name, email = _req$body.email;
            pageTitle = "Create Your WhatA Account";

            if (!(password !== password2)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", res.status(400).render("users/join", {
              pageTitle: pageTitle,
              errorMessage: "password confirmation doesn't match"
            }));

          case 4:
            _context.next = 6;
            return _User["default"].exists({
              $or: [{
                loginId: loginId
              }, {
                email: email
              }]
            });

          case 6:
            exists = _context.sent;

            if (!exists) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", res.status(400).render("users/join", {
              pageTitle: pageTitle,
              errorMessage: "The ID/Email already exists."
            }));

          case 9:
            _context.prev = 9;
            _context.next = 12;
            return _User["default"].create({
              loginId: loginId,
              password: password,
              name: name,
              email: email
            });

          case 12:
            return _context.abrupt("return", res.redirect("/login"));

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](9);
            return _context.abrupt("return", res.status(400).render("users/join", {
              pageTitle: pageTitle,
              errorMessage: _context.t0._message
            }));

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[9, 15]]);
  }));

  return function postJoin(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.postJoin = postJoin;

var getLogin = function getLogin(req, res) {
  res.render("users/login", {
    pageTitle: "Welcom to WhatA!"
  });
};

exports.getLogin = getLogin;

var postLogin = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var pageTitle, _req$body2, loginId, password, user, match;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            pageTitle = "Welcom to WhatA!";
            _req$body2 = req.body, loginId = _req$body2.loginId, password = _req$body2.password;
            _context2.next = 4;
            return _User["default"].findOne({
              loginId: loginId,
              socialOnly: false
            });

          case 4:
            user = _context2.sent;

            if (user) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", res.status(400).render("users/login", {
              pageTitle: pageTitle,
              errorMessage: "The user does not exist."
            }));

          case 7:
            _context2.next = 9;
            return _bcrypt["default"].compare(password, user.password);

          case 9:
            match = _context2.sent;

            if (match) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt("return", res.status(400).render("users/login", {
              pageTitle: pageTitle,
              errorMessage: "Password is wrong."
            }));

          case 12:
            req.session.loggedIn = true;
            req.session.user = user;
            return _context2.abrupt("return", res.redirect("/"));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function postLogin(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.postLogin = postLogin;

var startGithubLogin = function startGithubLogin(req, res) {
  var baseUrl = "https://github.com/login/oauth/authorize";
  var config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email"
  };
  var params = new URLSearchParams(config).toString();
  var finalUrl = "".concat(baseUrl, "?").concat(params);
  return res.redirect(finalUrl);
};

exports.startGithubLogin = startGithubLogin;

var finishGithubLogin = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var baseUrl, config, params, finalUrl, tokenRequest, access_token, apiUrl, userData, emailData, emailObj, user;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            baseUrl = "https://github.com/login/oauth/access_token";
            config = {
              client_id: process.env.GH_CLIENT,
              client_secret: process.env.GH_SECRET,
              code: req.query.code
            };
            params = new URLSearchParams(config).toString();
            finalUrl = "".concat(baseUrl, "?").concat(params);
            _context3.next = 6;
            return (0, _nodeFetch["default"])(finalUrl, {
              method: "POST",
              headers: {
                Accept: "application/json"
              }
            });

          case 6:
            _context3.next = 8;
            return _context3.sent.json();

          case 8:
            tokenRequest = _context3.sent;

            if (!("access_token" in tokenRequest)) {
              _context3.next = 37;
              break;
            }

            // access api
            access_token = tokenRequest.access_token;
            apiUrl = "https://api.github.com";
            _context3.next = 14;
            return (0, _nodeFetch["default"])("".concat(apiUrl, "/user"), {
              headers: {
                Authorization: "token ".concat(access_token)
              }
            });

          case 14:
            _context3.next = 16;
            return _context3.sent.json();

          case 16:
            userData = _context3.sent;
            _context3.next = 19;
            return (0, _nodeFetch["default"])("".concat(apiUrl, "/user/emails"), {
              headers: {
                Authorization: "token ".concat(access_token)
              }
            });

          case 19:
            _context3.next = 21;
            return _context3.sent.json();

          case 21:
            emailData = _context3.sent;
            emailObj = emailData.find(function (email) {
              return email.primary === true && email.verified === true;
            });

            if (emailObj) {
              _context3.next = 25;
              break;
            }

            return _context3.abrupt("return", res.redirect("/login"));

          case 25:
            _context3.next = 27;
            return _User["default"].findOne({
              email: emailObj.email
            });

          case 27:
            user = _context3.sent;

            if (user) {
              _context3.next = 32;
              break;
            }

            _context3.next = 31;
            return _User["default"].create({
              avatarUrl: userData.avatar_url,
              name: userData.name,
              loginId: userData.login,
              email: emailObj.email,
              password: "",
              socialOnly: true
            });

          case 31:
            user = _context3.sent;

          case 32:
            req.session.loggedIn = true;
            req.session.user = user;
            return _context3.abrupt("return", res.redirect("/"));

          case 37:
            return _context3.abrupt("return", res.redirect("/login"));

          case 38:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function finishGithubLogin(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.finishGithubLogin = finishGithubLogin;

var logout = function logout(req, res) {
  req.flash("info", "Bye Bye");
  req.session.destroy();
  return res.redirect("/");
};

exports.logout = logout;

var getEdit = function getEdit(req, res) {
  return res.render("users/edit-profile", {
    pageTitle: "Edit Profile"
  });
};

exports.getEdit = getEdit;

var postEdit = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$session$user, _id, sessionEmail, sessionLoginId, avatarUrl, _req$body3, loginId, name, email, file, searchParam, foundUser, updateUser;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$session$user = req.session.user, _id = _req$session$user._id, sessionEmail = _req$session$user.email, sessionLoginId = _req$session$user.loginId, avatarUrl = _req$session$user.avatarUrl, _req$body3 = req.body, loginId = _req$body3.loginId, name = _req$body3.name, email = _req$body3.email, file = req.file; // 이미 가입되어있는 이메일이나 ID로는 바꿀 수 없도록 만든다.

            searchParam = [];

            if (sessionEmail !== email) {
              searchParam.push({
                email: email
              });
            }

            if (sessionLoginId !== loginId) {
              searchParam.push({
                loginId: loginId
              });
            }

            if (!(searchParam.length > 0)) {
              _context4.next = 10;
              break;
            }

            _context4.next = 7;
            return _User["default"].findOne({
              $or: searchParam
            });

          case 7:
            foundUser = _context4.sent;

            if (!(foundUser && foundUser._id.toString() !== _id)) {
              _context4.next = 10;
              break;
            }

            return _context4.abrupt("return", res.status(400).render("edit-profile", {
              pageTitle: "Edit Profile",
              errorMessage: "This ID/email is already taken."
            }));

          case 10:
            _context4.next = 12;
            return _User["default"].findByIdAndUpdate(_id, {
              avatarUrl: file ? file.path : avatarUrl,
              loginId: loginId,
              name: name,
              email: email
            }, {
              "new": true
            });

          case 12:
            updateUser = _context4.sent;
            req.session.user = updateUser;
            return _context4.abrupt("return", res.redirect("/users/".concat(_id)));

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function postEdit(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.postEdit = postEdit;

var getChangePassword = function getChangePassword(req, res) {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "깃헙으로 로그인한 유저는 비밀번호를 변경할 수 없습니다.");
    return res.redirect("/");
  }

  return res.render("users/change-password", {
    pageTitle: "Change Password"
  });
};

exports.getChangePassword = getChangePassword;

var postChangePassword = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var _id, _req$body4, oldPassword, newPassword, newPassword2, user, match;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _id = req.session.user._id, _req$body4 = req.body, oldPassword = _req$body4.oldPassword, newPassword = _req$body4.newPassword, newPassword2 = _req$body4.newPassword2;
            _context5.next = 3;
            return _User["default"].findById(_id);

          case 3:
            user = _context5.sent;
            _context5.next = 6;
            return _bcrypt["default"].compare(oldPassword, user.password);

          case 6:
            match = _context5.sent;

            if (match) {
              _context5.next = 9;
              break;
            }

            return _context5.abrupt("return", res.status(400).render("users/change-password", {
              pageTitle: "Change Password",
              errorMessage: "The current password is wrong."
            }));

          case 9:
            if (!(oldPassword === newPassword)) {
              _context5.next = 11;
              break;
            }

            return _context5.abrupt("return", res.status(400).render("users/change-password", {
              pageTitle: "Change Password",
              errorMessage: "Please enter a different password from the previous one."
            }));

          case 11:
            if (!(newPassword !== newPassword2)) {
              _context5.next = 13;
              break;
            }

            return _context5.abrupt("return", res.status(400).render("users/change-password", {
              pageTitle: "Change Password",
              errorMessage: "password confirmation doesn't match."
            }));

          case 13:
            user.password = newPassword;
            _context5.next = 16;
            return user.save();

          case 16:
            req.flash("info", "Password updated");
            return _context5.abrupt("return", res.redirect("/users/logout"));

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function postChangePassword(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.postChangePassword = postChangePassword;

var see = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var id, user;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id = req.params.id;
            _context6.next = 3;
            return _User["default"].findById(id).populate("videos");

          case 3:
            user = _context6.sent;

            if (user) {
              _context6.next = 6;
              break;
            }

            return _context6.abrupt("return", res.status(404).render("404", {
              pageTitle: "User not found."
            }));

          case 6:
            return _context6.abrupt("return", res.render("users/profile", {
              pageTitle: "".concat(user.name, "'s profile"),
              user: user
            }));

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function see(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.see = see;