import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouters";
import userRouter from "./routers/userRouters";
import videoRouter from "./routers/videoRouters";
import {
    localsMiddleware
} from "./middlewares";
import apiRouter from "./routers/apiRouters";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");

app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL
        }),
    })
);

// app.use((req, res, next) => {
//     req.sessionStore.all((error, sessions) => {
//         console.log(sessions);
//         next();
//     });
// });

app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use(
    "/static",
    express.static("assets"),
    express.static("node_modules/@ffmpeg/core/dist")
);

// 처음에 비디오 업로드할 때 SharedArrayBuffer will require cross-origin isolation as of M92 오류가 생겨서 https://nomadcoders.co/wetube/lectures/2776/issues/1707에서 참고하여 "Cross-Origin-Embedder-Policy"를 "require-corp"로 했다가 나중에 빈 프로필 이미지를 다른 사이트에서 가져올 때 오류가 생겨서 "credentialless"로 바꿨더니 다시 작동한다.
app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "credentialless");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
});
// app.use((req, res, next) => {
//     res.header("Cross-Origin-Embedder-Policy", "require-corp");
//     res.header("Cross-Origin-Opener-Policy", "cross-origin");
//     // res.header("Cross-Origin-Embedder-Policy", "credentialless");
//     // res.header("Cross-Origin-Resource-Policy", "same-site");
//     // res.header("Cross-Origin-Resource-Policy", "cross-origin");
//     next();
// });

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;