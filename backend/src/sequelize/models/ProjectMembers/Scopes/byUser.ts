export function byUser(user_id: number) {
  console.log('sciope byUser', user_id);
  return {
    where: { user_id },
  };
}
