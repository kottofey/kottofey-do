<script setup lang="ts">
import { computed, ref } from 'vue';
import { NCheckbox, NInput } from 'naive-ui';

import {
  type ITaskScopes,
  useCreateTaskMutation,
  useTasksQuery,
} from '@/entities/task';
import { TheLayout } from '@/shared/ui';
import { TaskCard } from '@/widgets/task';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const onlyArchived = ref(false);
const onlyDeleted = ref(false);
const newTask = ref('');

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------

const taskScopes = computed<ITaskScopes>(() => ({
  'tasks:onlyArchived': onlyArchived.value,
  'tasks:onlyDeleted': onlyDeleted.value,
  'tasks:noArchived': !onlyArchived.value && !onlyDeleted.value,
}));

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { data: tasks } = useTasksQuery({
  scopes: taskScopes,
  includes: ['Owner', 'Project'],
});

const { mutate: createTask } = useCreateTaskMutation();

const onCreateTask = () => {
  createTask({ task: { title: newTask.value } });
  newTask.value = '';
};
</script>

<template>
  <TheLayout>
    <template #buttons-extra>
      <NCheckbox
        :disabled="onlyDeleted"
        v-model:checked="onlyArchived"
        label="Архив"
      />
      <NCheckbox
        v-model:checked="onlyDeleted"
        label="Удаленные"
        @update:checked="
          () => {
            if (onlyArchived) onlyArchived = false;
          }
        "
      />

      <NInput
        v-model:value="newTask"
        @keydown.enter="onCreateTask"
        placeholder="Новая задача..."
      />
    </template>
    <div
      class="wrapper"
      v-if="tasks"
    >
      <TaskCard
        v-for="task of tasks?.data"
        :key="task.id"
        :task="task"
      />
    </div>
  </TheLayout>
</template>

<style scoped>
.wrapper {
  max-width: 1000px;
  width: auto;
  height: auto;
  padding: 10px;
  flex-wrap: wrap;

  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: center;

  margin: 0 auto;

  gap: 10px;
}
</style>
