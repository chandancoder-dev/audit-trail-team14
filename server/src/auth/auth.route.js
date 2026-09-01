const {register, login,getCurrentUser, resetPassword} = require("./auth.controller");
const tokenVerification = require("../middleware/auth.middleware");
const express = require("express");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me",tokenVerification,getCurrentUser);
router.post("/reset-password", resetPassword)

module.exports = router;