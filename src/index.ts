import chalk from 'chalk';
import path from 'path';
import { readdir } from 'node:fs/promises';
import argsParser from 'args-parser';
import DotEnv from 'dotenv';

DotEnv.config();

import { filterValidDates } from './util/filterValidDates';
import { printResults } from './util/printResults';
import { timeSolution } from './util/timeSolution';
import { getRawInput } from './util/input';

interface IRunOptions {
  today?: boolean;
  all?: boolean;
  test?: boolean;
  day?: number;
}

const args = argsParser(process.argv);

console.clear();

export const runInput = async (
  inputPath: string,
  func: (input: string) => void,
  year: number,
  day: number,
  part: number
) => {
  try {
    const rawInput = await getRawInput(inputPath, year, day);
    printResults(
      day,
      part,
      timeSolution(() => func(rawInput))
    );
  } catch (err) {
    printResults(day, part, { answer: err.message, timeMs: -1 });
  }
};

const partFunctionNames = ['partOne', 'partTwo'];

const run = async (year: number, args?: IRunOptions) => {
  const directory = path.resolve(__dirname, 'years', year.toString());
  const dirNames = await readdir(directory);
  const filteredDirectories = dirNames.filter(
    filterValidDates(args.today, args.day)
  );

  console.log(
    '\n' +
      chalk.hex('ffdd00').bold(`
-------------------------------
- - - Advent of Code ${year} - - -
-------------------------------\n`)
  );

  for (const dayDirectoryName of filteredDirectories) {
    const file = require(path.resolve(directory, dayDirectoryName));

    let funcIdx = 0;
    while (funcIdx < partFunctionNames.length) {
      const funcName = partFunctionNames[funcIdx];
      if (typeof file[funcName] === 'function') {
        await runInput(
          path.resolve(
            directory,
            dayDirectoryName,
            args.test ? 'testInput' : 'input'
          ),
          file[funcName],
          year,
          Number(dayDirectoryName),
          funcIdx + 1
        );
      }

      funcIdx += 1;
    }
  }
};

const runYears = async () => {
  const yearDirs = await readdir(path.resolve(__dirname, 'years'));
  const years = args.all ? yearDirs.map(Number) : [new Date().getUTCFullYear()];
  for (const year of years) {
    await run(year, args);
    console.log('\n');
  }
};

runYears();
