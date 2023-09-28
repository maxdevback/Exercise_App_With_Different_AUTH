import { Router } from "express";
import PagesController from "../../controllers/pages";

const router = Router();
router.get("/login", PagesController.loginPage);
router.get("/signup", PagesController.signupPage);

export default router;
