import { sum } from 'ramda';

export const partOne = (rawInput: string) => {
  return ('\n' + rawInput)
    .split('\n\n')
    .map((elf) => sum(elf.split('\n').map(Number)))
    .sort((a, b) => (a > b ? -1 : 1))[0];
};

export const partTwo = (rawInput: string) => {
  return sum(
    ('\n' + rawInput)
      .split('\n\n')
      .map((elf) => sum(elf.split('\n').map(Number)))
      .sort((a, b) => (a > b ? -1 : 1))
      .slice(0, 3)
  );
};
