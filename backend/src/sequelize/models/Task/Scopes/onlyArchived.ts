export function onlyArchived() {
  return {
    where: { is_archived: true },
  };
}
