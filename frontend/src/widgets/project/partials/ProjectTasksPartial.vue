<script setup lang="ts">
import {
  NButton,
  NCheckbox,
  NCollapse,
  NCollapseItem,
  NFlex,
  NIcon,
  NInput,
  NInputGroup,
  NList,
  NListItem,
} from 'naive-ui';
import { ref } from 'vue';

import { ArchiveIcon } from '@/shared/ui/icons';
import {
  type ITask,
  useCreateTaskMutation,
  useEditTaskMutation,
} from '@/entities/task';
import { useAuthStore } from '@/shared/stores';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const newTask = ref('');

const { tasks, project_id } = defineProps<{
  tasks?: ITask[];
  project_id: number;
}>();

const { mutate: createTask } = useCreateTaskMutation();
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

const onCreateTask = () => {
  createTask({ task: { title: newTask.value, project_id } });
  newTask.value = '';
};
</script>

<template>
  <NFlex :style="{ flex: 1 }">
    <NCollapse arrow-placement="right">
      <NCollapseItem :title="`Задачи (${tasks?.length})`">
        <NInputGroup>
          <NInput
            v-model:value="newTask"
            size="tiny"
            placeholder="Новая задача..."
            @keydown.enter="onCreateTask()"
          />
          <NButton
            @click="onCreateTask()"
            size="tiny"
            type="success"
            >+</NButton
          >
        </NInputGroup>

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
