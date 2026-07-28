<script setup lang="ts">
import { MoonIcon, SunIcon } from '@/shared/ui/icons';
import { useSettings } from '@/app/lib';
import { AppButton } from '@/shared/ui';

const { settings } = useSettings();

const { iconSize = 24 } = defineProps<{
  iconSize?: number;
}>();

const changeTheme = () => {
  if (settings.value.theme === 'light') {
    settings.value.theme = 'dark';
  } else if (settings.value.theme === 'dark') {
    settings.value.theme = 'light';
  }
};
</script>

<template>
  <AppButton
    @click="changeTheme"
    :icon-size="iconSize"
  >
    <template #icon>
      <SunIcon v-if="settings.theme === 'light'" />
      <MoonIcon v-else />
    </template>
  </AppButton>
</template>
