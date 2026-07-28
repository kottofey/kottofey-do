<script setup lang="ts">
import { computed, ref } from 'vue';
import { NCheckbox, NDataTable } from 'naive-ui';

import { createColumns } from '../config';

import EditUserModal from './EditUserModal.vue';

import { AddIcon } from '@/shared/ui/icons';
import { AppButton, TheLayout } from '@/shared/ui';
import {
  type ICreateUserDto,
  type IUpdateUserDto,
  type IUserScopes,
  useCreateUserMutation,
  useEditUserMutation,
  useUsersQuery,
} from '@/entities/user';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const deletedOnly = ref(false);
const isModalVisible = ref(false);
const userToEdit = ref<(ICreateUserDto & { id?: number }) | undefined>(
  undefined,
);

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------

const userScopes = computed<IUserScopes>(() => ({
  'users:deletedOnly': deletedOnly.value,
}));

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const { data: users } = useUsersQuery({
  scopes: userScopes,
  includes: [],
});

const { mutate: editUser } = useEditUserMutation();
const { mutate: createUser } = useCreateUserMutation();

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

const onUserRestore = (id: number) => {
  console.log('restore', id);
};

const onOpenModal = (user: (ICreateUserDto & { id?: number }) | undefined) => {
  userToEdit.value = user ? user : undefined;
  isModalVisible.value = true;
};

const onSaveUser = (
  user: ICreateUserDto & IUpdateUserDto & { id?: number },
) => {
  if (user.id) {
    const { id, ...updatedUser } = user;
    editUser({ id, updatedUser });
  } else {
    createUser({ user });
  }

  userToEdit.value = undefined;
  isModalVisible.value = true;
};
</script>

<template>
  <TheLayout>
    <template #buttons-extra>
      <AppButton @click="onOpenModal">
        <template #icon>
          <AddIcon />
        </template>
        Новый юзер
      </AppButton>
      <NCheckbox
        v-model:checked="deletedOnly"
        label="Удаленные"
      />
    </template>

    <NDataTable
      :data="users?.data"
      :columns="
        createColumns({ onRowRestore: onUserRestore, onRowEdit: onOpenModal })
      "
      :single-line="false"
    />

    <EditUserModal
      v-model:is-visible="isModalVisible"
      :user="userToEdit"
      @save="(user) => onSaveUser(user)"
    />
  </TheLayout>
</template>

<style scoped>
.wrapper {
  max-width: 1000px;
  width: auto;
  height: auto;
  padding: 10px;
  flex-wrap: wrap;

  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: center;

  margin: 0 auto;

  gap: 10px;
}
</style>
