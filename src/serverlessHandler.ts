import type { Request, Response } from 'express';
import app, { initializeForServerless } from '../server';

export default async function handler(req: Request, res: Response) {
  await initializeForServerless();
  app(req, res);
}
