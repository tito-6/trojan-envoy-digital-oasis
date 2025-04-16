// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { Request, Response } from "express";
import { sendContactHandler } from "./src/api/contact";

interface WaitingListData {
  email: string;
  name?: string;
  interests?: string[];
  message?: string;
  createdAt: string;
}

async function sendWaitingListHandler(req: Request, res: Response) {
  try {
    const data = req.body as WaitingListData;
    
    // Validate required fields
    if (!data.email) {
      throw new Error('Email is required');
    }

    // Here you would typically:
    // 1. Save to your database
    // 2. Send confirmation email
    // 3. Add to email marketing list
    // For now, we'll simulate success

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Successfully added to waiting list'
    }));
  } catch (error) {
    console.error('Error processing waiting list submission:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }));
  }
}

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
          if (pathname === "/api/contact" && req.method === "POST") {
            try {
              console.log("[API] Received contact form submission");
              
              // Parse the request body
              const buffers: Buffer[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const data = Buffer.concat(buffers).toString();
              req.body = data ? JSON.parse(data) : {};
              console.log("[API] Parsed request body:", req.body);

              // Call the API handler
              await sendContactHandler(req, res);
              console.log("[API] Contact form processed successfully");
            } catch (error) {
              console.error("[API] Middleware error:", error);
              if (!res.writableEnded) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                  error: "Internal server error",
                  details: error instanceof Error ? error.message : "Unknown error",
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
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error occurred'
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
