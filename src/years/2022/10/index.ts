import { sum, times } from 'ramda';
import { log } from '../../../util/log';

interface ICycleInfo {
  ins: string;
  x: number;
  px?: number;
}

const cycleSignalStrength = (cycles: ICycleInfo[], idx: number) => {
  return (idx + 1) * (cycles[idx - 1]?.x || 0);
};

const calcCycles = (rawInput: string): ICycleInfo[] => {
  let x = 1;
  return rawInput
    .split('\n')
    .filter(Boolean)
    .flatMap((ins, idx) => {
      if (ins === 'noop') {
        return [
          {
            ins,
            px: x,
            x,
          },
        ];
      }
      const xExtra = Number(ins.split(' ')[1]);
      const newX = x + xExtra;
      const ticks = [
        {
          ins: ins + ' a',
          px: x,
          x,
        },
        {
          ins: ins + ' b',
          px: x,
          x: newX,
        },
      ];
      x = newX;
      return ticks;
    });
};

export const partOne = (rawInput: string) => {
  const cycles = calcCycles(rawInput);

  return sum([
    cycleSignalStrength(cycles, 19),
    cycleSignalStrength(cycles, 60 - 1),
    cycleSignalStrength(cycles, 100 - 1),
    cycleSignalStrength(cycles, 140 - 1),
    cycleSignalStrength(cycles, 180 - 1),
    cycleSignalStrength(cycles, 220 - 1),
  ]);
};

export const partTwo = (rawInput: string) => {
  const cycles = calcCycles(rawInput);

  const output = times(
    (lineIdx) =>
      cycles
        .slice(lineIdx * 40, lineIdx * 40 + 40)
        .map((c, idx) => {
          const isLit = [idx - 1, idx, idx + 1].includes(c.px);
          return isLit ? '#' : ' ';
        })
        .join(''),
    6
  ).join('\n');

  log(rawInput);
  log(cycles);
  log(output);

  return 'ZKJFBJFZ';
};
