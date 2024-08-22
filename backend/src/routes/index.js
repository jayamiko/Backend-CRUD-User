const express = require("express");

const router = express.Router();
const { getUser, getUsers } = require("../controller/user");
const { register } = require("../controller/auth");

// Route User
router.get("/users", getUsers);
router.get("/user/:id", getUser);

// Route Auth
router.post("/register", register);

module.exports = router;
