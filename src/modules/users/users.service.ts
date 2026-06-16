// Business logic and authorization for users.
import { usersRepository } from './users.repository.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors/index.js';
import type { AuthUser } from '../../shared/types/index.js';
import type { UpdateUserInput } from './users.schemas.js';

export const usersService = {
  list() {
    return usersRepository.findMany();
  },

  async getById(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  },

  async update(id: string, data: UpdateUserInput, actor: AuthUser) {
    // A user may update only themselves, unless they are an admin.
    if (actor.id !== id && actor.role !== 'ADMIN') {
      throw new ForbiddenError();
    }
    await this.getById(id); // ensures it exists -> 404 otherwise
    return usersRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    await usersRepository.delete(id);
  },
};
