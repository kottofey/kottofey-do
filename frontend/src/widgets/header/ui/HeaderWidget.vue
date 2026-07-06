<script setup lang="ts">
// import { useLocalStorage } from '@vueuse/core';
import { NAvatar, NIcon } from 'naive-ui';

import { ChangeThemeButton, LogoutButton } from '@/shared/ui';
import {
  EyeIcon as ViewerIcon,
  PersonIcon as UserIcon,
  ShieldIcon as AdminIcon,
} from '@/shared/ui/icons';
import { useAuthStore } from '@/shared/stores';

export interface ISettings {
  theme?: 'dark' | 'light';
}

// const settings = useLocalStorage<ISettings>('settings', {
//   theme: 'light',
// });

const { user } = useAuthStore();
</script>

<template>
  <header class="page-wrapper">
    <!--    <div-->
    <!--      v-if="user"-->
    <!--      class="header-buttons"-->
    <!--      :style="{-->
    <!--        '&#45;&#45;buttons-shadow-color': settings.theme === 'light' ? '#000' : '#fff',-->
    <!--      }"-->
    <!--    >-->
    <div
      v-if="user"
      class="header-buttons"
    >
      <div class="box">
        <NAvatar
          v-for="role in user.roles"
          :key="role"
          round
          class="avatar"
        >
          <NIcon v-if="role === 'admin'"><AdminIcon /></NIcon>
          <NIcon v-if="role === 'user'"><UserIcon /></NIcon>
          <NIcon v-if="role === 'guest'"> <ViewerIcon /></NIcon>
        </NAvatar>
      </div>
      <p class="box">{{ user.email }}</p>
    </div>

    <div class="box box--wrap">
      <RouterLink
        :to="{ name: 'home.show' }"
        class="link"
      >
        Главная
      </RouterLink>

      <RouterLink
        :to="{ name: 'tasks.show' }"
        class="link"
      >
        Задачи
      </RouterLink>
    </div>

    <!--    <div-->
    <!--      class="header-buttons"-->
    <!--      :style="{-->
    <!--        '&#45;&#45;buttons-shadow-color': settings.theme === 'light' ? '#000' : '#fff',-->
    <!--      }"-->
    <!--    >-->
    <div class="header-buttons">
      <slot name="buttons" />
      <ChangeThemeButton />
      <LogoutButton />
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/app/styles/constants' as *;

.page-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  column-gap: 24px;
  border-bottom: 1px solid $color-accent;
  padding: 10px;
}

.link {
  font-size: 24px;
  line-height: 24px;
  color: $color-accent;
  display: flex;
  align-items: center;
  justify-content: center;

  &--active {
    text-decoration: underline;
  }
}

.header-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 10px;
  row-gap: 10px;
  border: 1px solid $color-accent;
  border-radius: 24px;
  padding: 10px;
  box-shadow: 0 2px 24px -12px var(--buttons-shadow-color);
}

.box {
  display: flex;
  flex-wrap: nowrap;
  column-gap: 10px;
  align-items: center;
  justify-content: center;
  text-align: center;
  user-select: none;

  &--wrap {
    flex-wrap: wrap;
    row-gap: 20px;
  }
}

.avatar {
  background-color: $color-accent;
}
</style>
