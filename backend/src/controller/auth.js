const bcrypt = require("bcrypt");
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
      status: "failed",
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
