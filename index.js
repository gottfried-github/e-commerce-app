import path from "path";
import { fileURLToPath } from "url";

import session from "express-session";
import SessionStorage from "connect-mongo";

import express from "express";
import { MongoClient } from "mongodb";

import { api as _api } from "../e-commerce-api/src/server/index.js";
import _store from "../e-commerce-mongo/src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function main(port) {
  /* ensure environment variables */
  // database connection data
  if (
    !process.env.APP_DB_NAME ||
    !process.env.APP_DB_USER ||
    !process.env.APP_DB_PASS ||
    !process.env.NET_NAME
  )
    throw new Error(
      "all of the database connection parameters environment variables must be set"
    );

  // express-session uses this
  if (!process.env.SESSION_SECRETS)
    throw new Error("SESSION_SECRETS environment variable must be set");

  /* express-session setup (see `express-session` in e-commerce-api) */
  const sessionOptions = {
    secret: process.env.SESSION_SECRETS.split(" "),
    saveUninitialized: false,
    resave: false,
    store: SessionStorage.create({
      mongoUrl: `mongodb://${process.env.APP_DB_USER}:${process.env.APP_DB_PASS}@${process.env.NET_NAME}/${process.env.APP_DB_NAME}`,
      collectionName: "sessions",
      touchAfter: 24 * 3600,
    }),
    cookie: {
      httpOnly: true,
      sameSite: false,
      secure: false,
    },
  };

  if (process.env.NODE_ENV === "production")
    sessionOptions.cookie.secure = true;

  /* connect to database */
  const client = new MongoClient(
    `mongodb://${process.env.APP_DB_USER}:${process.env.APP_DB_PASS}@${process.env.NET_NAME}/${process.env.APP_DB_NAME}`
  );
  client.connect();

  /* initialize store and api */
  const store = _store(client.db(process.env.APP_DB_NAME), client);
  const api = _api(store, {
    productUploadPath: "public/product",
    productDiffPath: "public",
    root: __dirname,
    productPublicPrefix: "/",
  });

  /* express application setup */
  const app = express();

  app.use(session(sessionOptions));

  app.use("/api/", api);

  // send index.html from anywhere: let front-end handle routing
  app.use(["/admin", "/admin/*"], (req, res, next) => {
    res.sendFile(path.join(__dirname, "./dist/front-end/admin.html"));
  });

  app.use("/", express.static(path.join(__dirname, "./dist/front-end")));
  app.use("/", express.static(path.join(__dirname, "./public")));

  app.use("/*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "./dist/front-end/visitor.html"));
  });

  /* start server */
  const server = app.listen(3000, () => {
    console.log("listening on port 3000");
  });

  return { app, server, api, store };
}

main(3000);
console.log(import.meta.url);
