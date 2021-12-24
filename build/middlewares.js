"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoUpload = exports.publicOnlyMiddleware = exports.protectorMiddleware = exports.localsMiddleware = exports.avatarUpload = void 0;

var _multer = _interopRequireDefault(require("multer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var localsMiddleware = function localsMiddleware(req, res, next) {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "WhatA";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

exports.localsMiddleware = localsMiddleware;

var protectorMiddleware = function protectorMiddleware(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

exports.protectorMiddleware = protectorMiddleware;

var publicOnlyMiddleware = function publicOnlyMiddleware(req, res, next) {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

exports.publicOnlyMiddleware = publicOnlyMiddleware;
var avatarUpload = (0, _multer["default"])({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000
  }
});
exports.avatarUpload = avatarUpload;
var videoUpload = (0, _multer["default"])({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000
  }
});
exports.videoUpload = videoUpload;