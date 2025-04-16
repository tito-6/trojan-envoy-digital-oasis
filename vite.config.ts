// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { Request, Response } from "express";
import { sendContactHandler } from "./src/api/contact";
import { sendWaitingListHandler } from "./src/api/waiting-list";

export default defineConfig({
  server: {
    host: '0.0.0.0',  // <--- this exposes it to other devices on network
    port: 8080,
  },
  plugins: [
    react(),
    {
      name: "vite-api-middleware",
      configureServer(server) {
        server.middlewares.use(async (req: Request, res: Response, next) => {
          const { pathname } = new URL(req.url ?? "", `http://${req.headers.host}`);
          
          // Handle contact form submissions
          if (pathname === "/api/contact" && req.method === "POST") {
            try {
              console.log("[API] Received contact form submission");
              const buffers: Buffer[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const data = Buffer.concat(buffers).toString();
              req.body = data ? JSON.parse(data) : {};
              console.log("[API] Parsed request body:", req.body);
              await sendContactHandler(req, res);
              console.log("[API] Contact form processed successfully");
            } catch (error) {
              console.error("[API] Contact middleware error:", error);
              if (!res.writableEnded) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : "Unknown error occurred"
                }));
              }
            }
            return;
          }

          // Handle waiting list submissions
          if (pathname === "/api/waiting-list" && req.method === "POST") {
            try {
              console.log("[API] Received waiting list submission");
              const buffers: Buffer[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const data = Buffer.concat(buffers).toString();
              req.body = data ? JSON.parse(data) : {};
              console.log("[API] Parsed request body:", req.body);
              await sendWaitingListHandler(req, res);
              console.log("[API] Waiting list form processed successfully");
            } catch (error) {
              console.error("[API] Waiting list middleware error:", error);
              if (!res.writableEnded) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : "Unknown error occurred"
                }));
              }
            }
            return;
          }

          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
