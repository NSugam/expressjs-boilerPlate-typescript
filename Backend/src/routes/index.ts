import { Router } from "express";
const router = Router();

router.use("/user", require("./user"));

router.use("/auth", require("./auth"));

router.use("/file", require("./file-handler"));

export default router;
