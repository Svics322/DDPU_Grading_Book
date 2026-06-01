import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Supabase function config", () => {
  it("lets admin-create-user handle CORS preflight before checking admin role", () => {
    const config = readFileSync("supabase/config.toml", "utf8");

    expect(config).toContain("[functions.admin-create-user]");
    expect(config).toContain("verify_jwt = false");
  });
});
