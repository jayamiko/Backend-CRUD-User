const express = require("express");

const router = express.Router();
const {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
} = require("../controller/user");
const { register, login } = require("../controller/auth");

// Route User
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);

// Route Auth
router.post("/register", register);
router.post("/login", login);

module.exports = router;
