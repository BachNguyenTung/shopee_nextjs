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
  const { idToken, csrfToken } = req.body;
  const csrfTokenCookie = req.cookies.csrfToken;
  if (!csrfTokenCookie || csrfTokenCookie !== csrfToken) {
    return res.status(401).send('CSRF token mismatch');
  }
  try {
    const decodedIdToken = await adminAuth.verifyIdToken(idToken);
    if (new Date().getTime() / 1000 - decodedIdToken.auth_time >= 5 * 60) {
      return res.status(401).send('Recent sign in required!');
    }
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    res.setHeader('Set-Cookie', `session=${sessionCookie}; Max-Age=${expiresIn / 1000}; Path=/; HttpOnly; Secure=${isProduction}; SameSite=${isProduction ? 'Strict' : 'Lax'}`);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    res.status(401).send('Authentication failed');
  }
}
