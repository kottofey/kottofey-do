// export * from './repositories/UserRepository';
// export * from './usersController';
// export * from './handlers';
// export * from './schemas/userSchema';
// export * from './schemas/partials';

import { UserRepository } from './repositories/UserRepository';
import { UserService } from './services/UserService';

const userRepository = new UserRepository();

export const userService = new UserService(userRepository);
export { usersController } from './usersController';
