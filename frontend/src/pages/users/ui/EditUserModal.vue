<script setup lang="ts">
import {
  type FormInst,
  NButton,
  NCard,
  NFlex,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NSelect,
} from 'naive-ui';
import { computed, ref, toRef, watch } from 'vue';

import { initFormData, createFormRules } from '../config';

import { type IUser, useUserRolesQuery } from '@/entities/user';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const isVisible = defineModel<boolean>('isVisible');
const { user } = defineProps<{
  user?: Partial<IUser>;
}>();

const emit = defineEmits<{
  save: [Partial<IUser>];
}>();

const formRef = ref<FormInst | null>();

const formData = ref<
  Partial<IUser> & { repeatPassword?: string; password?: string }
>({
  ...initFormData,
});

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------

const isEnabled = computed(() => !!isVisible.value);

const rolesOptions = computed(
  () =>
    allRoles.value?.map((role) => ({ label: role.name, value: role.name })) ??
    [],
);

const selectedRoles = computed({
  get: () => formData.value.roles?.map((r) => r.name) ?? [],
  set: (val: string[]) => {
    formData.value.roles = val.map((name) => ({
      name,
    }));
  },
});

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { data: allRoles } = useUserRolesQuery({ isEnabled });

// -----------------------------------------------------------------------------
// Methods
// -----------------------------------------------------------------------------

const onSubmit = async () => {
  try {
    await formRef.value?.validate((errors) => {
      if (!errors) {
        delete formData.value.repeatPassword;

        const { roles, password, id, email } = formData.value;

        if (user) {
          emit('save', {
            roles,
            password,
            id,
            email,
          });
        } else {
          emit('save', formData.value);
        }

        clearForm();
        isVisible.value = false;
      }
    });
  } catch (errors) {
    console.error('Ошибка валидации', JSON.stringify(errors, null, 2));
  }
};

const clearForm = () => {
  formData.value = { ...initFormData };
};

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------
watch([isVisible, () => user], ([currentIsVisible]) => {
  if (currentIsVisible) {
    if (user?.id) {
      formData.value = { ...user };
    } else {
      formData.value = { ...initFormData };
    }
  }
});
</script>

<template>
  <NModal
    class="EditModal"
    v-model:show="isVisible"
    close-on-esc
    @esc="isVisible = false"
  >
    <NCard title="Modal">
      <NForm
        :model="formData"
        :rules="createFormRules(toRef(formData))"
        ref="formRef"
        @submit.prevent
      >
        <NFormItem
          label="Email"
          path="email"
        >
          <NInput v-model:value="formData.email" />
        </NFormItem>

        <NFormItem
          label="Password"
          path="password"
        >
          <NInput v-model:value="formData.password" />
        </NFormItem>

        <NFormItem
          label="Repeat password"
          path="repeatPassword"
        >
          <NInput v-model:value="formData.repeatPassword" />
        </NFormItem>

        <NFormItem
          label="Roles"
          path="roles"
        >
          <NSelect
            v-model:value="selectedRoles"
            :options="rolesOptions"
            multiple
          />
        </NFormItem>
      </NForm>

      <template #footer>
        <NFlex justify="center">
          <NButton
            type="success"
            @click="onSubmit"
          >
            {{ user?.id ? 'Сохранить' : 'Создать' }}
          </NButton>

          <NButton
            @click="isVisible = false"
            color="black"
            textColor="white"
          >
            Отменить
          </NButton>
        </NFlex>
      </template>
    </NCard>
  </NModal>
</template>

<style scoped lang="scss">
.EditModal {
  width: 600px;
}
</style>
