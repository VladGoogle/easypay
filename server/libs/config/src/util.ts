import { existsSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

function getEnvPath(): string | undefined {
  const f1 = basename(resolve(__dirname, '..'));
  const f2 = basename(__dirname);

  let fpath = join(f1, f2, '.env');
  if (existsSync(fpath)) {
    return fpath;
  }

  fpath = '.env';
  if (existsSync(fpath)) {
    return fpath;
  }

  return undefined;
}

export const envFilePath = getEnvPath();
