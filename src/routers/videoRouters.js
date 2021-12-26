import express from "express";
import {
    watch,
    getUpload,
    postUpload,
    getEdit,
    postEdit,
    deleteVideo,
    categoryPage,
} from "../controllers/videoController";
import {
    protectorMiddleware,
    videoUpload
} from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", deleteVideo);
videoRouter
    .route("/upload")
    .all(protectorMiddleware)
    .get(getUpload)
    .post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), 
    postUpload
    );
videoRouter.get("/goals", categoryPage);
videoRouter.get("/funs", categoryPage);
videoRouter.get("/recordings", categoryPage);
export default videoRouter;