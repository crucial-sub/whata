import mongoose from "mongoose";

// schema 설정
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    thumbUrl: {
        type: String,
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
        default: Date.now
    },
    hashtags: [{
        type: String,
        trim: true
    }],
    meta: {
        views: {
            type: Number,
            default: 0,
            required: true
        },
    },
    category: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Comment"
    }, ],
    commentsCount: {
        type: Number,
        default: 0,
        required: true,
    }
});

videoSchema.static("hashtagForm", function (hashtags) {
    return hashtags
        .split(",")
        .map((hashtag) => hashtag.startsWith("#") ? hashtag : `#${hashtag}`)
})

const Video = mongoose.model("Video", videoSchema);

export default Video;