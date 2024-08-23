const express = require("express");

const router = express.Router();
const {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
} = require("../controller/user");
const { register, login, checkAuth } = require("../controller/auth");

// Route User
router.get("/users", getUsers);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);

// Route Auth
router.post("/register", register);
router.post("/login", login);
router.get("/checkAuth", checkAuth);

module.exports = router;
