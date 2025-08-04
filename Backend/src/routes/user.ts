import { Router } from "express";
const router = Router();

const userController = require("../controllers/userController");

var validator = require("express-joi-validation").createValidator({});
var validate = require("../middlewares/validate");

router.post("/register", userController.userRegister);

router.post("/login", validator.body(validate.loginSchema), userController.userLogin);

router.post("/logout", userController.userLogout);

router.get("/all-users", userController.allUsers);

router.post("/update", userController.userUpdate);

router.post("/delete", validator.body(validate.DeleteAccountSchema), userController.userDelete);

router.get("/profile", (req: any, res: any) => {
	return res.status(200).json({ message: "User profile details", success: true, user: req.user });
});

module.exports = router;
