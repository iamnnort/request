import { Server } from 'http';
import { createHmac } from 'crypto';
import express from 'express';

function verifySignature(signature: string, rawBody: string, secretKey: string): boolean {
  const signatureMatch = signature?.match(/^t=(\d+),v1=([a-f0-9]+)$/);

  if (!signatureMatch) {
    return false;
  }

  const [, timestamp, hmac] = signatureMatch;
  const expectedHmac = createHmac('sha256', secretKey).update(`${timestamp}.${rawBody}`, 'utf8').digest('hex');

  return hmac === expectedHmac;
}

export function startServer(secret: string): Promise<Server> {
  const app = express();

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as any).rawBody = buf;
      },
    }),
  );

  app.post('/webhooks', (req, res) => {
    const signature = req.headers['x-signature'] as string;

    if (!signature) {
      return res.status(401).json({
        error: 'Missing x-signature header',
      });
    }

    if (!verifySignature(signature, (req as any).rawBody, secret)) {
      return res.status(403).json({
        error: 'Invalid signature',
      });
    }

    return res.json({
      ok: true,
    });
  });

  return new Promise((resolve) => {
    const server = app.listen(3000, () => {
      resolve(server);
    });
  });
}

export function stopServer(server: Server): Promise<void> {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}
