<script setup lang="ts">
import { NCollapse, NCollapseItem, NFlex } from 'naive-ui';

import type { IUser } from '@/entities/user';

defineProps<{ members?: Partial<IUser>[] }>();
</script>

<template>
  <NFlex :style="{ flex: 1 }">
    <NCollapse arrow-placement="right">
      <NCollapseItem :disabled="!members?.length">
        <template #header> Участники проекта </template>

        <p
          v-for="member in members"
          :key="member.id"
        >
          {{ member.email }}
        </p>
      </NCollapseItem>
    </NCollapse>
  </NFlex>
</template>
