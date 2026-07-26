<script setup lang="ts">
import {
  NButton,
  NFlex,
  NIcon,
  NLayoutSider,
  NPopconfirm,
  NText,
} from 'naive-ui';

import {
  ArchiveIcon,
  EditIcon,
  JollyRodgerIcon,
  RestoreIcon,
  TrashIcon,
  UnarchiveIcon,
} from '@/shared/ui/icons';
import {
  type ITask,
  useDeleteTaskMutation,
  useEditTaskMutation,
  useRestoreTaskMutation,
} from '@/entities/task';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const { mutate: deleteTask } = useDeleteTaskMutation();
const { mutate: restoreTask } = useRestoreTaskMutation();
const { mutate: updateTask } = useEditTaskMutation();

const { task, isMobile } = defineProps<{
  task: ITask;
  isMobile: boolean;
}>();

const isSideMenuOpened = defineModel<boolean>('isSideMenuOpened');

const onArchiveTask = (taskId: number) => {
  updateTask({
    id: taskId,
    updatedTask: { is_archived: !task.is_archived },
  });
};
</script>

<template>
  <NLayoutSider
    bordered
    collapse-mode="width"
    :collapsed-width="0"
    :width="64"
    :collapsed="!isSideMenuOpened"
    :showTrigger="isMobile && 'bar'"
    @update-collapsed="
      () => {
        isSideMenuOpened = !isSideMenuOpened;
      }
    "
  >
    <NFlex
      vertical
      align="center"
    >
      <NText
        depth="3"
        italic
        code
      >
        #{{ task.id }}
      </NText>

      <!--  Редактировать  -->
      <NButton
        v-if="!task.deleted_at"
        type="success"
      >
        <NIcon size="20">
          <EditIcon />
        </NIcon>
      </NButton>

      <!--  Архивировать / разархивировать  -->
      <NButton
        v-if="!task.deleted_at"
        type="warning"
        @click="onArchiveTask(task.id)"
      >
        <NIcon size="20">
          <ArchiveIcon v-if="!task.is_archived" />
          <UnarchiveIcon v-else />
        </NIcon>
      </NButton>

      <!--  Удалить  -->
      <NButton
        v-if="!task.deleted_at"
        type="error"
        @click="deleteTask({ id: task.id })"
      >
        <NIcon size="20">
          <TrashIcon />
        </NIcon>
      </NButton>

      <!--  Восстановить  -->
      <NButton
        v-if="task.deleted_at"
        type="error"
        @click="restoreTask({ id: task.id })"
      >
        <NIcon size="20">
          <RestoreIcon />
        </NIcon>
      </NButton>

      <!--  Удалить навсегда  -->
      <NPopconfirm
        @positive-click="deleteTask({ id: task.id, force: true })"
        v-if="task.deleted_at"
        positive-text="Да"
      >
        <template #trigger>
          <NButton
            color="black"
            textColor="white"
          >
            <NIcon size="20">
              <JollyRodgerIcon />
            </NIcon>
          </NButton>
        </template>
        <p>Удалить навсегда?</p>
      </NPopconfirm>
    </NFlex>
  </NLayoutSider>
</template>

<style scoped lang="scss"></style>
