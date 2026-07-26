<script setup lang="ts">
import { NFlex, NText } from 'naive-ui';
import dayjs from 'dayjs';

import type { ITask } from '@/entities/task';

const { task } = defineProps<{ task: ITask }>();
</script>

<template>
  <NFlex
    justify="space-between"
    class="TaskCard__footer"
  >
    <NText depth="3">
      <span class="TaskCard--opacity">Создано:</span>
      {{ dayjs(task.created_at).format('DD MMM YYYY') }}
    </NText>

    <NText depth="3">{{ task.owner?.email }}</NText>
    <NText depth="3">
      <span class="TaskCard--opacity">Обновлено:</span>
      {{ dayjs(task.updated_at).format('DD MMM YYYY') }}
    </NText>
  </NFlex>
</template>

<style scoped lang="scss"></style>
