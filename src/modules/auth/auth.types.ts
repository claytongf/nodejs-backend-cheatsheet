import type { PublicUser } from '../users/users.types.js';

export interface AuthResult {
  token: string;
  user: PublicUser;
}
