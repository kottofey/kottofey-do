<script setup lang="ts">
import { NCard, NDivider, NFlex, NLayout, NTag, NText } from 'naive-ui';
import { computed, ref } from 'vue';

import {
  SideMenuLayoutSider,
  TaskCardFooter,
  TaskCardHeaderMenu,
  PriorityTag,
} from '../partials';

import { type ITask, useEditTaskMutation } from '@/entities/task';

const { task } = defineProps<{
  task: ITask;
}>();

const isMenuOpened = ref(false);
const isSideMenuOpened = ref(false);

const { mutate: updateTask } = useEditTaskMutation();

const onTaskDone = (taskId: number) => {
  updateTask({
    id: taskId,
    updatedTask: { is_done: !task.is_done },
  });
};

// TODO вынести в пинью isMobile и брать это состояние оттуда
const isMobile = computed(
  () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
);
</script>

<template>
  <NLayout
    has-sider
    @mouseenter="
      () => {
        if (!isMobile) isSideMenuOpened = true;
      }
    "
    @mouseleave="
      () => {
        if (!isMobile) isSideMenuOpened = false;
      }
    "
  >
    <SideMenuLayoutSider
      :is-mobile="isMobile"
      :is-side-menu-opened="isSideMenuOpened"
      :task="task"
    />

    <NCard
      hoverable
      @click="
        () => {
          onTaskDone(task.id);
        }
      "
    >
      <template #header>
        <NFlex>
          <PriorityTag :task="task" />
          <NText :class="task.is_done && 'TaskCard--is-done TaskCard--opacity'">
            {{ task.title }}
          </NText>
        </NFlex>
      </template>

      <template #header-extra>
        <TaskCardHeaderMenu
          :is-menu-opened="isMenuOpened"
          :task="task"
        />
      </template>

      <NFlex justify="space-between">
        <NTag
          v-if="task.project_id"
          :type="'warning'"
          round
          :bordered="false"
          size="small"
        >
          {{ task.project.name }}
        </NTag>
      </NFlex>

      <NDivider />

      <NText :class="task.is_done && 'TaskCard--opacity'">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium
        deleniti earum impedit incidunt itaque quasi rerum similique sit,
        suscipit veniam. Architecto assumenda delectus earum, illum magnam
        possimus unde? Praesentium, rem!)
      </NText>

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
