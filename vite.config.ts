import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { saveLead } from "./server/leads";

// Mirrors the POST /api/leads route registered in server/index.ts for production,
// since `vite dev` never runs the Express server.
function leadsApiDevPlugin(): Plugin {
  return {
    name: "leads-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/leads", (req, res, next) => {
        if (req.method !== "POST") {
          next();
          return;
        }
        let body = "";
        req.on("data", chunk => {
          body += chunk;
        });
        req.on("end", () => {
          res.setHeader("Content-Type", "application/json");
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            const result = saveLead(parsedBody);
            res.statusCode = result.ok ? 200 : result.status;
            res.end(
              JSON.stringify(
                result.ok ? { ok: true } : { ok: false, error: result.error }
              )
            );
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, error: "invalid_json" }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), leadsApiDevPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
