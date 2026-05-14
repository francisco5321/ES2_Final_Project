const authService = require("../../src/services/authService");
const tokenService = require("../../src/services/tokenService");
const userRepository = require("../../src/repositories/userRepository");

describe("authService", () => {
  beforeEach(async () => {
    await userRepository.clear();
    tokenService.clearRefreshTokens();
  });

  it("registers a valid user and returns access/refresh tokens", async () => {
    const result = await authService.register({
      name: "Alice Manager",
      email: "alice@greenherb.pt",
      password: "StrongPass1",
      role: "MANAGER"
    });

    expect(result.user.email).toBe("alice@greenherb.pt");
    expect(result.user.role).toBe("MANAGER");
    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
  });

  it("rejects duplicated emails", async () => {
    await authService.register({
      name: "Admin User",
      email: "admin@greenherb.pt",
      password: "StrongPass1",
      role: "ADMIN"
    });

    await expect(
      authService.register({
        name: "Other Admin",
        email: "admin@greenherb.pt",
        password: "StrongPass1",
        role: "ADMIN"
      })
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "User already exists."
    });
  });

  it("rejects invalid roles", async () => {
    await expect(
      authService.register({
        name: "Bad Role",
        email: "bad@greenherb.pt",
        password: "StrongPass1",
        role: "VISITOR"
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Role must be TECHNICIAN, MANAGER or ADMIN."
    });
  });

  it("logs in an existing user with valid credentials", async () => {
    await authService.register({
      name: "Tech User",
      email: "tech@greenherb.pt",
      password: "StrongPass1",
      role: "TECHNICIAN"
    });

    const result = await authService.login({
      email: "tech@greenherb.pt",
      password: "StrongPass1"
    });

    expect(result.user.name).toBe("Tech User");
    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
  });

  it("rejects login when the password is empty", async () => {
    await authService.register({
      name: "Tech User",
      email: "tech@greenherb.pt",
      password: "StrongPass1",
      role: "TECHNICIAN"
    });

    await expect(
      authService.login({
        email: "tech@greenherb.pt",
        password: ""
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Password is required."
    });
  });

  it("rejects login with wrong password", async () => {
    await authService.register({
      name: "Tech User",
      email: "tech@greenherb.pt",
      password: "StrongPass1",
      role: "TECHNICIAN"
    });

    await expect(
      authService.login({
        email: "tech@greenherb.pt",
        password: "WrongPass1"
      })
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid credentials."
    });
  });

  it("rejects login for a non-existent username/email", async () => {
    await expect(
      authService.login({
        email: "missing@greenherb.pt",
        password: "StrongPass1"
      })
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid credentials."
    });
  });

  it("rejects login when username/email contains invalid characters", async () => {
    await expect(
      authService.login({
        email: "utilizador-invalido",
        password: "StrongPass1"
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Email is invalid."
    });
  });

  it("rejects login when both fields are empty", async () => {
    await expect(
      authService.login({
        email: "",
        password: ""
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Email and password are required."
    });
  });

  it("refreshes tokens with a valid refresh token", async () => {
    const registration = await authService.register({
      name: "Refresh User",
      email: "refresh@greenherb.pt",
      password: "StrongPass1",
      role: "MANAGER"
    });

    const result = await authService.refresh({
      refreshToken: registration.refreshToken
    });

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.refreshToken).not.toBe(registration.refreshToken);
  });

  it("rejects refresh without token", async () => {
    await expect(authService.refresh({})).rejects.toMatchObject({
      statusCode: 400,
      message: "Refresh token is required."
    });
  });
});
