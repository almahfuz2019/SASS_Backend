const jwt = require("jsonwebtoken");
require("dotenv").config();

const createJwt = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "365d",
    });
    res.send({ success: true, token });
  } catch (error) {
    next(error);
  }
};

module.exports = createJwt;
