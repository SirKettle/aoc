import path from 'path';
import { timeSolution } from '../../util/timeSolution';
import { printResults } from '../../util/printResults';

const partOne = () => `TODO`;

const partTwo = () => `TODO`;

export default () => {
  printResults(path.basename(__filename), [
    // part1
    timeSolution(() => partOne()),
    // part2
    timeSolution(() => partTwo()),
  ]);
};
