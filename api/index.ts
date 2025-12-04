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
  const expressApp = await getApp();
  return new Promise<void>((resolve, reject) => {
    expressApp(req as any, res as any, (err?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
