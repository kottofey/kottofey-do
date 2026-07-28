<script setup lang="ts">
import { LogoutIcon } from '@/shared/ui/icons';
import { useAuth } from '@/features/auth';
import { AppButton } from '@/shared/ui';

const { iconSize = 24 } = defineProps<{
  iconSize?: number;
}>();
const { logout } = useAuth();
</script>

<template>
  <AppButton
    :icon-size="iconSize"
    @click="
      async () => {
        await logout();
      }
    "
  >
    <template #icon>
      <LogoutIcon />
    </template>
  </AppButton>
</template>
