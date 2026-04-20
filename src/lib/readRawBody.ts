import type { NextApiRequest } from 'next';

export function readRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    req.on('data', (chunk: Buffer | string) => {
      if (typeof chunk === 'string') {
        chunks.push(new TextEncoder().encode(chunk));
        return;
      }
      chunks.push(Uint8Array.from(chunk));
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
