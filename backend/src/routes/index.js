const express = require("express");

const router = express.Router();
const { register } = require("../controller/auth");
const {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
} = require("../controller/user");

// Route User
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);

// Route Auth
router.post("/register", register);

module.exports = router;
