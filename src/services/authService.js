const bcrypt = require("bcryptjs");
const AppError = require("../errors/AppError");
const userRepository = require("../repositories/userRepository");
const tokenService = require("./tokenService");

const VALID_ROLES = ["TECHNICIAN", "MANAGER", "ADMIN"];

function validateRegistrationPayload({ name, email, password, role }) {
  if (!name || name.trim().length < 3) {
    throw new AppError(400, "Name must contain at least 3 characters.");
  }

  if (!email || !email.includes("@")) {
    throw new AppError(400, "Email is invalid.");
  }

  if (!password || password.length < 8) {
    throw new AppError(400, "Password must contain at least 8 characters.");
  }

  if (!VALID_ROLES.includes(role)) {
    throw new AppError(400, "Role must be TECHNICIAN, MANAGER or ADMIN.");
  }
}

async function register(input) {
  validateRegistrationPayload(input);

  const existingUser = await userRepository.findByEmail(input.email);
  if (existingUser) {
    throw new AppError(409, "User already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await userRepository.create({
    name: input.name.trim(),
    email: input.email.trim(),
    passwordHash,
    role: input.role
  });

  const tokens = tokenService.issueTokens(user);

  return {
    user,
    ...tokens
  };
}

async function login({ email, password }) {
  if (!email && !password) {
    throw new AppError(400, "Email and password are required.");
  }

  if (!email) {
    throw new AppError(400, "Email is required.");
  }

  if (!email.includes("@")) {
    throw new AppError(400, "Email is invalid.");
  }

  if (!password) {
    throw new AppError(400, "Password is required.");
  }

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError(401, "Invalid credentials.");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new AppError(401, "Invalid credentials.");
  }

  const safeUser = userRepository.sanitize(user);
  const tokens = tokenService.issueTokens(safeUser);

  return {
    user: safeUser,
    ...tokens
  };
}

async function refresh({ refreshToken }) {
  if (!refreshToken) {
    throw new AppError(400, "Refresh token is required.");
  }

  const tokens = tokenService.rotateRefreshToken(refreshToken);
  if (!tokens) {
    throw new AppError(401, "Refresh token is invalid or expired.");
  }

  return tokens;
}

module.exports = {
  VALID_ROLES,
  register,
  login,
  refresh
};
