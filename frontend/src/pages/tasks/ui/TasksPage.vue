<script setup lang="ts">
import { useTasksQuery } from '@/entities/task';
import { TheLayout } from '@/shared/ui';

const { data: tasks } = useTasksQuery({});
</script>

<template>
  <TheLayout>
    <pre>{{ tasks }}</pre>
  </TheLayout>
</template>

<style scoped></style>
