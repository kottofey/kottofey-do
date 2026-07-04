#!/usr/bin/env -S node --import=tsx

import { migrator } from '@/lib/umzug';

await migrator.runAsCLI();
