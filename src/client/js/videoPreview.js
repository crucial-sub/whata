const videoBox = document.querySelectorAll(".video_box");

const handleVideoBox = (e) => {
    const preview = e.target.querySelector("video");
    const thumb = e.target.querySelector(".video-mixin__thumb");

    if(preview.paused) {
        thumb.classList.add("hide");
        preview.play();
    } else {
        thumb.classList.remove("hide");
        preview.currentTime = 0;
        preview.pause();
    }
}

videoBox.forEach(videoBox => videoBox.addEventListener("mouseenter", handleVideoBox));
videoBox.forEach(videoBox => videoBox.addEventListener("mouseleave", handleVideoBox));