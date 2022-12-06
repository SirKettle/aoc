import { sum, uniq } from 'ramda';

const charValue = (char: string) =>
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(char) + 1;

export const partOne = (rawInput: string) => {
  return sum(
    rawInput
      .split('\n')
      .map((l) => [l.slice(0, (l.length + 1) / 2), l.slice((l.length + 1) / 2)])
      .flatMap((rucksack) => {
        return uniq(
          rucksack[0].split('').filter((item) => rucksack[1].includes(item))
        );
      })
      .map(charValue)
  );
};

export const partTwo = (rawInput: string) => {
  return sum(
    rawInput
      .split('\n')
      .reduce((acc: string[][], item, idx) => {
        const groupIdx = Math.floor(idx / 3);
        acc[groupIdx] = [...(acc[groupIdx] || []), item];
        return acc;
      }, [])
      .flatMap((group) => {
        return uniq(
          group[0]
            .split('')
            .filter((char) => group.slice(1).every((l) => l.includes(char)))
        );
      })
      .map(charValue)
  );
};
