import { UserRepository } from './repositories/UserRepository';
import { UserService } from './services/UserService';

const userRepository = new UserRepository();
export const userService = new UserService(userRepository);

export { usersController } from './usersController';
