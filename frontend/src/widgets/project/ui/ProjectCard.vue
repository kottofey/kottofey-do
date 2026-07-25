<script setup lang="ts">
import { NCard, NDivider, NFlex, NH2, NTag } from 'naive-ui';

import type { IProject } from '@/entities/project';
import {
  ProjectHeaderPartial,
  ProjectTasksPartial,
  ProjectMembersPartial,
} from '@/widgets/project/partials';
import { VDivider } from '@/shared/ui';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

defineProps<{ project: IProject }>();
</script>

<template>
  <NCard
    hoverable
    class="ProjectCard"
  >
    <!--  Заголовок и статус  -->
    <template #header>
      <NH2>(id: {{ project.id }}) {{ project.name }}</NH2>
    </template>

    <template #header-extra>
      <NTag
        :type="project.is_archived ? 'warning' : 'success'"
        round
        :bordered="false"
        :color="{
          textColor: 'white',
          color: '#278c57',
        }"
      >
        {{ project.is_archived ? 'В архиве' : 'Активный' }}
      </NTag>
    </template>

    <!--  Содержимое проекта (Хэдер)  -->
    <ProjectHeaderPartial :project="project" />

    <NDivider />

    <NFlex justify="space-between">
      <ProjectTasksPartial :tasks="project.tasks" />

      <VDivider />

      <ProjectMembersPartial :members="project.members" />
    </NFlex>
  </NCard>
</template>

<style scoped lang="scss">
.ProjectCard {
  &__block {
    width: 100%;
  }

  &--opacity {
    opacity: 0.5;
  }
}
</style>
