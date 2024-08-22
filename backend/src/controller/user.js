const db = require("../db/db");
const dbConfig = require("../config/dbConfig");

const database = new db(dbConfig);

exports.getUsers = async (req, res) => {
  try {
    await database.connect();

    const users = await database.query(`
        SELECT id, username, password, create_time
        FROM tbl_user
    `);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    await database.connect();

    const user = await database.query(
      `
        SELECT id, username, password, create_time
        FROM tbl_user WHERE id = ?
    `,
      [id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      data: user[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};
