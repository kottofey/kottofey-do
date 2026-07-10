<script setup lang="ts">
import { useTasksQuery } from '@/entities/task';
import { TheLayout } from '@/shared/ui';
import { TaskCard } from '@/widgets/task';

const { data: tasks } = useTasksQuery({
  includes: ['Owner', 'Project'],
});
</script>

<template>
  <TheLayout>
    <div class="wrapper">
      <TaskCard
        v-for="task of tasks?.data"
        :key="task.id"
        :task="task"
      />
    </div>
    <pre>{{ tasks }}</pre>
  </TheLayout>
</template>

<style scoped>
.wrapper {
  max-width: 900px;
  width: auto;
  height: auto;
  padding: 10px;
  flex-wrap: wrap;

  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: center;

  border: 1px solid #000;
  margin: 0 auto;

  gap: 10px;
}
</style>
