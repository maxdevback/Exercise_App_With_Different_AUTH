import { Router } from "express";
import AuthController from "../../controllers/auth";

const router = Router();
router.post("/signup", AuthController.signup);
router.post("/logout", AuthController.logout);

export default router;
