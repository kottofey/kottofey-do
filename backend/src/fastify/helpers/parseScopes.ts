import type { ScopeOptions } from 'sequelize';

import type { ScopeHandler } from '@/sequelize/types';
import type { CommonQuery } from '@/fastify/types';

/**
 * Универсальный парсер скоупов.
 * Поддерживает как массив строк (для простых скоупов без аргументов),
 * так и объект (для скоупов с аргументами).
 */
export const parseScopes = (
  scopesRaw: CommonQuery['scopes'],
  handlers: Record<string, ScopeHandler>,
): ScopeOptions[] => {
  if (!scopesRaw) return [];

  const scopes: ScopeOptions[] = [];

  // Обработка объекта: { scopeName: value }
  if (typeof scopesRaw === 'object' && !Array.isArray(scopesRaw)) {
    for (const [key, value] of Object.entries(scopesRaw)) {
      const handler = handlers[key];

      const result = handler(value);
      if (result) {
        if (Array.isArray(result)) {
          scopes.push(...result);
        } else {
          scopes.push(result);
        }
      }
    }
  }

  // Обработка массива: ['scopeName1', 'scopeName2']
  if (Array.isArray(scopesRaw)) {
    for (const key of scopesRaw) {
      const handler = handlers[key];

      const result = handler(true);
      if (result) {
        if (Array.isArray(result)) {
          scopes.push(...result);
        } else {
          scopes.push(result);
        }
      }
    }
  }

  return scopes;
};
