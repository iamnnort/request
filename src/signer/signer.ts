import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js';
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

    const signature = bytesToHex(hmac(sha256, utf8ToBytes(this.config.secretKey), utf8ToBytes(payload)));

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
