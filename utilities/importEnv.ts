import path from 'node:path';

import { blue, bold } from 'colors/safe';
import { config, parse } from 'dotenv';
import fs from 'fs-extra';

config({
  path: path.resolve('.env'),
});

const basicValues = parse(fs.readFileSync(path.resolve('.example.env')));

Object.keys({ ...basicValues }).forEach((key) => {
  if (!process.env[key]) {
    console.error(`${blue(bold(key))} env variable not set`);

    process.exit(1);
  }
});
