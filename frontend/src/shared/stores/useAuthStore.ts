import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { type IUser } from '@/entities/user';
const useAuthStore = defineStore('auth', () => {
  // -----------------------------------------------------------------------------
  // State
  // -----------------------------------------------------------------------------

  const userData = ref<Partial<IUser> | null>(null);
  const isLoggingIn = ref<boolean>(false);

  // -----------------------------------------------------------------------------
  // Getters
  // -----------------------------------------------------------------------------

  const user = computed(() => {
    if (userData.value) {
      return userData.value;
    }

    return null;
  });

  const isAdmin = computed(() =>
    user.value?.roles?.some((role) => role.name === 'admin'),
  );

  // -----------------------------------------------------------------------------
  // Actions
  // -----------------------------------------------------------------------------

  function setUser(user: Partial<IUser> | null) {
    userData.value = user;
  }

  function deleteUser() {
    userData.value = null;
  }

  function setLoggingIn(value: boolean) {
    isLoggingIn.value = value;
  }

  return {
    //State
    // isAuthInitialized,

    // Getters
    user,
    // isAuthorized,
    isAdmin,
    // full_name,

    // Actions
    setUser,
    deleteUser,
    setLoggingIn,
    isLoggingIn,
  };
});

export default useAuthStore;
