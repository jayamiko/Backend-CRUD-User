const db = require("../db/db"); // Assuming db is your custom class
const dbConfig = require("../config/dbConfig");

const database = new db(dbConfig);

const findUserByUsername = async (username) => {
  try {
    await database.connect();

    const user = await database.query(
      `
        SELECT id, username, password, create_time
        FROM tbl_user WHERE username = ?
    `,
      [username]
    );

    if (user.length > 0) {
      return user[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
};

module.exports = { findUserByUsername };
