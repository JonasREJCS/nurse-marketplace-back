import * as crypto from 'crypto';
import { JwtPayload } from '../models/jwt-payload.interface';

const header = {
  alg: 'HS256',
  typ: 'JWT',
};

function base64urlEncode(input: string | Buffer) {
  return Buffer.from(input).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(input: string) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(input, 'base64').toString();
}

export function sign(payload: JwtPayload, secret: string) {
  const headerEncoded = base64urlEncode(JSON.stringify(header));
  const payloadEncoded = base64urlEncode(JSON.stringify(payload));
  
  const signature = crypto.createHmac('sha256', secret)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

export function verify(token: string, secret: string): JwtPayload | null {
  const [headerEncoded, payloadEncoded, signature] = token.split('.');
  
  const expectedSignature = crypto.createHmac('sha256', secret)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  if (expectedSignature !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(base64urlDecode(payloadEncoded));
    return payload;
  } catch (error) {
    return null;
  }
}
