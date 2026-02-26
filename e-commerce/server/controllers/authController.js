const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { name, email, password, account_type } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name, email, password, account_type) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, account_type]
    );

    res.json({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration Failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.execute(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, account_type: user.account_type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      account_type: user.account_type,
    });
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
};