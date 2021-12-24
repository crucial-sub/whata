"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// schema 설정
var videoSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  thumbUrl: {
    type: String
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 2
  },
  createdAt: {
    type: Date,
    required: true,
    "default": Date.now
  },
  hashtags: [{
    type: String,
    trim: true
  }],
  meta: {
    views: {
      type: Number,
      "default": 0,
      required: true
    }
  },
  category: {
    type: String,
    required: true
  },
  owner: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  comments: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    required: true,
    ref: "Comment"
  }],
  commentsCount: {
    type: Number,
    "default": 0,
    required: true
  }
});
videoSchema["static"]("hashtagForm", function (hashtags) {
  return hashtags.split(",").map(function (hashtag) {
    return hashtag.startsWith("#") ? hashtag : "#".concat(hashtag);
  });
});

var Video = _mongoose["default"].model("Video", videoSchema);

var _default = Video;
exports["default"] = _default;