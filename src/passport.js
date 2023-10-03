import cookie from "cookie-parser";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oidc";
import session from "express-session";
import DBLogic from "./db/logic/index.js";
import FacebookStrategy from "passport-facebook";
import OpenIdConnectStrategy from "passport-openidconnect";
import { App } from "./App.js";

export const initPassport = (express) => {
  App.use(cookie());
  App.use(express.urlencoded({ extended: false }));
  App.use(
    session({
      secret: "test-secret",
      resave: false,
      saveUninitialized: true,
    })
  );

  App.use(passport.authenticate("session"));
  passport.use(
    new LocalStrategy(async function verify(username, password, cb) {
      try {
        cb(null, await DBLogic.login(username, password));
      } catch (err) {
        cb(null, false, err);
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
      async function verify(issuer, profile, cb) {
        try {
          await DBLogic.getFederatedCredentials(
            issuer,
            profile.id,
            profile.displayName
          );
          cb(null, { id: profile.id, name: profile.displayName });
        } catch (err) {
          cb(null, false, err);
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "/oauth2/redirect/facebook",
        state: true,
      },
      async function verify(accessToken, refreshToken, profile, cb) {
        try {
          await DBLogic.getFederatedCredentials(
            "https://www.facebook.com",
            profile.id,
            profile.displayName
          );
          cb(null, { id: profile.id, name: profile.displayName });
        } catch (err) {
          cb(null, false, err);
        }
      }
    )
  );

  passport.use(
    new OpenIdConnectStrategy(
      {
        issuer: "https://" + process.env.AUTH0_DOMAIN + "/",
        authorizationURL: "https://" + process.env.AUTH0_DOMAIN + "/authorize",
        tokenURL: "https://" + process.env.AUTH0_DOMAIN + "/oauth/token",
        userInfoURL: "https://" + process.env.AUTH0_DOMAIN + "/userinfo",
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: "/oauth2/redirect",
        scope: ["profile"],
      },
      function verify(issuer, profile, cb) {
        return cb(null, profile);
      }
    )
  );

  passport.serializeUser(function (user, cb) {
    try {
      return cb(null, {
        id: user.id,
        username: user.username,
        name: user.name,
      });
    } catch (err) {
      return cb(null, false, err);
    }
  });

  passport.deserializeUser(function (user, cb) {
    try {
      return cb(null, user);
    } catch (err) {
      return cb(null, false, err);
    }
  });
};
