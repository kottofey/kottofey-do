import { RoleModel } from '@/sequelize/models';
import { BaseRepository } from '@/shared';

export class RoleRepository extends BaseRepository<RoleModel> {
  constructor() {
    super(RoleModel);
  }

  // async setRolesToUser(
  //   user: UserModel,
  //   roles: number[],
  //   transaction?: Transaction,
  // ) {
  //   await user.$set('roles', roles, { transaction });
  // }
}
