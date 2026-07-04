import { Op } from 'sequelize';

export function byIds(ids: number[]) {
  return {
    where: { id: { [Op.in]: ids } },
  };
}
