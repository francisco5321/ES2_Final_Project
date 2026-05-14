const request = require("supertest");
const app = require("../../src/app");
const userRepository = require("../../src/repositories/userRepository");
const tokenService = require("../../src/services/tokenService");

describe("auth system flows", () => {
  beforeEach(async () => {
    await userRepository.clear();
    tokenService.clearRefreshTokens();
  });

  it("completes the full authentication flow from registration to profile access", async () => {
    const registerResponse = await request(app).post("/auth/register").send({
      name: "System User",
      email: "system-user@greenherb.pt",
      password: "StrongPass1",
      role: "TECHNICIAN"
    });

    expect(registerResponse.statusCode).toBe(201);

    const loginResponse = await request(app).post("/auth/login").send({
      email: "system-user@greenherb.pt",
      password: "StrongPass1"
    });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.user.email).toBe("system-user@greenherb.pt");

    const meResponse = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${loginResponse.body.accessToken}`);

    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.body.user.email).toBe("system-user@greenherb.pt");
  });

  it("keeps the session valid after refreshing tokens", async () => {
    const registerResponse = await request(app).post("/auth/register").send({
      name: "Refresh Flow User",
      email: "refresh-flow@greenherb.pt",
      password: "StrongPass1",
      role: "MANAGER"
    });

    expect(registerResponse.statusCode).toBe(201);

    const refreshResponse = await request(app).post("/auth/refresh").send({
      refreshToken: registerResponse.body.refreshToken
    });

    expect(refreshResponse.statusCode).toBe(200);
    expect(refreshResponse.body.accessToken).toEqual(expect.any(String));
    expect(refreshResponse.body.refreshToken).toEqual(expect.any(String));

    const meResponse = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${refreshResponse.body.accessToken}`);

    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.body.user.email).toBe("refresh-flow@greenherb.pt");
  });

  it("blocks access to the protected endpoint without a valid token in a realistic flow", async () => {
    const noTokenResponse = await request(app).get("/users/me");

    expect(noTokenResponse.statusCode).toBe(401);
    expect(noTokenResponse.body.error.message).toBe("Bearer token is required.");

    const invalidTokenResponse = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer invalid.jwt.token");

    expect(invalidTokenResponse.statusCode).toBe(401);
    expect(invalidTokenResponse.body.error.message).toBe(
      "Access token is invalid or expired."
    );
  });
});
