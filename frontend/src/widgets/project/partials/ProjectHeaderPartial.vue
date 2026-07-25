<script setup lang="ts">
import { computed } from 'vue';
import { NFlex, NProgress, NTag } from 'naive-ui';

import type { IProject } from '@/entities/project';
import { getDoneAndTotalTasks, getPercentageDone } from '@/widgets/project/lib';

const { project } = defineProps<{ project: IProject }>();

const percentageDone = computed(() => getPercentageDone(project));
const done = computed(() => getDoneAndTotalTasks(project)[0]);
const total = computed(() => getDoneAndTotalTasks(project)[1]);
const progressBarColor = computed(() => {
  if (percentageDone.value >= 30 && percentageDone.value < 70) return 'warning';
  if (percentageDone.value >= 70) return 'success';
  return 'error';
});
</script>

<template>
  <div class="ProjectHeaderPartial">
    <!--  Содержимое проекта  -->
    <NFlex
      class="ProjectHeaderPartial__block"
      justify="space-between"
      :size="[0, 20]"
    >
      <p>
        <span class="ProjectHeaderPartial--opacity">Владелец:</span>
        {{ project.owner?.email ?? '-' }}
      </p>

      <!--  Владелец и метки  -->
      <NFlex>
        <NTag
          round
          type="success"
          :bordered="false"
        >
          Tag 1
        </NTag>
        <NTag
          round
          type="success"
          :bordered="false"
        >
          Tag 2
        </NTag>
      </NFlex>

      <!--  Прогрессбар  -->
      <NFlex
        class="ProjectHeaderPartial__block"
        v-if="project.tasks?.length"
      >
        <p>
          <span class="ProjectHeaderPartial--opacity">Прогресс:</span>
          {{ percentageDone }}%
        </p>
        <NProgress
          type="line"
          :status="progressBarColor"
          :percentage="percentageDone"
          indicator-placement="inside"
          :height="20"
        >
          <span>
            {{ `(${done}/${total})` }}
          </span>
        </NProgress>
      </NFlex>
    </NFlex>
  </div>
</template>

<style scoped lang="scss">
.ProjectHeaderPartial {
  &__block {
    width: 100%;
  }

  &--opacity {
    opacity: 0.5;
  }
}
</style>
