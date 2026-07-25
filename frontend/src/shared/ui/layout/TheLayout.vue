<script setup lang="ts">
import { HeaderWidget } from '@/widgets/header';
import { ButtonPanelWidget } from '@/widgets/buttons-panel';
</script>

<template>
  <div class="layout-wrapper">
    <HeaderWidget class="header">
      <template #buttons>
        <slot name="header-buttons" />
      </template>
    </HeaderWidget>

    <ButtonPanelWidget v-if="$slots['buttons-extra']">
      <div class="button-panel">
        <slot name="buttons-extra" />
      </div>
    </ButtonPanelWidget>

    <div class="default">
      <slot name="default" />
    </div>

    <div
      v-if="$slots['footer']"
      class="footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/app/styles/constants' as *;

.layout-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  margin-bottom: 10px;
}

.button-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.default {
  flex: 1;
  overflow-y: auto;
  padding: 0 15px;
}

.footer {
  padding: 15px;
  display: flex;
  justify-content: center;
  border-top: 1px solid $color-accent;
}
</style>
