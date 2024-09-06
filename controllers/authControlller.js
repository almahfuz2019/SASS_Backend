// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const createJwt = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
//       expiresIn: "365d",
//     });
//     console.log(req.body);

//     res.send({ success: true, token });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = createJwt;

const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel"); // Assuming User is your user model

const createJwt = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(req.body);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Include email and role in the token payload
    const payload = {
      email: user.email,
      role: user.role, // Adding role to the JWT payload
    };
    console.log(payload);

    // Generate the token
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "365d",
    });

    console.log("Generated token with role:", token);

    // Send token back in response
    res.send({ success: true, token });
  } catch (error) {
    next(error);
  }
};

module.exports = createJwt;
