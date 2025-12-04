import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp, initializeAppForServerless } from "../server/app";

let app: ReturnType<typeof createApp> | null = null;
let initialized = false;

async function getApp() {
  if (!app) {
    app = createApp();
  }
  if (!initialized) {
    await initializeAppForServerless(app);
    initialized = true;
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    return new Promise<void>((resolve, reject) => {
      expressApp(req as any, res as any, (err?: any) => {
        if (err) {
          console.error("Express error:", err);
          if (!res.headersSent) {
            res.status(500).json({ 
              message: "Internal server error",
              error: process.env.NODE_ENV === "production" ? undefined : err.message 
            });
          }
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error("Handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        message: "Internal server error",
        error: process.env.NODE_ENV === "production" ? undefined : String(error)
      });
    }
  }
}
