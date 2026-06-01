import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createAdminUser } from "./server/adminCreateUser.js";

function readRequestBody(request) {
  return new Promise((resolve) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
    });
    request.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    request.on("error", () => {
      resolve({});
    });
  });
}

function localApiPlugin() {
  return {
    name: "local-admin-create-user-api",
    configureServer(server) {
      const env = {
        ...process.env,
        ...loadEnv(server.config.mode, process.cwd(), ""),
      };

      server.middlewares.use("/api/admin-create-user", async (request, response) => {
        const result = await createAdminUser({
          method: request.method,
          headers: request.headers,
          body: await readRequestBody(request),
          env,
        });

        Object.entries(result.headers || {}).forEach(([name, value]) => {
          response.setHeader(name, value);
        });
        response.statusCode = result.status;

        if (result.body === null || result.body === undefined) {
          response.end();
          return;
        }

        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.end(JSON.stringify(result.body));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
});
