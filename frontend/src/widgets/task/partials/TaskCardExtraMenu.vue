<script setup lang="ts">
import { type DropdownOption, NDropdown, NIcon } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';

import { DotsVerticalIcon } from '@/shared/ui/icons';
import { useProjectsQuery, useProjectsQueryClient } from '@/entities/project';
import { type ITask, useEditTaskMutation } from '@/entities/task';

const isMenuOpened = defineModel<boolean>('isMenuOpened');

const { task } = defineProps<{ task: ITask }>();

const allProjectsOptions = ref();
const queryClient = useQueryClient();
const { mutate: updateTask } = useEditTaskMutation();
const { data: projects } = useProjectsQuery({});

const menuOptions = computed<DropdownOption[]>(() => [
  {
    label: 'Добавить к проекту',
    key: 'add_to_project',
    children: allProjectsOptions.value,
  },
  {
    label: 'Приоритет',
    key: 'prioity',
    children: [
      {
        label: 'Низкий',
        key: 'low',
        props: {
          onClick: () => {
            updateTask({ id: task.id, updatedTask: { priority: 'low' } });
          },
        },
      },
      {
        label: 'Обычный',
        key: 'normal',
        props: {
          onClick: () => {
            updateTask({ id: task.id, updatedTask: { priority: 'normal' } });
          },
        },
      },
      {
        label: 'Высокий',
        key: 'high',
        props: {
          onClick: () => {
            updateTask({ id: task.id, updatedTask: { priority: 'high' } });
          },
        },
      },
    ],
  },
]);

const onAddToProject = ({
  taskId,
  projectId,
}: {
  taskId: number;
  projectId: number;
}) => {
  updateTask({
    id: taskId,
    updatedTask: { project_id: projectId },
  });
};

watch([isMenuOpened], async () => {
  if (isMenuOpened.value) {
    const newProjects = await useProjectsQueryClient({
      client: queryClient,
      meta: {
        limit: projects.value?.meta.total,
      },
    });

    allProjectsOptions.value = newProjects?.data.map((project) => ({
      label: project.name,
      key: project.id,
      props: {
        onClick: () => {
          onAddToProject({ taskId: task.id, projectId: project.id });
        },
      },
    }));
  }
});
</script>

<template>
  <NFlex>
    <NDropdown
      :options="menuOptions"
      placement="right"
      trigger="click"
      @click.stop
      v-model:show="isMenuOpened"
    >
      <NIcon
        @click.stop
        size="24"
      >
        <DotsVerticalIcon />
      </NIcon>
    </NDropdown>
  </NFlex>
</template>

<style scoped lang="scss"></style>
