export function noArchived() {
  return {
    where: { is_archived: false },
  };
}
