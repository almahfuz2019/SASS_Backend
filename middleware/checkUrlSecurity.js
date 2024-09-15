const { URL } = require("url");

const checkUrlSecurity = (req, res, next) => {
  try {
    const { url } = req;

    // Create a new URL object to validate the URL format
    const parsedUrl = new URL(url, `${req.protocol}://${req.get("host")}`);

    // Proceed to next middleware if URL is valid
    next();
  } catch (error) {
    // If the URL is malformed, respond with 400 Bad Request
    res.status(400).json({ error: "Invalid URL." });
  }
};

module.exports = checkUrlSecurity;
