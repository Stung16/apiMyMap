const jwt = require("jsonwebtoken");
const { User, BlacklistToken } = require("../../src/models/index");

module.exports = async (req, res, next) => {
  const response = {};
  const token = req.get("Authorization")?.split(" ")[1];
  // const userId = req.headers[HEADER.CLIENT_ID];
  if (!token) {
    Object.assign(response, {
      status: 401,
      message: "Unauthorized",
    });
  } else {
    try {
      const existToken = await BlacklistToken.findOne({ where: { token } });
      if (existToken) {
        throw new Error("Token in blacklist");
      }
      const { JWT_SECRET } = process.env;
      const { userId, exp } = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password", "refresh_token"] },
      });
      if (!user) {
        throw new Error("User not exist");
      }
      req.user = {
        ...user,
        id: user?.id,
        accessToken: token,
        expired: new Date(exp * 1000),
      };
      return next();
    } catch {
      Object.assign(response, {
        status: 401,
        message: "Unauthorized",
      });
    }
  }
  return res.status(response.status).json(response);
};
