import { Router } from "express";

import authRouter from "./auth";
import pagesRouter from "./pages";
import invalidRouter from "./invalid";

const router = Router();

router.use(authRouter);
router.use(pagesRouter);
router.use(invalidRouter);

export default router;
