import { Router } from "express";
import PagesController from "../../controllers/pages/index.js";
import { fetchExes } from "../../middlewares/fetchExe/index.js";

const router = Router();
router.get(
  "/",
  function (req, res, next) {
    if (!req.user) {
      return res.render("home");
    }
    next();
  },
  fetchExes,
  function (req, res, next) {
    res.locals.filter = null;
    res.render("index", { user: req.user });
  }
);
router.get("/login", PagesController.loginPage);
router.get("/signup", PagesController.signupPage);

export default router;
