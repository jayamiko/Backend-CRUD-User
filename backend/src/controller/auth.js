const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../db/db");
const dbConfig = require("../config/dbConfig");
const generateToken = require("../utils/generateToken");
const { findUserByUsername } = require("../services/user");

const database = new db(dbConfig);

const schema = Joi.object({
  username: Joi.string().max(128).required(),
  password: Joi.string().min(5).max(8).required(),
});

exports.register = async (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      error: { message: error.details[0].message },
    });
  }

  const { username, password } = req.body;

  try {
    await database.connect();

    const existingUser = await database.query(
      "SELECT * FROM tbl_user WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).send({
        error: { message: "Username already exists" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await database.query(
      "INSERT INTO tbl_user (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    const newUserId = result.insertId;

    const token = generateToken(newUserId);

    res.status(200).send({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

exports.login = async (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      error: { message: error.details[0].message },
    });
  }

  try {
    const { username, password } = req.body;

    const userExist = await findUserByUsername(username);
    if (!userExist) {
      return res.status(400).send({
        success: false,
        message: "user not dound",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res.status(400).send({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = generateToken(userExist.id);

    res.status(200).send({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    await database.connect();

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        status: "failed",
        message: "No token provided or token format invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userData = await database.query(
      "SELECT id, username, create_time FROM tbl_user WHERE id = ?",
      [decoded.id]
    );

    if (!userData.length) {
      return res.status(404).send({
        status: "failed",
        message: "User not found",
      });
    }

    const user = userData[0];
    const newUserData = {
      id: user.id,
      username: user.username,
      create_time: user.create_time,
    };

    res.send({
      success: true,
      data: {
        user: newUserData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "server error",
    });
  }
};
