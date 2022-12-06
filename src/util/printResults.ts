import chalk from 'chalk';
import { ISolution } from '../../types';

export const printResults = (
  day: number,
  part: number,
  solution: ISolution
) => {
  const paddedDay = day.toString().padStart(2, '0');
  const answer =
    typeof solution.answer === 'object'
      ? JSON.stringify(solution.answer, null, 2)
      : solution.answer;

  const color = day % 2 === 0 ? 'green' : 'red';
  console.log(
    chalk[color](`Day ${paddedDay} (${part}): `) +
      chalk.hex('FFD700')((answer.toString() + ' ').padEnd(12, '.')) +
      chalk[color](
        ` (${Intl.NumberFormat('en-GB').format(solution.timeMs)} ms) `
      )
  );
};
