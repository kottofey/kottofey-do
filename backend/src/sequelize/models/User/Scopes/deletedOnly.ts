import { Op } from 'sequelize';

export function deletedOnly() {
  console.log('user deleted only');
  return {
    where: { deleted_at: { [Op.ne]: null } },
    paranoid: false,
  };
}
