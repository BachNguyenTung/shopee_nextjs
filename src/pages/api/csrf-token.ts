import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

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
  const isProduction = process.env.NODE_ENV === 'production';
  const crypto = await import('crypto');
  const csrfToken = crypto.randomBytes(32).toString('hex');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Set-Cookie', `csrfToken=${csrfToken}; Max-Age=3600; Path=/; HttpOnly=false; Secure=${isProduction}; SameSite=${isProduction ? 'Strict' : 'Lax'}; Domain=${isProduction ? '.shopee-nextjs-ecru.vercel.app' : 'localhost'}`);
  res.status(200).json(csrfToken);
}
