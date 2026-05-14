const AppError = require("../errors/AppError");
const tokenService = require("../services/tokenService");

function authenticate(req, _res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError(401, "Bearer token is required.");
    }

    req.user = tokenService.verifyAccessToken(token);
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError(401, "Access token is invalid or expired."));
  }
}

function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, "Insufficient permissions."));
    }

    return next();
  };
}

module.exports = {
  authenticate,
  authorize
};
