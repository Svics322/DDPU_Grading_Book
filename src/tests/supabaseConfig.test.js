import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createAdminUser } from "../../server/adminCreateUser.js";

describe("account creation API", () => {
  it("uses the same-origin Vercel API route for account creation", () => {
    const repository = readFileSync("src/lib/repository.js", "utf8");
    const apiRoute = readFileSync("api/admin-create-user.js", "utf8");
    const serverHandler = readFileSync("server/adminCreateUser.js", "utf8");

    expect(repository).toContain("/api/admin-create-user");
    expect(apiRoute).toContain("createAdminUser");
    expect(serverHandler).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(serverHandler).toContain("admin.auth.admin.createUser");
  });

  it("serves the account creation API during local Vite development", () => {
    const viteConfig = readFileSync("vite.config.js", "utf8");

    expect(viteConfig).toContain("/api/admin-create-user");
    expect(viteConfig).toContain("createAdminUser");
  });

  it("returns an authorization response from the shared handler instead of falling through to 404", async () => {
    const result = await createAdminUser({
      method: "POST",
      headers: {},
      body: {
        email: "student.new@ddpu.edu.ua",
        password: "Student2026!",
        role: "student",
        full_name: "Новий Студент",
      },
      env: {
        SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_ANON_KEY: "anon-key",
        SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      },
    });

    expect(result.status).toBe(401);
    expect(result.body.message).toContain("авторизація");
  });
});
