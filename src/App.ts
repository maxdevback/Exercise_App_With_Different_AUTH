import express from "express";
import path from "path";
import { compare as comparePassword } from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oidc";
import session from "express-session";
import DBLogic from "./db/logic";

import routes from "./routes";

export const App = express();
App.use(
  session({
    secret: "test-secret",
    resave: false,
    saveUninitialized: true,
  })
);

App.use(passport.authenticate("session"));
passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const row = await DBLogic.getUserByUsername(username);
      //@ts-ignore
      if (await comparePassword(password, row.hashed_password)) cb(null, row);
      cb(null, false, { message: "Incorrect username or password." });
    } catch (err) {
      return cb(err);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile"],
    },
    function verify(issuer, profile, cb) {
      const row = DBLogic.getFederatedCredentials(
        issuer,
        profile.id,
        profile.displayName
      );
    }
  )
);

passport.use(new FacebookStrategy());

passport.use(new OpenIdConnectStrategy());

// passport.serializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, { id: user.id, username: user.username, name: user.name });
//   });
// });

// passport.deserializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, user);
//   });
// });

// App.use(function (req, res, next) {
//   //@ts-ignore
//   var msgs = req.session.messages || [];
//   res.locals.messages = msgs;
//   res.locals.hasMessages = !!msgs.length;
//   //@ts-ignore
//   req.session.messages = [];
//   next();
// });
// App.use(function (err, req, res, next) {
//   // set locals, only providing error in dev
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

App.set("views", path.join(__dirname, "views"));
App.set("view engine", "ejs");
App.use(express.static(path.join(__dirname, "public")));
App.use(routes);

App.listen(3000, () => {
  console.log("App has been started at 3000 port");
});
