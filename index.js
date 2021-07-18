`use strict`

const express = require("express");
require("dotenv").config();
const { app, http, io, db } = require("./common");

const port = process.env.PORT || 8000;

app.enable("trust-proxy");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const api = require("./api");
const router = express.Router();
router.use("/api", api.router);

app.use(router);

app.use((req, res, next) => {
    req.method = "GET";
    next();
});

const _app_folder = "./frontend/dist/frontend";

app.get("*.*", express.static(_app_folder, { maxAge: "1y" }));
app.all("*", (req, res) => {
    res.status(200).sendFile("/", { root: _app_folder });
});


db.client.connect(function (err) {
    if (err) {
        console.error(err);
        return;
    }

    db.db = db.client.db("conespace");

    http.listen(port, () => {
        console.log(`Listening on port ${port}`)
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        api.emitAttributes(null, socket);
    });
});
