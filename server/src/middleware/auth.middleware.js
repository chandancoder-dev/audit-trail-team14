const jwt = require("jsonwebtoken");

const tokenVerification = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      const data = jwt.verify(token, process.env.JWT_SECRET);

      req.id = data.id;

      next();
    } catch (e) {
      return res.status(401).json({
        message: "Not authorized, invalid token",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};

module.exports = tokenVerification;