<script setup lang="ts">
import { NFlex, NPagination } from 'naive-ui';
import { computed, ref } from 'vue';

import { TheLayout } from '@/shared/ui';
import { useProjectsQuery } from '@/entities/project';
import { ProjectCard } from '@/widgets/project';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const page = ref(1);
const limit = ref(5);

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { data: projects } = useProjectsQuery({
  includes: ['Owner', 'Tasks', 'Members'],
  meta: computed(() => ({ page: page.value, limit: limit.value })),
});

// -----------------------------------------------------------------------------
// Methods
// -----------------------------------------------------------------------------

const onPageSizeUpdate = (pgSize: number) => {
  if (projects.value && pgSize > projects.value.meta.total) {
    page.value = 1;
  }
};
</script>

<template>
  <TheLayout>
    <div class="Projects">
      <NFlex
        justify="center"
        :size="20"
        align="center"
        vertical
      >
        <template
          v-for="project in projects?.data"
          :key="project.id"
        >
          <ProjectCard
            :project="project"
            class="Projects__project"
          />
        </template>
      </NFlex>
    </div>

    <template #footer>
      <NPagination
        :item-count="projects?.meta.total"
        v-model:page="page"
        v-model:page-size="limit"
        :page-sizes="[5, 10, 20, 30, 40]"
        show-size-picker
        @update:page-size="onPageSizeUpdate"
      />
    </template>
  </TheLayout>
</template>

<style scoped lang="scss">
.Projects {
  &__project {
    width: 50%;
  }
}
</style>
