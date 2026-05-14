const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const { jwt: jwtConfig } = require("../config/env");

const refreshTokens = new Map();

function buildPayload(user) {
  return {
    sub: user.id,
    email: user.email,
    role: user.role
  };
}

function issueTokens(user) {
  const payload = buildPayload(user);
  const refreshTokenId = randomUUID();

  const accessToken = jwt.sign(payload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn
  });

  const refreshToken = jwt.sign(
    {
      ...payload,
      jti: refreshTokenId
    },
    jwtConfig.refreshSecret,
    {
      expiresIn: jwtConfig.refreshExpiresIn
    }
  );

  refreshTokens.set(refreshTokenId, user.id);

  return { accessToken, refreshToken };
}

function rotateRefreshToken(refreshToken) {
  const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
  const { jti, sub, email, role } = decoded;

  if (!refreshTokens.has(jti) || refreshTokens.get(jti) !== sub) {
    return null;
  }

  refreshTokens.delete(jti);

  return issueTokens({ id: sub, email, role });
}

function verifyAccessToken(token) {
  return jwt.verify(token, jwtConfig.accessSecret);
}

function clearRefreshTokens() {
  refreshTokens.clear();
}

module.exports = {
  issueTokens,
  rotateRefreshToken,
  verifyAccessToken,
  clearRefreshTokens
};
