import { describe, it, expect } from "vitest";
import axios from "axios";
import { fakeBackendAdapter } from "@/mocks/fake-backend";

const api = axios.create({
  baseURL: "http://localhost:3000",
  adapter: fakeBackendAdapter,
});

describe("fake backend adapter", () => {
  it("returns a user and a token for valid credentials", async () => {
    const { status, data } = await api.post("/login", {
      username: "test@gmail.com",
      password: "test",
    });

    expect(status).toBe(200);
    expect(data.token).toBeTruthy();
    expect(data.user.firstName).toBe("Test");
    expect(data.user).not.toHaveProperty("password");
  });

  it("rejects wrong credentials with a message", async () => {
    await expect(
      api.post("/login", { username: "test@gmail.com", password: "wrong" }),
    ).rejects.toMatchObject({
      response: {
        status: 400,
        data: { message: "Username or password is incorrect" },
      },
    });
  });

  it("requires a bearer token on /users", async () => {
    await expect(api.get("/users")).rejects.toMatchObject({
      response: { status: 401 },
    });
  });

  it("returns users when authenticated", async () => {
    const { data } = await api.get("/users", {
      headers: { Authorization: "Bearer fake-jwt-token" },
    });

    expect(data).toHaveLength(2);
    expect(data[0]).not.toHaveProperty("password");
  });
  it("accepts a valid contact message", async () => {
    const { status, data } = await api.post("/contact", {
      name: "Ada",
      email: "ada@example.com",
      message: "A message that is comfortably long enough.",
    });

    expect(status).toBe(201);
    expect(data.name).toBe("Ada");
  });

  it("rejects a blocked domain with per-field errors", async () => {
    await expect(
      api.post("/contact", {
        name: "Ada",
        email: "ada@spam.test",
        message: "A message that is comfortably long enough.",
      }),
    ).rejects.toMatchObject({
      response: {
        status: 422,
        data: { errors: { email: ["That domain is blocked."] } },
      },
    });
  });
});
