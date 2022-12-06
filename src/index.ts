import chalk from 'chalk';
import path from 'path';
import { readdir } from 'node:fs/promises';
import argsParser from 'args-parser';
import { filterValidDates } from './util/filterValidDates';
import { printResults } from './util/printResults';
import { readFileText } from './util/readFileText';
import { timeSolution } from './util/timeSolution';

interface IRunOptions {
  today?: boolean;
  all?: boolean;
  test?: boolean;
}

const args = argsParser(process.argv);

console.clear();

export const runInput = async (
  inputPath: string,
  func: (input: string) => void,
  day: number,
  part: number
) => {
  const rawInput = await readFileText(inputPath);
  printResults(
    day,
    part,
    timeSolution(() => func(rawInput))
  );
};

const partFunctionNames = ['partOne', 'partTwo'];

const run = async (year: number, args?: IRunOptions) => {
  const options: IRunOptions = {
    today: false,
    all: false,
    test: false,
    ...args,
  };
  const directory = path.resolve(__dirname, 'years', year.toString());
  const fileNames = await readdir(directory);
  const filteredFiles = fileNames.filter(filterValidDates(options.today));

  console.log(
    '\n' +
      chalk.hex('ffdd00').bold(`
-------------------------------
- - - Advent of Code ${year} - - -
-------------------------------\n`)
  );

  for (const fileName of filteredFiles) {
    const file = require(path.resolve(directory, fileName));

    let funcIdx = 0;
    while (funcIdx < partFunctionNames.length) {
      const funcName = partFunctionNames[funcIdx];
      if (typeof file[funcName] === 'function') {
        await runInput(
          path.resolve(
            directory,
            fileName,
            options.test ? 'testInput' : 'input'
          ),
          file[funcName],
          Number(fileName),
          funcIdx + 1
          // `Day ${fileName} - ${funcIdx + 1}`
        );
      }

      funcIdx += 1;
    }
  }
};

const runYears = async () => {
  const argsOptions: IRunOptions = {
    today: args.today === true,
    all: args.all === true,
    test: args.test === true,
  };

  const yearDirs = await readdir(path.resolve(__dirname, 'years'));
  const years = argsOptions.all
    ? yearDirs.map(Number)
    : [new Date().getUTCFullYear()];

  for (const year of years) {
    await run(year, argsOptions);
    console.log('\n');
  }
};

runYears();
