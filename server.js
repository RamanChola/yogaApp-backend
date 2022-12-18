const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 8000;
const users = require("./routes/users");
const data = require("./routes/data");
const db = require("./db");
var cors = require("cors");
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  let eg;
  try {
    eg = await db.query("SELECT * FROM Client");
  } catch (error) {
    console.log(error);
    res.status(500).json("Fetching user failed, please try again");
  }
  res.status(200).json(eg);
});

app.use("/api/users", users);
app.use("/api/data", data);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
