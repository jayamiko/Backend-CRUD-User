const mysql = require("mysql2");

class db {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) {
          reject("Error connecting to the database: " + err);
        } else {
          resolve("Connected to the database");
        }
      });
    });
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  execute(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.execute(sql, args, (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve([results, fields]);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) {
          reject(err);
        } else {
          resolve("Connection closed");
        }
      });
    });
  }
}

module.exports = db;
