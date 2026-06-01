import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Supabase function config", () => {
  it("lets admin-create-user handle CORS preflight before checking admin role", () => {
    const config = readFileSync("supabase/config.toml", "utf8");

    expect(config).toContain("[functions.admin-create-user]");
    expect(config).toContain("verify_jwt = false");
  });

  it("uses the same-origin Vercel API route for account creation", () => {
    const repository = readFileSync("src/lib/repository.js", "utf8");
    const apiRoute = readFileSync("api/admin-create-user.js", "utf8");

    expect(repository).toContain("/api/admin-create-user");
    expect(apiRoute).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(apiRoute).toContain("admin.auth.admin.createUser");
  });
});
