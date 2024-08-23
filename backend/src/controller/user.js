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

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  try {
    await database.connect();

    const result = await database.query(
      `
        UPDATE tbl_user 
        SET username = ?
        WHERE id = ?
      `,
      [username, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or no changes made",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await database.connect();

    const result = await database.query(
      `
        DELETE FROM tbl_user WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
