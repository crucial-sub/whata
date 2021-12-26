import mongoose from "mongoose";
import bcrypt from "bcrypt";

// schema 설정
const userSchema = new mongoose.Schema({
    loginId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    socialOnly: {
        type: Boolean,
        default: false
    },
    avatarUrl: String,
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
});

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
});

const User = mongoose.model("User", userSchema);
export default User;