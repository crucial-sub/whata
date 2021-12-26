import {
    createFFmpeg,
    fetchFile
} from "@ffmpeg/ffmpeg";
const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("recording");

// const ffmpeg = createFFmpeg({
//     log: true,
//     corePath: "/static/ffmpeg-core.js",
// });

let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
};


const handleDownload = async () => {
    actionBtn.removeEventListener("click", handleDownload);

    actionBtn.innerText = "트랜스코딩 중...";

    actionBtn.disabled = true;

    const ffmpeg = createFFmpeg({
        log: true,
        corePath: "/static/ffmpeg-core.js",
    });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

    await ffmpeg.run("-i", files.input, "-r", "60", files.output);

    await ffmpeg.run(
        "-i",
        files.input,
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        files.thumb
    );


    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumb);

    const mp4Blob = new Blob([mp4File.buffer], {
        type: "video/mp4"
    });
    const thumbBlob = new Blob([thumbFile.buffer], {
        type: "image/jpg"
    });

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

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
};

// const handleStop = () => {
//     actionBtn.innerText = "Download Recording";
//     actionBtn.removeEventListener("click", handleStop);
//     actionBtn.addEventListener("click", handleDownload);
//     recorder.stop();
// };

const handleStart = () => {
    actionBtn.innerText = "녹화 중...";
    actionBtn.disabled = true;
    actionBtn.removeEventListener("click", handleStart);
    recorder = new MediaRecorder(stream, {
        mimeType: "video/webm"
    });
    recorder.ondataavailable = (event) => {
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
    setTimeout(() => {
        recorder.stop();
    }, 5000);

};

let actionCheck = false

const init = async () => {
    if(actionCheck === true) {
        return;
    }

    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: 1024,
            height: 576,
        },
    });
    video.srcObject = stream;
    video.play();

    actionCheck = true
};

actionBtn.addEventListener("click", handleStart);


// record ask 버튼

const recordAskBtn = document.querySelector(".ask-record__btn")
const uploadVideo = document.querySelector(".upload__video")
const info = document.querySelector(".btn-info")

const handleRecordAsk = () => {
    if(uploadVideo.classList.contains("show-recorder")) {
        info.innerText=`What A Nice! 한 영상을 
        직접 녹화하고 싶을 경우 버튼을 눌러주세요!`
        recordAskBtn.innerText="Recorder 켜기"
        uploadVideo.classList.remove("show-recorder")
    } else {
        init();
        info.innerText=`녹화 시작 버튼을 누르면 5초간 녹화가 진행되며 
        녹화 영상과 썸네일 이미지를 다운받을 수 있습니다.`
        recordAskBtn.innerText="Recorder 끄기"
        uploadVideo.classList.add("show-recorder");
    }
}

recordAskBtn.addEventListener("click", handleRecordAsk)



// 썸네일 업로드 안했을 때 알림창

// "If you don't upload the thumbnail, the first moment of the video will be displayed as a thumbnail."

const thumb = document.getElementById("thumb");
const uploadBtn = document.querySelector(".upload__submit");

const handleThumbConfirm = (e) => {
    if (!thumb.value) {
        if (confirm("썸네일을 업로드하지 않으면, 영상의 첫 부분이 썸네일로써 보여집니다.")) {
            document.form.submit();
        } else {
            e.preventDefault();
        }
    }
}

uploadBtn.addEventListener("click", handleThumbConfirm);