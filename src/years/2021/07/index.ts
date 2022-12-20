import { identity, sum, times } from 'ramda';

const basicFuelCost = (from: number, to: number): number => {
  return Math.abs(to - from);
};

export const partOne = (rawInput: string) => {
  const subs = rawInput.trimEnd().split(',').map(Number);
  const min = Math.min(...subs);
  const max = Math.max(...subs);

  const fuels = times((i) => i + min, max - min).map((x) => {
    return subs.reduce((f, s) => {
      return f + basicFuelCost(x, s);
    }, 0);
  });

  return Math.min(...fuels);
};

const crabFuelCost = (from: number, to: number): number => {
  const dist = Math.abs(to - from);
  return times(identity, dist).reduce((fuel, idx) => {
    return fuel + idx + 1;
  }, 0);
};

export const partTwo = (rawInput: string) => {
  const subs = rawInput.trimEnd().split(',').map(Number);
  const min = Math.min(...subs);
  const max = Math.max(...subs);

  const fuelCosts = times((i) => i + min, max - min).reduce(
    (acc: Record<number, number>, x) => {
      return {
        ...acc,
        [x]: crabFuelCost(0, x),
      };
    },
    {}
  );

  const fuels = times((i) => i + min, max - min).reduce(
    (acc: Record<number, number>, x) => {
      return {
        ...acc,
        [x]: subs.reduce((f, s) => {
          const dist = Math.abs(s - (x + 1));
          return f + (fuelCosts[dist] || 0);
        }, 0),
      };
    },
    {}
  );

  return Math.min(...Object.values(fuels));
};
