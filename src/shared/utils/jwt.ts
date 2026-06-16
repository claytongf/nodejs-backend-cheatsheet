// Sign and verify JSON Web Tokens.
// The secret is read from process.env here; a later phase replaces this with a
// validated environment config that fails fast at startup.
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string; // user id
  role: Role;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
}

export function signToken(payload: JwtPayload): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '1d') as SignOptions['expiresIn'];
  return jwt.sign(payload, getSecret(), { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}
