import DBController from "../../controllers/db/index.js";
import { Router } from "express";
import { fetchExes } from "../../middlewares/fetchExe/index.js";
const router = Router();

router.post("/", DBController.postExes);
router.post("/:id", DBController.update);
router.get("/active", fetchExes, DBController.active);
router.get("/completed", fetchExes, DBController.completed);
router.post("/:id/delete", DBController.delete);
router.post("/clear-completed", DBController.clearCompleted);

export default router;
