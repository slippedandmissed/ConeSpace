require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = { client: mongoClient };

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);


module.exports = { db, http, io, app };
