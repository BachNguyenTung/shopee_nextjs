import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from "@/configs/firebase-admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set no-cache headers for critical auth endpoint
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  // Parse cookies from the request header
  const sessionCookie = req.cookies.session || '';
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    res.status(200).json(decodedClaims);
  } catch (error) {
    res.status(401).send('Invalid session');
  }
} 