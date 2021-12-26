import express from "express";
import {
    see,
    startGithubLogin,
    finishGithubLogin,
    logout,
    getEdit,
    postEdit,
    getChangePassword,
    postChangePassword,
} from "../controllers/userController";
import {
    protectorMiddleware,
    publicOnlyMiddleware,
    avatarUpload,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/:id([0-9a-f]{24})", see);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/logout", protectorMiddleware, logout);


export default userRouter;