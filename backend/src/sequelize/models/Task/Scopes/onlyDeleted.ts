import { Op } from 'sequelize';

export function onlyDeleted() {
  return {
    paranoid: false,
    where: { deleted_at: { [Op.ne]: null } },
  };
}
