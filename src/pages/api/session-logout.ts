import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { adminAuth } from '@/configs/firebase-admin';

const cors = Cors({
  origin: [
    'http://localhost:3000',
    'https://shopee-nextjs-ecru.vercel.app'
  ],
  credentials: true,
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const isProduction = process.env.NODE_ENV === 'production';
  const sessionCookie = req.cookies.session || '';
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Set-Cookie', `session=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; Secure=${isProduction}; SameSite=${isProduction ? 'Strict' : 'Lax'}; Domain=${isProduction ? '.shopee-nextjs-ecru.vercel.app' : 'localhost'}`);
  try {
    if (sessionCookie) {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
      await adminAuth.revokeRefreshTokens(decodedClaims.sub);
    }
    res.status(200).end();
  } catch (error) {
    res.status(401).send('Logout failed');
  }
}
