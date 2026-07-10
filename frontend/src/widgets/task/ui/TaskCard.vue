<script setup lang="ts">
import { NButton, NCheckbox, NIcon, NTag } from 'naive-ui';
import dayjs from 'dayjs';

import { ArchiveIcon, UnarchiveIcon } from '@/shared/ui/icons';
import { type ITask, useEditTaskMutation } from '@/entities/task';

const { task } = defineProps<{
  task?: ITask;
}>();

const { mutate: updateTask } = useEditTaskMutation();
</script>

<template>
  <div
    v-if="task"
    class="task-card"
    @click="
      updateTask({ id: task.id, updatedTask: { is_done: !task.is_done } })
    "
  >
    <div class="task-card__header">
      <NTag
        type="primary"
        round
        size="tiny"
        class="task-card__id"
      >
        {{ 'Задача #' + task.id }}
      </NTag>

      <NTag
        v-if="task.project"
        type="warning"
        round
        size="tiny"
        class="task-card__id"
      >
        {{ task.project.name }}
      </NTag>

      <NButton
        :focusable="false"
        :type="task.is_archived ? 'warning' : 'error'"
        quaternary
        @click.stop="
          updateTask({
            id: task.id,
            updatedTask: { is_archived: !task.is_archived },
          })
        "
      >
        <template #icon>
          <NIcon size="28">
            <ArchiveIcon v-if="!task.is_archived" />
            <UnarchiveIcon v-else />
          </NIcon>
        </template>
      </NButton>
    </div>

    <NCheckbox
      :checked="task.is_done"
      :label="task.title"
      size="large"
      @click.prevent
      class="task-card--no-pointer"
    />

    <div class="task-card__header">
      <p class="task-card__owner">Владелец: {{ task.owner.email }}</p>
      <p class="task-card__owner">
        {{ dayjs(task.created_at).format('DD MMM YYYY HH:mm') }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.task-card {
  border: 1px solid #fff;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  row-gap: 10px;

  width: 300px;

  &__owner {
    font-size: 10px;
    font-style: italic;
  }

  &__id {
    width: fit-content;
  }

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &--no-pointer {
    cursor: default;
  }
}
</style>

<!--{ "id": 1, "project_id": 1, "owner_id": 1, "title": "Task 1 for user 1 project-->
<!--1", "priority": "high", "sort_order": 1000, "is_done": false, "is_archived":-->
<!--false, "created_at": 1783190290000, "updated_at": 1783190290000, "deleted_at":-->
<!--null },-->
