<script setup lang="ts">
import { NIcon, NTag } from 'naive-ui';
import { computed } from 'vue';

import {
  ArrowDownIcon,
  CheckMarkIcon,
  DotIcon,
  ExclamationMarkIcon,
} from '@/shared/ui/icons';
import type { ITask } from '@/entities/task';

const priorityColor = computed(() => {
  if (task.priority === 'low') return 'info';
  if (task.priority === 'high') return 'error';
  return 'success';
});

const { task } = defineProps<{ task: ITask }>();
</script>

<template>
  <NTag
    :type="priorityColor"
    round
    :bordered="false"
    size="large"
  >
    <NIcon size="24">
      <ExclamationMarkIcon v-if="!task.is_done && task.priority === 'high'" />
      <ArrowDownIcon v-if="!task.is_done && task.priority === 'low'" />
      <DotIcon v-if="!task.is_done && task.priority === 'normal'" />

      <CheckMarkIcon v-if="task.is_done" />
    </NIcon>
  </NTag>
</template>

<style scoped lang="scss"></style>
