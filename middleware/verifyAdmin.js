const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header: ", authHeader);

  const token = authHeader && authHeader.split(" ")[1];
  console.log("Extracted Token: ", token); // Log token to verify extraction

  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden" });
    }

    console.log("Decoded Token: ", decoded); // Log decoded token to check contents

    // Check if the user has the "admin" role
    if (decoded.role !== "admin") {
      return res.status(403).send({ message: "Access denied. Admins only." });
    }
    // If the user is an admin, proceed to the next middleware
    req.user = decoded;
    next();
  });
};

module.exports = verifyAdmin;
