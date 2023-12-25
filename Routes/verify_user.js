const jwt = require("jsonwebtoken");

const verify_token = (req, res, next) => {
  const authtoken = req.headers.authtoken;
  if (authtoken) {
    jwt.verify(authtoken, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        res.status(404).json({ status: "failed", msg: "Token is not valid" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res
      .status(404)
      .json({ status: "failed", msg: "You are not authenticated" });
  }
};

const verify_token_and_admin = (req, res, next) => {
  verify_token(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(404).json({ msg: "EROOR! You are not allowed to do that" });
    }
  });
};

module.exports = { verify_token, verify_token_and_admin };
