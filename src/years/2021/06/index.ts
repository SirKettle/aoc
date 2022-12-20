import { identity, sum, times } from 'ramda';

const updateTallies = (
  tallies: Record<number, number>
): Record<number, number> => {
  const newTallies = times(identity, 9).reduce(
    (acc: Record<number, number>, idx) => {
      if (idx === 6) {
        return {
          ...acc,
          [idx]: tallies[idx + 1] + tallies[0],
        };
      }
      if (idx === 8) {
        return {
          ...acc,
          [idx]: tallies[0],
        };
      }
      return {
        ...acc,
        [idx]: tallies[idx + 1],
      };
    },
    {}
  );

  return newTallies;
};

const fishTallies = (fs: number[]) =>
  times(identity, 9).reduce((acc: Record<number, number>, idx) => {
    return {
      ...acc,
      [idx]: fs.filter((f) => f === idx).length,
    };
  }, {});

export const partOne = (rawInput: string) => {
  const fish = rawInput
    .trimEnd()
    .split('\n')
    .flatMap((line) => line.split(',').map(Number));

  const days = 80;

  const tallies = times(identity, days).reduce(
    (acc: Record<number, number>) => {
      return updateTallies(acc);
    },
    fishTallies(fish)
  );

  return sum(Object.values(tallies));
};

export const partTwo = (rawInput: string) => {
  const fish = rawInput
    .trimEnd()
    .split('\n')
    .flatMap((line) => line.split(',').map(Number));

  const days = 256;

  const tallies = times(identity, days).reduce(
    (acc: Record<number, number>) => {
      return updateTallies(acc);
    },
    fishTallies(fish)
  );

  return sum(Object.values(tallies));
};
