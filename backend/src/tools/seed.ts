#!/usr/bin/env -S node --import=tsx

import fs from 'fs/promises';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as process from 'node:process';

import { program } from 'commander';

import { SeederModel } from '@/sequelize/models';
import { SeederModule } from '@/sequelize/types';
import { sequelize } from '@/sequelize';

// Путь к папке с сидерами
const __dirname = dirname(fileURLToPath(import.meta.url));
const SEEDERS_DIR = path.join(__dirname, '..', 'sequelize', 'seeders');

/**
 * Получить список всех сидеров
 */
async function getAllSeeders(): Promise<string[]> {
  const files = await fs.readdir(SEEDERS_DIR);

  return files
    .filter((file: string) => file.endsWith('.ts'))
    .map(file => path.join(SEEDERS_DIR, file))
    .sort();
}

/**
 * Получить список выполненных сидеров из базы
 */
async function getExecutedSeeders(): Promise<string[]> {
  const executed = await SeederModel.findAll({
    attributes: ['filename'],
    raw: true,
  });

  return executed.map(item => item.filename);
}

/**
 * Выполнить сидер
 */
async function executeSeeder(
  filepath: string,
  direction: 'up' | 'down' = 'up',
): Promise<boolean> {
  try {
    const seederModule = (await import(path.join(SEEDERS_DIR, filepath))) as
      { default?: SeederModule } | SeederModule;
    const seeder: SeederModule =
      (seederModule as { default?: SeederModule }).default ??
      (seederModule as SeederModule);

    if (!seeder[direction]) {
      console.log(
        `⚠️  Сидер ${path.basename(filepath)} не содержит метода ${direction}`,
      );
      return false;
    }

    console.log(`🚀 Выполнение ${direction}: ${path.basename(filepath)}`);

    await seeder[direction](sequelize.getQueryInterface());

    if (direction === 'up') {
      await SeederModel.create({
        filename: path.basename(filepath),
      });
    } else {
      await SeederModel.destroy({
        where: { filename: path.basename(filepath) },
      });
    }

    console.log(`✅ Успешно: ${path.basename(filepath)}`);
    return true;
  } catch (error) {
    console.error(
      `❌ Ошибка при выполнении ${path.basename(filepath)}:`,
      (error as Error).message,
    );
    return false;
  }
}

/**
 * Выполнить все новые сидеры
 */
async function runAllNewSeeders() {
  try {
    const allSeeders = await getAllSeeders();
    const executedSeeders = await getExecutedSeeders();

    const newSeeders = allSeeders.filter(
      filepath => !executedSeeders.includes(path.basename(filepath)),
    );

    if (newSeeders.length === 0) {
      console.log('✅ Все сидеры уже выполнены');
      return;
    }

    console.log(`📊 Найдено новых сидеров: ${newSeeders.length.toString()}`);

    for (const filepath of newSeeders) {
      await executeSeeder(path.basename(filepath), 'up');
    }

    console.log(`✅ Выполнено сидеров: ${newSeeders.length.toString()}`);
    await sequelize.close();
  } catch (error) {
    console.error('❌ Ошибка при выполнении:', (error as Error).message);
    return false;
  }
}

/**
 * Выполнить конкретный сидер
 */
async function runSpecificSeeder(
  filename: string,
  direction: 'up' | 'down' = 'up',
) {
  try {
    await fs.access(path.join(SEEDERS_DIR, filename));
  } catch {
    console.error(`❌ Файл ${filename} не найден`);
    return;
  }

  await executeSeeder(filename, direction);
}

/**
 * Откатить все сидеры
 */
async function rollbackAllSeeders() {
  const executedSeeders = await getExecutedSeeders();

  if (executedSeeders.length === 0) {
    console.log('✅ Нет выполненных сидеров для отката');
    return;
  }

  console.log(`🔄 Откат ${executedSeeders.length.toString()} сидеров...`);

  // Откатываем в обратном порядке
  for (let i = executedSeeders.length - 1; i >= 0; i--) {
    const filename = executedSeeders[i];

    try {
      await fs.access(path.join(SEEDERS_DIR, filename));
      await executeSeeder(filename, 'down');
    } catch {
      console.error(`❌ Файл ${filename} не найден`);
    }
  }

  console.log(
    `✅ Откат сидеров, выполнено: ${executedSeeders.length.toString()}`,
  );
}

// Настройка командной строки
program
  .command('up [filename]')
  .description('Выполнить все новые или конкретный сидер')
  .action(async (filename: string) => {
    if (filename) {
      await runSpecificSeeder(filename, 'up');
    } else {
      await runAllNewSeeders();
    }
  });

program
  .command('down [filename]')
  .description('Откатить все или конкретный сидер')
  .action(async (filename: string) => {
    if (filename) {
      await runSpecificSeeder(filename, 'down');
    } else {
      await rollbackAllSeeders();
    }
  });

program
  .command('status [filename]')
  .description('Показать статус всех сидеров')
  .action(async () => {
    const allSeeders = await getAllSeeders();
    const executedSeeders = await getExecutedSeeders();

    console.log('\n📊 Статус сидеров:');
    console.log('='.repeat(60));

    allSeeders.forEach(filepath => {
      const basename = path.basename(filepath);
      const status = executedSeeders.includes(basename)
        ? '✅ Выполнен'
        : '⏳ Ожидает';
      console.log(`${status} - ${basename}`);
    });

    console.log('='.repeat(60));
    console.log(
      `Всего: ${allSeeders.length.toString()}, Выполнено: ${executedSeeders.length.toString()}`,
    );
  });

await program
  .description('Утилита для управления сидерами')
  .parseAsync(process.argv);
