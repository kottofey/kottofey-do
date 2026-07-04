export function byStatus(status: boolean) {
  return {
    where: { is_done: status },
  };
}
