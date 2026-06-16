// Authentication logic: register, login, and "who am I".
// Reuses the users repository for data access.
import { usersRepository } from '../users/users.repository.js';
import { hashPassword, verifyPassword } from '../../shared/utils/password.js';
import { signToken } from '../../shared/utils/jwt.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../shared/errors/index.js';
import type { RegisterInput, LoginInput } from './auth.schemas.js';
import type { AuthResult } from './auth.types.js';

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await usersRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await hashPassword(input.password);
    const user = await usersRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const token = signToken({ sub: user.id, role: user.role });
    return { token, user };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const record = await usersRepository.findByEmail(input.email);
    // Use the same generic error whether the email or the password is wrong.
    if (!record) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const ok = await verifyPassword(input.password, record.passwordHash);
    if (!ok) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = signToken({ sub: record.id, role: record.role });
    // Strip the password hash before returning.
    const { passwordHash: _passwordHash, ...user } = record;
    return { token, user };
  },

  async me(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  },
};
