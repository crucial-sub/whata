"use strict";

var _ffmpeg = require("@ffmpeg/ffmpeg");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var actionBtn = document.getElementById("actionBtn");
var video = document.getElementById("recording"); // const ffmpeg = createFFmpeg({
//     log: true,
//     corePath: "/static/ffmpeg-core.js",
// });

var stream;
var recorder;
var videoFile;
var files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg"
};

var downloadFile = function downloadFile(fileUrl, fileName) {
  var a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

var handleDownload = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var ffmpeg, mp4File, thumbFile, mp4Blob, thumbBlob, mp4Url, thumbUrl;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            actionBtn.removeEventListener("click", handleDownload);
            actionBtn.innerText = "트랜스코딩 중...";
            actionBtn.disabled = true;
            ffmpeg = (0, _ffmpeg.createFFmpeg)({
              log: true,
              corePath: "/static/ffmpeg-core.js"
            });
            _context.next = 6;
            return ffmpeg.load();

          case 6:
            _context.t0 = ffmpeg;
            _context.t1 = files.input;
            _context.next = 10;
            return (0, _ffmpeg.fetchFile)(videoFile);

          case 10:
            _context.t2 = _context.sent;

            _context.t0.FS.call(_context.t0, "writeFile", _context.t1, _context.t2);

            _context.next = 14;
            return ffmpeg.run("-i", files.input, "-r", "60", files.output);

          case 14:
            _context.next = 16;
            return ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);

          case 16:
            mp4File = ffmpeg.FS("readFile", files.output);
            thumbFile = ffmpeg.FS("readFile", files.thumb);
            mp4Blob = new Blob([mp4File.buffer], {
              type: "video/mp4"
            });
            thumbBlob = new Blob([thumbFile.buffer], {
              type: "image/jpg"
            });
            mp4Url = URL.createObjectURL(mp4Blob);
            thumbUrl = URL.createObjectURL(thumbBlob);
            downloadFile(mp4Url, "MyRecording.mp4");
            downloadFile(thumbUrl, "MyThumbnail.jpg");
            ffmpeg.FS("unlink", files.input);
            ffmpeg.FS("unlink", files.output);
            ffmpeg.FS("unlink", files.thumb);
            URL.revokeObjectURL(mp4Url);
            URL.revokeObjectURL(thumbUrl);
            URL.revokeObjectURL(videoFile);
            actionBtn.disabled = false;
            actionBtn.innerText = "다시 녹화하기";
            actionBtn.addEventListener("click", handleStart);

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handleDownload() {
    return _ref.apply(this, arguments);
  };
}(); // const handleStop = () => {
//     actionBtn.innerText = "Download Recording";
//     actionBtn.removeEventListener("click", handleStop);
//     actionBtn.addEventListener("click", handleDownload);
//     recorder.stop();
// };


var handleStart = function handleStart() {
  actionBtn.innerText = "녹화 중...";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);
  recorder = new MediaRecorder(stream, {
    mimeType: "video/webm"
  });

  recorder.ondataavailable = function (event) {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    actionBtn.innerText = "다운로드";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };

  recorder.start();
  setTimeout(function () {
    recorder.stop();
  }, 5000);
};

var actionCheck = false;

var init = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(actionCheck === true)) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return");

          case 2:
            _context2.next = 4;
            return navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                width: 1024,
                height: 576
              }
            });

          case 4:
            stream = _context2.sent;
            video.srcObject = stream;
            video.play();
            actionCheck = true;

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function init() {
    return _ref2.apply(this, arguments);
  };
}();

actionBtn.addEventListener("click", handleStart); // record ask 버튼

var recordAskBtn = document.querySelector(".ask-record__btn");
var uploadVideo = document.querySelector(".upload__video");
var info = document.querySelector(".btn-info");

var handleRecordAsk = function handleRecordAsk() {
  if (uploadVideo.classList.contains("show-recorder")) {
    info.innerText = "What A Nice! \uD55C \uC601\uC0C1\uC744 \n        \uC9C1\uC811 \uB179\uD654\uD558\uACE0 \uC2F6\uC744 \uACBD\uC6B0 \uBC84\uD2BC\uC744 \uB20C\uB7EC\uC8FC\uC138\uC694!";
    recordAskBtn.innerText = "Recorder 켜기";
    uploadVideo.classList.remove("show-recorder");
  } else {
    init();
    info.innerText = "\uB179\uD654 \uC2DC\uC791 \uBC84\uD2BC\uC744 \uB204\uB974\uBA74 5\uCD08\uAC04 \uB179\uD654\uAC00 \uC9C4\uD589\uB418\uBA70 \n        \uB179\uD654 \uC601\uC0C1\uACFC \uC378\uB124\uC77C \uC774\uBBF8\uC9C0\uB97C \uB2E4\uC6B4\uBC1B\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.";
    recordAskBtn.innerText = "Recorder 끄기";
    uploadVideo.classList.add("show-recorder");
  }
};

recordAskBtn.addEventListener("click", handleRecordAsk); // 썸네일 업로드 안했을 때 알림창
// "If you don't upload the thumbnail, the first moment of the video will be displayed as a thumbnail."

var thumb = document.getElementById("thumb");
var uploadBtn = document.querySelector(".upload__submit");

var handleThumbConfirm = function handleThumbConfirm(e) {
  if (!thumb.value) {
    if (confirm("썸네일을 업로드하지 않으면, 영상의 첫 부분이 썸네일로써 보여집니다.")) {
      document.form.submit();
    } else {
      e.preventDefault();
    }
  }
};

uploadBtn.addEventListener("click", handleThumbConfirm);