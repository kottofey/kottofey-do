<script setup lang="ts">
import {
  NCheckbox,
  NCollapse,
  NCollapseItem,
  NFlex,
  NIcon,
  NList,
  NListItem,
} from 'naive-ui';

import { ArchiveIcon } from '@/shared/ui/icons';
import { type ITask, useEditTaskMutation } from '@/entities/task';
import { useAuthStore } from '@/shared/stores';

defineProps<{ tasks?: ITask[] }>();

const { mutate: updateTask } = useEditTaskMutation();
const { user } = useAuthStore();

const onTaskUpdate = (task: ITask) => {
  if (user?.id === task.owner_id) {
    updateTask({
      id: task.id,
      updatedTask: {
        is_done: !task.is_done,
      },
    });
  }
};
</script>

<template>
  <NFlex :style="{ flex: 1 }">
    <NCollapse arrow-placement="right">
      <NCollapseItem
        title="Задачи"
        :disabled="!tasks?.length"
      >
        <NList
          v-for="task in tasks"
          :key="task.id"
          hoverable
          clickable
        >
          <NListItem @click="onTaskUpdate(task)">
            <template #prefix>
              <div
                :style="{
                  display: 'flex',
                  columnGap: '5px',
                }"
              >
                <NIcon size="16">
                  <ArchiveIcon v-if="task.is_archived" />
                </NIcon>
                <NCheckbox
                  :checked="task.is_done"
                  :disabled="user?.id !== task.owner_id"
                />
              </div>
            </template>

            <template #default>
              <p class="no-select">{{ task.title }}</p>
            </template>
          </NListItem>
        </NList>
      </NCollapseItem>
    </NCollapse>
  </NFlex>
</template>

<style lang="scss" scoped>
.no-select {
  user-select: none;
}
</style>
