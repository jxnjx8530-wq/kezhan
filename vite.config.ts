import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { saveLead } from "./server/leads";
import { synthesizeSpeech } from "./server/tts";

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
        req.on("end", async () => {
          res.setHeader("Content-Type", "application/json");
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            const result = await saveLead(parsedBody);
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

// Mirrors the POST /api/tts route registered in server/index.ts for production,
// since `vite dev` never runs the Express server.
function ttsApiDevPlugin(): Plugin {
  return {
    name: "tts-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/tts", (req, res, next) => {
        if (req.method !== "POST") {
          next();
          return;
        }
        let body = "";
        req.on("data", chunk => {
          body += chunk;
        });
        req.on("end", async () => {
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            const result = await synthesizeSpeech(parsedBody.text);
            if (!result.ok) {
              res.statusCode = result.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: false, error: result.error }));
              return;
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", result.contentType);
            res.end(result.audio);
          } catch {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: "invalid_json" }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), leadsApiDevPlugin(), ttsApiDevPlugin()],
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
