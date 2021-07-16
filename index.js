`use strict`

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
require("dotenv").config();

const port = process.env.PORT || 8000;

app.enable("trust-proxy");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const api = require("./api");
const router = express.Router();
router.use("/api", api);

app.use((req, res, next) => {
    req.method = "GET";
    next();
});

const _app_folder = "./frontend/dist/frontend";

app.get("*.*", express.static(_app_folder, { maxAge: "1y" }));
app.all("*", (req, res) => {
    res.status(200).sendFile("/", { root: _app_folder });
});

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
});


http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
