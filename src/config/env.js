const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 3000),
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "greenherb-access-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "greenherb-refresh-secret",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
  }
};
