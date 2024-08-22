const bcrypt = require("bcrypt");
const Joi = require("joi");
const db = require("../db/db");
const dbConfig = require("../config/dbConfig");
const generateToken = require("../utils/generateToken");

const database = new db(dbConfig);

exports.register = async (req, res) => {
  const registerSchema = Joi.object({
    username: Joi.string().max(128).required(),
    password: Joi.string().min(5).max(8).required(),
  });

  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      error: { message: error.details[0].message },
    });
  }

  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const encodedPassword = Buffer.from(hashedPassword)
      .toString("base64")
      .slice(0, 54);

    await database.connect();

    const result = await database.query(
      "INSERT INTO tbl_user (username, password) VALUES (?, ?)",
      [username, encodedPassword]
    );

    const newUserId = result.insertId;

    const token = generateToken(newUserId);

    res.status(200).send({
      success: true,
      data: {
        username,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};
