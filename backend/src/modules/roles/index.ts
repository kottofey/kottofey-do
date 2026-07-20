import { RoleRepository } from './repositories/RoleRepository';
import { RoleService } from './services/RoleService';

const roleRepository = new RoleRepository();
export const roleService = new RoleService(roleRepository);

export { rolesController } from './rolesController';
