import { type Ref } from 'vue';
import type { FormRules } from 'naive-ui';

import type { IUser } from '@/entities/user';

export const createFormRules = (
  formData: Ref<Partial<IUser> & { repeatPassword?: string }>,
): FormRules => ({
  // surname: {
  //   required: true,
  //   message: 'Введите фамилию',
  // },
  // firstname: {
  //   required: true,
  //   message: 'Введите имя',
  // },
  email: {
    required: true,
    type: 'email',
    message: 'Неверный формат почты',
  },
  password: [
    {
      required: !formData.value.id,
      message: 'Введите пароль',
    },
    {
      message: 'Минимум 5 знаков',
      validator(_rule, val) {
        const password = val as string | undefined;

        if (password) {
          return password.length >= 5;
        }
      },
    },
    {
      message: 'Пароли не совпадают',
      validator(_rule, val) {
        if (formData.value.password && formData.value.repeatPassword) {
          return val === formData.value.repeatPassword;
        }
        return true;
      },
    },
  ],
  repeatPassword: {
    required: !!formData.value.password,
    message: 'Введите пароль',
  },
  roles: {
    required: true,
    message: 'Нужно выбрать роль',
    validator(_rule, rolesRaw) {
      const roles = rolesRaw as object[];
      return roles.length >= 1;
    },
  },
});
