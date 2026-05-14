const request = require("supertest");
const app = require("../../src/app");
const userRepository = require("../../src/repositories/userRepository");
const tokenService = require("../../src/services/tokenService");

describe("auth routes", () => {
  beforeEach(async () => {
    await userRepository.clear();
    tokenService.clearRefreshTokens();
  });

  it("creates a user and allows authenticated access to /users/me", async () => {
    const registerResponse = await request(app).post("/auth/register").send({
      name: "API Admin",
      email: "api-admin@greenherb.pt",
      password: "StrongPass1",
      role: "ADMIN"
    });

    expect(registerResponse.statusCode).toBe(201);
    expect(registerResponse.body.user.email).toBe("api-admin@greenherb.pt");

    const meResponse = await request(app)
      .get("/users/me")
      .set(
        "Authorization",
        `Bearer ${registerResponse.body.accessToken}`
      );

    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.body.user.role).toBe("ADMIN");
  });

  it("accepts a valid JWT bearer token on a protected route", async () => {
    const registerResponse = await request(app).post("/auth/register").send({
      name: "JWT User",
      email: "jwt-user@greenherb.pt",
      password: "StrongPass1",
      role: "TECHNICIAN"
    });

    const response = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${registerResponse.body.accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe("jwt-user@greenherb.pt");
  });

  it("rejects an invalid JWT bearer token on a protected route", async () => {
    const response = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer invalid.jwt.token");

    expect(response.statusCode).toBe(401);
    expect(response.body.error.message).toBe(
      "Access token is invalid or expired."
    );
  });

  it("rejects protected routes without a bearer token", async () => {
    const response = await request(app).get("/users/me");

    expect(response.statusCode).toBe(401);
    expect(response.body.error.message).toBe("Bearer token is required.");
  });

  it("returns 500 when an unexpected internal error occurs", async () => {
    const registerResponse = await request(app).post("/auth/register").send({
      name: "Error User",
      email: "error-user@greenherb.pt",
      password: "StrongPass1",
      role: "TECHNICIAN"
    });

    const findByIdSpy = jest
      .spyOn(userRepository, "findById")
      .mockRejectedValueOnce(new Error("Unexpected repository failure"));

    const response = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${registerResponse.body.accessToken}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.error.message).toBe("Internal server error.");

    findByIdSpy.mockRestore();
  });
});
