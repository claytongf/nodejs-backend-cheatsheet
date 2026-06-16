// Sign and verify JSON Web Tokens. The secret comes from validated env.
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { env } from '../../config/env.js';

export interface JwtPayload {
  sub: string; // user id
  role: Role;
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
