const express = require("express");
const cors = require("cors");

const db = require("./src/db/db");
const dbConfig = require("./src/config/dbConfig");
const router = require("./src/routes/index");

const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const database = new db(dbConfig);

app.use(express.json());

app.use("/api", router);

database
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on Port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
