import { type MaybeRefOrGetter, toValue } from 'vue';

import type { IMeta } from '@/shared/types';

export default function serializeQuery({
  includes,
  scopes,
  meta,
}: {
  includes?: string[];
  scopes?: MaybeRefOrGetter<unknown>;
  meta?: MaybeRefOrGetter<Partial<IMeta>>;
}): string {
  const q = new URLSearchParams();

  // -----------------------------------------------------------------------------
  // Meta
  // -----------------------------------------------------------------------------

  const pageValue = toValue(meta)?.page;
  const limitValue = toValue(meta)?.limit;

  if (pageValue) {
    q.append('page', pageValue.toString());
  }

  if (limitValue) {
    q.append('limit', limitValue.toString());
  }

  // -----------------------------------------------------------------------------
  // Includes
  // -----------------------------------------------------------------------------

  includes?.forEach((include) => q.append('includes[]', include));

  // -----------------------------------------------------------------------------
  // Scopes
  // -----------------------------------------------------------------------------

  if (Array.isArray(scopes)) {
    // -----------------------------------------------------------------------------
    // Обычный массив
    // -----------------------------------------------------------------------------

    toValue(scopes)?.forEach((scope) => q.append('scopes[]', scope));
  } else if (scopes && typeof scopes === 'object') {
    // -----------------------------------------------------------------------------
    // Объект, простой или с вложенными объектами
    // -----------------------------------------------------------------------------

    Object.entries(toValue(scopes)).forEach(([key, value]) => {
      if (!value) return;

      if (typeof value !== 'object') {
        q.append(`scopes[${key}]`, String(value));
      } else {
        // Рекурсивно обрабатываем вложенные объекты
        Object.entries(value).forEach(([child_key, child_value]) => {
          if (child_value !== null) {
            q.append(`scopes[${key}][${child_key}]`, String(child_value));
          }
        });
      }
    });
  }

  return q.toString();
}
