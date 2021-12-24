"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _expressFlash = _interopRequireDefault(require("express-flash"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _rootRouters = _interopRequireDefault(require("./routers/rootRouters"));

var _userRouters = _interopRequireDefault(require("./routers/userRouters"));

var _videoRouters = _interopRequireDefault(require("./routers/videoRouters"));

var _middlewares = require("./middlewares");

var _apiRouters = _interopRequireDefault(require("./routers/apiRouters"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var logger = (0, _morgan["default"])("dev");
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"].json());
app.use((0, _expressSession["default"])({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: _connectMongo["default"].create({
    mongoUrl: process.env.DB_URL
  })
})); // app.use((req, res, next) => {
//     req.sessionStore.all((error, sessions) => {
//         console.log(sessions);
//         next();
//     });
// });

app.use((0, _expressFlash["default"])());
app.use(_middlewares.localsMiddleware);
app.use("/uploads", _express["default"]["static"]("uploads"));
app.use("/static", _express["default"]["static"]("assets"), _express["default"]["static"]("node_modules/@ffmpeg/core/dist")); // 처음에 비디오 업로드할 때 SharedArrayBuffer will require cross-origin isolation as of M92 오류가 생겨서 https://nomadcoders.co/wetube/lectures/2776/issues/1707에서 참고하여 "Cross-Origin-Embedder-Policy"를 "require-corp"로 했다가 나중에 빈 프로필 이미지를 다른 사이트에서 가져올 때 오류가 생겨서 "credentialless"로 바꿨더니 다시 작동한다.

app.use(function (req, res, next) {
  res.header("Cross-Origin-Embedder-Policy", "credentialless");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
}); // app.use((req, res, next) => {
//     res.header("Cross-Origin-Embedder-Policy", "require-corp");
//     res.header("Cross-Origin-Opener-Policy", "cross-origin");
//     // res.header("Cross-Origin-Embedder-Policy", "credentialless");
//     // res.header("Cross-Origin-Resource-Policy", "same-site");
//     // res.header("Cross-Origin-Resource-Policy", "cross-origin");
//     next();
// });

app.use("/", _rootRouters["default"]);
app.use("/users", _userRouters["default"]);
app.use("/videos", _videoRouters["default"]);
app.use("/api", _apiRouters["default"]);
var _default = app;
exports["default"] = _default;