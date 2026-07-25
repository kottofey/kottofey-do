import { type DataTableColumns, NButton, NFlex, NIcon, NTag } from 'naive-ui';
import { h } from 'vue';
import dayjs from 'dayjs';

import type { IUser } from '@/entities/user';
import { EditIcon, RestoreIcon } from '@/shared/ui/icons';

export const createColumns = ({
  onRowRestore,
  onRowEdit,
}: {
  onRowRestore: (id: number) => Promise<void> | void;
  onRowEdit: (row: IUser | undefined) => Promise<void> | void;
}): DataTableColumns<IUser> => [
  {
    title: 'ID',
    key: 'id',
    align: 'center',
    titleAlign: 'center',
  },
  {
    title: 'Email',
    key: 'email',
    titleAlign: 'center',
  },
  {
    title: 'Роли',
    key: 'roles',
    align: 'center',
    titleAlign: 'center',
    render: (row) =>
      h(
        NFlex,
        {
          justify: 'center',
        },
        {
          default: () =>
            row.roles.map((role) =>
              h(
                NTag,
                {
                  type: 'success',
                },
                {
                  default: () => role.name,
                },
              ),
            ),
        },
      ),
  },
  {
    title: 'Удален',
    key: 'deleted_at',
    titleAlign: 'center',
    align: 'center',
    render: (row) =>
      row.deleted_at ? dayjs(row.deleted_at).format('DD MMM YYYY') : '-',
  },
  {
    title: 'Действия',
    key: 'actions',
    align: 'center',
    titleAlign: 'center',
    render: (row) =>
      row.deleted_at
        ? h(
            NButton,
            {
              onClick: () => onRowRestore(row.id),
              type: 'warning',
            },
            {
              icon: () => h(NIcon, {}, { default: () => h(RestoreIcon) }),
            },
          )
        : h(
            NButton,
            {
              onClick: () => onRowEdit(row),
              type: 'success',
            },
            {
              icon: () => h(NIcon, {}, { default: () => h(EditIcon) }),
            },
          ),
  },
];
