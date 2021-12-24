"use strict";

var videoBox = document.querySelectorAll(".video_box");

var handleVideoBox = function handleVideoBox(e) {
  var preview = e.target.querySelector("video");
  var thumb = e.target.querySelector(".video-mixin__thumb");

  if (preview.paused) {
    thumb.classList.add("hide");
    preview.play();
  } else {
    thumb.classList.remove("hide");
    preview.currentTime = 0;
    preview.pause();
  }
};

videoBox.forEach(function (videoBox) {
  return videoBox.addEventListener("mouseenter", handleVideoBox);
});
videoBox.forEach(function (videoBox) {
  return videoBox.addEventListener("mouseleave", handleVideoBox);
});