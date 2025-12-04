import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp, initializeApp } from "../server/app";

let app: ReturnType<typeof createApp> | null = null;
let initialized = false;

async function getApp() {
  if (!app) {
    app = createApp();
  }
  if (!initialized) {
    await initializeApp(app);
    initialized = true;
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expressApp = await getApp();
  return expressApp(req as any, res as any);
}
