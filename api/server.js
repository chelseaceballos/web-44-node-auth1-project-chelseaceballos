const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session)

const usersRouter = require('./users/users-router')
const authRouter = require("./auth/auth-router")

/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.
  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".
  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */

const server = express();

server.use(session({
  // config of cookie and session store
  name: 'chocolatechip', //name of cookie
  secret: 'shhh!', //env not from code
  saveUninitialized: false, // privacy implications, if false no cookie is set on client unless the req.session is changed
  resave: false, // some data stores need this set to true
  store: new KnexSessionStore({
    knex: require('./../data/db-config'), // configured instance of knex
    createtable: true, // if the table does not exist, it will create it automatically
    clearInterval: 1000 * 60 * 10, // time it takes to check for old sessions and remove them from the database to keep it clean and performant
    tablename: 'sessions', // table that will store sessions inside the db, name it anything you want
    sidfieldname: 'sid', // column that will hold the session id, name it anything you want
  }),
  cookie: {
    maxAge: 1000 * 60 * 10, //if not provided, expires as soon as you close the browser
    secure: false, // if true the cookie is not set unless it's an https connection
    httpOnly: true, // if true the cookie is not accessible through document.cookie
  },
}));

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter)

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;