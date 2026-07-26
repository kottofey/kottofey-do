<script setup lang="ts">
import { computed, ref } from 'vue';
import { NCheckbox, NInput, NPagination } from 'naive-ui';

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

const page = ref(1);
const limit = ref(5);

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
  meta: computed(() => ({ page: page.value, limit: limit.value })),
});

const { mutate: createTask } = useCreateTaskMutation();

const onCreateTask = () => {
  createTask({ task: { title: newTask.value } });
  newTask.value = '';
};

const onPageSizeUpdate = (pgSize: number) => {
  if (tasks.value && pgSize > tasks.value.meta.total) {
    page.value = 1;
  }
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

    <template #footer>
      <NPagination
        :item-count="tasks?.meta.total"
        v-model:page="page"
        v-model:page-size="limit"
        :page-sizes="[5, 10, 20, 30, 40]"
        show-size-picker
        :page-slot="5"
        @update:page-size="onPageSizeUpdate"
      />
    </template>
  </TheLayout>
</template>

<style scoped>
.wrapper {
  max-width: 600px;
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
