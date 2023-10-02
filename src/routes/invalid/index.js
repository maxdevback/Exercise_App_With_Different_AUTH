import { Router } from "express";

const router = Router();

router.all("*", (req, res) => {
  res.status(404);
  res.send("404");
});

export default router;
