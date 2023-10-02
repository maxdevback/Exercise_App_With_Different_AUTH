import { Router } from "express";

import authRouter from "./auth/index.js";
import pagesRouter from "./pages/index.js";
import invalidRouter from "./invalid/index.js";
import dbRouter from "./db/index.js";

const router = Router();

router.use(authRouter);
router.use(pagesRouter);
router.use(dbRouter);
router.use(invalidRouter);

export default router;
