import { createHmac } from 'crypto';
import { SignerConfig } from './signer.types';

export class Signer {
  private config: Required<SignerConfig>;

  constructor(config: Partial<SignerConfig> = {}) {
    this.config = {
      secretKey: '',
      header: 'x-signature',
      ...config,
    };
  }

  private sign(rawBody: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = `${timestamp}.${rawBody}`;

    const signature = createHmac('sha256', this.config.secretKey).update(payload, 'utf8').digest('hex');

    return `t=${timestamp},v1=${signature}`;
  }

  getConfig(body: string) {
    if (!this.config.secretKey) {
      return {};
    }

    return {
      [this.config.header]: this.sign(body ? JSON.stringify(body) : ''),
    };
  }
}
