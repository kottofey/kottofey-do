<script setup lang="ts">
import { NCard, NDivider, NFlex, NInput, NLayout, NTag, NText } from 'naive-ui';
import { computed, reactive, ref, watch } from 'vue';

import {
  SideMenuLayoutSider,
  TaskCardFooter,
  TaskCardExtraMenu,
  PriorityTag,
} from '../partials';

import { type ITask, useEditTaskMutation } from '@/entities/task';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { task } = defineProps<{
  task: ITask;
}>();

const { mutate: updateTask } = useEditTaskMutation();

const formData: Partial<ITask> = reactive({
  title: '',
  body: '',
});

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const isSideMenuOpened = ref(false);
const isEditMode = ref(false);

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------

// TODO вынести в пинью isMobile и брать это состояние оттуда
const isMobile = computed(
  () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
);

// -----------------------------------------------------------------------------
// Methods
// -----------------------------------------------------------------------------

const onTaskCardHover = () => {
  if (!isMobile.value && !isEditMode.value) {
    isSideMenuOpened.value = true;
  }
};

const onTaskCardLeave = () => {
  if (!isMobile.value && !isEditMode.value) {
    isSideMenuOpened.value = false;
  }
};

const onTaskDone = (taskId: number) => {
  updateTask({
    id: taskId,
    updatedTask: { is_done: !task.is_done },
  });
};

const onTaskSave = (taskId: number, updatedTask: Partial<ITask>) => {
  updateTask({
    id: taskId,
    updatedTask,
  });
};

const onProjectRemove = (taskId: number) => {
  updateTask({
    id: taskId,
    updatedTask: { project_id: null },
  });
};

// -----------------------------------------------------------------------------
// watch
// -----------------------------------------------------------------------------

watch(isEditMode, () => {
  if (isEditMode.value) {
    formData.title = task.title;
    formData.body = task.body;
  }
});
</script>

<template>
  <NLayout
    has-sider
    @mouseenter="onTaskCardHover"
    @mouseleave="onTaskCardLeave"
  >
    <SideMenuLayoutSider
      :is-mobile="isMobile"
      :is-side-menu-opened="isSideMenuOpened"
      :task="task"
      v-model:is-edit-mode="isEditMode"
      @save="() => onTaskSave(task.id, formData)"
    />

    <NCard
      hoverable
      @click="
        () => {
          if (!isEditMode) {
            onTaskDone(task.id);
          }
        }
      "
    >
      <template #header>
        <NFlex
          justify="space-between"
          align="center"
          :wrap="false"
        >
          <NFlex
            :wrap="false"
            align="center"
          >
            <PriorityTag :task="task" />
            <NText
              :class="task.is_done && 'TaskCard--is-done TaskCard--opacity'"
              v-if="!isEditMode"
            >
              {{ task.title }}
            </NText>
            <NInput
              @click.stop
              v-model:value="formData.title"
              v-else
            />
          </NFlex>

          <NTag
            v-if="task.project_id"
            :type="'warning'"
            round
            :bordered="false"
            size="small"
            closable
            @close="
              () => {
                onProjectRemove(task.id);
              }
            "
          >
            {{ task.project.name }}
          </NTag>
        </NFlex>
      </template>

      <NText
        :class="task.is_done && 'TaskCard--opacity'"
        v-if="!isEditMode"
        style="white-space: pre-line; word-break: break-word"
      >
        {{ task.body }}
      </NText>
      <NInput
        @click.stop
        v-if="isEditMode"
        v-model:value="formData.body"
        type="textarea"
        placeholder="Описание задачи..."
        autosize
      />

      <NDivider />

      <TaskCardFooter :task="task" />
    </NCard>
  </NLayout>
</template>

<style scoped lang="scss">
.TaskCard {
  &__block {
    width: 100%;
  }

  &__footer {
    font-size: 10px;
  }

  &--opacity {
    opacity: 0.3;
  }

  &--is-done {
    text-decoration: line-through;
  }
}
</style>
