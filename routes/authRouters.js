const authRouter = require("express").Router();
const createJwt = require("../controllers/authControlller");
authRouter.post("/jwt", createJwt);
module.exports = authRouter;
