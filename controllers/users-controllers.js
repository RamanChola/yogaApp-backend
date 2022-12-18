const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { v4: uuidv4 } = require("uuid");

// for signup
const signup = async (req, res) => {
  const { name, age, email, password } = req.body;
  let existingUser;
  if (age < 18 || age > 65) {
    return res.status(422).json("Age must be between 18 and 65");
  }
  // checks for existingUser based on email id
  try {
    existingUser = await db.query(`SELECT * FROM Client
      WHERE email_id="${email}"`);
  } catch (err) {
    res.status(500).json(err);
  }
  if (existingUser.length > 0) {
    return res.status(422).json("User exists already, please login instead");
  }
  let EncPass;
  try {
    EncPass = await bcrypt.hash(password, 12);
  } catch (err) {
    res.status(500).json(err);
  }
  // creates the user
  let createdUserId = uuidv4();
  let newUserQuery = `INSERT INTO Client(client_id, name, age, email_id, password)
                      VALUES ("${createdUserId}", "${name}", "${age}", "${email}", "${EncPass}");`;
  try {
    await db.query(newUserQuery);
  } catch (err) {
    res.status(500).json(err);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUserId,
      },
      process.env.JWT_SECRET
    );
  } catch (error) {
    res.status(500).json(err);
  }
  res.status(201).json({
    userId: createdUserId,
    username: name,
    token: token,
  });
};

// login for the user
const login = async (req, res) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await db.query(`SELECT * FROM Client
      WHERE email_id="${email}"`);
  } catch (err) {
    res.status(500).json(err);
  }
  if (existingUser.length == 0) {
    return res.status(404).json("User Not Found");
  }

  // decrypts and checks the password
  const validated = await bcrypt.compare(password, existingUser[0].password);
  if (!validated) {
    return res.status(401).json("wrong credentials");
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser[0].client_id,
      },
      process.env.JWT_SECRET
    );
  } catch (error) {
    res.status(500).json(error);
  }
  res.json({
    userId: existingUser[0].client_id,
    username: existingUser[0].name,
    token: token,
  });
};

module.exports = {
  signup,
  login,
};
