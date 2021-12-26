import express from "express";
import {
    countComments,
    createComment,
    deleteComment,
    registerView,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/comments/:id([0-9a-f]{24})", deleteComment);
apiRouter.post("/comments/:id([0-9a-f]{24})/count", countComments);
export default apiRouter;