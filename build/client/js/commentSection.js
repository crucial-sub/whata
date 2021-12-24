"use strict";

var _regeneratorRuntime = require("regenerator-runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var videoContainer = document.getElementById("videoContainer");
var form = document.getElementById("commentForm");

var addComment = function addComment(text, comment) {
  var time = comment.createdAt;
  var videoComments = document.querySelector(".video__comments ul");
  var newComment = document.createElement("li"); // const commentOwner = document.querySelector(".comment-owner");

  newComment.dataset.id = comment._id;
  newComment.className = "video__comment";
  var avatarBox = document.createElement("div");
  avatarBox.className = "comment-avatar__box comment-item";
  var avatarLink = document.createElement("a");
  avatarLink.setAttribute("href", "/users/".concat(comment.owner._id));
  var avatar = document.createElement("img");

  if (!comment.owner.avatarUrl) {
    avatar.setAttribute("src", "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
  } else {
    avatar.setAttribute("src", "/".concat(comment.owner.avatarUrl));
  }

  avatar.className = "comment-avatar";
  var contentBox = document.createElement("div");
  contentBox.className = "comment-content__box comment-item";
  var info = document.createElement("div");
  info.className = "comment-info";
  var commentOwnerLink = document.createElement("a");
  commentOwnerLink.setAttribute("href", "/users/".concat(comment.owner._id));
  var commentOwner = document.createElement("span");
  commentOwner.innerText = comment.owner.name;
  commentOwner.id = "comment-owner";
  var createdAt = document.createElement("span");
  createdAt.className = "comment-createdAt";
  createdAt.innerText = new Date(comment.createdAt).toLocaleDateString("ko-kr", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  var textBox = document.createElement("div");
  textBox.className = "comment-text__box";
  var textSpan = document.createElement("span");
  textSpan.className = ".comment-text";
  textSpan.innerText = text;
  var btn = document.createElement("span");
  btn.innerText = "❌";
  btn.setAttribute("style", "cursor:pointer");
  btn.dataset.id = comment._id;
  btn.className = "delete__btn comment-item";
  newComment.appendChild(avatarBox);
  avatarBox.appendChild(avatarLink);
  avatarLink.appendChild(avatar);
  newComment.appendChild(contentBox);
  contentBox.appendChild(info);
  info.appendChild(commentOwnerLink);
  commentOwnerLink.appendChild(commentOwner);
  info.appendChild(createdAt);
  contentBox.appendChild(textBox);
  textBox.appendChild(textSpan);
  newComment.appendChild(btn);
  videoComments.prepend(newComment); // 댓글 삭제

  var deleteBtn = document.querySelectorAll(".delete__btn");
  deleteBtn.forEach(function (btn) {
    return btn.addEventListener("click", handleDelete);
  }); // 댓글 수 세기

  counting();
};

var handleSubmit = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
    var textarea, text, videoId, response, _yield$response$json, newComment;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            event.preventDefault();
            textarea = form.querySelector("textarea"); // const commentOwner = document.getElementById("comment-owner");

            text = textarea.value;
            videoId = videoContainer.dataset.id; // const ownerId = commentOwner.dataset.id;
            // const comment = document.querySelector(".video__comment")
            // const commentId = comment.dataset.id;

            if (!(text === "")) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return");

          case 6:
            _context.next = 8;
            return fetch("/api/videos/".concat(videoId, "/comment"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                text: text // commentId

              })
            });

          case 8:
            response = _context.sent;

            if (!(response.status === 201)) {
              _context.next = 16;
              break;
            }

            textarea.value = "";
            _context.next = 13;
            return response.json();

          case 13:
            _yield$response$json = _context.sent;
            newComment = _yield$response$json.newComment;
            addComment(text, newComment);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handleSubmit(_x) {
    return _ref.apply(this, arguments);
  };
}();

if (form) {
  form.addEventListener("submit", handleSubmit);
} // 댓글 삭제


var handleDelete = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
    var id, comment;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = e.target.dataset.id;
            comment = document.querySelector(".video__comment[data-id=\"".concat(id, "\"]"));
            comment.remove();
            counting();
            _context2.next = 6;
            return fetch("/api/comments/".concat(id), {
              method: "DELETE"
            });

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function handleDelete(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var deleteBtn = document.querySelectorAll(".delete__btn");
deleteBtn.forEach(function (btn) {
  return btn.addEventListener("click", handleDelete);
}); // 댓글 개수 세는 함수

var counting = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var videoComments, countBox, videoId, count;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            videoComments = document.querySelector(".video__comments ul");
            countBox = document.querySelector(".comments-count");
            videoId = videoContainer.dataset.id;
            count = videoComments.childElementCount;
            countBox.innerText = "\uB313\uAE00 ".concat(videoComments.childElementCount, "\uAC1C");
            _context3.next = 7;
            return fetch("/api/comments/".concat(videoId, "/count"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                count: count
              })
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function counting() {
    return _ref3.apply(this, arguments);
  };
}();

counting(); // 댓글 오너 구하기