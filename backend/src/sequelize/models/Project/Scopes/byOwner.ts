export function byOwner(owner_id: number) {
  return {
    where: { owner_id },
  };
}
