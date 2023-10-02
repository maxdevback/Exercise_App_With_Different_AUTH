import { Router } from "express";
import AuthController from "../../controllers/auth/index.js";
import DBLogic from "../../db/logic/index.js";
import { hash as hashPassword } from "bcrypt";
import passport from "passport";

const router = Router();
router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/login/federated/google", passport.authenticate("google"));

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/login/federated/facebook", passport.authenticate("facebook"));

router.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post("/signup", AuthController.signupPost);
router.post("/signup", AuthController.signup);
router.post("/logout", AuthController.logout);

export default router;
