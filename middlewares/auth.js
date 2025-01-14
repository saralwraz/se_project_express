const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const AuthError = require("../utils/errors/AuthError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    throw new AuthError("Invalid token");
  }
};

module.exports = auth;
