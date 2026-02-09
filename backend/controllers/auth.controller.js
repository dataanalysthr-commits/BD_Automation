const db = require("../config/db");
const jwt = require("jsonwebtoken");


exports.login = (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

     const user = results[0];

     
    // 🔐 Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, allowedPage: user.allowed_page },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      allowedPage: user.allowed_page

    });
  });
};