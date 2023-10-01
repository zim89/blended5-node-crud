const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // получаем токен
    // расшифровуем токен
    // передаем инфо с токена дальше
    const [type, token] = req.headers.authorization.split(" ");
    if (type === "Bearer" && token) {
      const decoded = jwt.verify(token, "cat");
      req.user = decoded;
      next();
    } else {
      res.status(401);
      throw new Error("No token provided or invalid token");
    }
  } catch (error) {
    res.status(401).json({ code: 401, message: error.message });
  }
};
