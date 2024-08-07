import { JwtPayload } from '../models/jwt-payload.interface';
import { sign, verify, base64urlDecode, base64urlEncode } from './jwt.utils'; // Substitua 'your-module' pelo caminho correto do seu módulo

describe('JWT Utility Functions', () => {
  describe('base64urlEncode', () => {
    it('should correctly encode a string to base64url format', () => {
      const input = 'Hello, World!';
      const expectedOutput = 'SGVsbG8sIFdvcmxkIQ';
      expect(base64urlEncode(input)).toBe(expectedOutput);
    });

    it('should correctly encode a buffer to base64url format', () => {
      const input = Buffer.from('Hello, World!');
      const expectedOutput = 'SGVsbG8sIFdvcmxkIQ';
      expect(base64urlEncode(input)).toBe(expectedOutput);
    });
  });

  describe('base64urlDecode', () => {
    it('should correctly decode a base64url string', () => {
      const input = 'SGVsbG8sIFdvcmxkIQ';
      const expectedOutput = 'Hello, World!';
      expect(base64urlDecode(input)).toBe(expectedOutput);
    });
  });

  describe('sign', () => {
    it('should correctly sign a payload', () => {
      const payload: JwtPayload = { email: 'email@example.com' };
      const secret = 'mySecret';
      const token = sign(payload, secret);

      const [headerEncoded, payloadEncoded, signature] = token.split('.');
      expect(headerEncoded).toBe(
        base64urlEncode(
          JSON.stringify({
            alg: 'HS256',
            typ: 'JWT',
          }),
        ),
      );
      expect(payloadEncoded).toBe(base64urlEncode(JSON.stringify(payload)));
      expect(signature).toBeTruthy();
    });
  });

  describe('verify', () => {
    it('should return the payload if the token is valid', () => {
      const payload: JwtPayload = { email: 'email@example.com' };
      const secret = 'mySecret';
      const token = sign(payload, secret);

      const decodedPayload = verify(token, secret);
      expect(decodedPayload).toEqual(payload);
    });

    it('should return null if the token signature is invalid', () => {
      const payload: JwtPayload = { email: 'email@example.com' };
      const secret = 'mySecret';
      const token = sign(payload, secret);

      // Modify the token to simulate an invalid signature
      const invalidToken = token.replace(/\.[^.]+$/, '.invalidSignature');

      const decodedPayload = verify(invalidToken, secret);
      expect(decodedPayload).toBeNull();
    });

    it('should return null if the token is malformed', () => {
      const secret = 'mySecret';
      const malformedToken = 'malformed.token';

      const decodedPayload = verify(malformedToken, secret);
      expect(decodedPayload).toBeNull();
    });
  });
});
