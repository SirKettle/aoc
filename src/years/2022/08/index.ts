import { sum } from 'ramda';

const areAllLessThan = (value: number, others: number[]) =>
  others.every((item) => item < value);

const isTreeVisible = (
  grid: number[][],
  value: number,
  x: number,
  y: number
): boolean => {
  // return true for all outer grid items
  if (x === 0 || y === 0) {
    return true;
  }
  if (y >= grid.length - 1) {
    return true;
  }
  const line = grid[y];
  const lineLength = line.length;
  if (x >= lineLength - 1) {
    return true;
  }

  // is visible from left
  const leftVis = areAllLessThan(value, line.slice(0, x));
  if (leftVis) {
    return true;
  }
  const rightVis = areAllLessThan(value, line.slice(x + 1));
  if (rightVis) {
    return true;
  }
  const colLine = grid.map((l) => l[x]);
  const downVis = areAllLessThan(value, colLine.slice(0, y));
  if (downVis) {
    return true;
  }
  const upVis = areAllLessThan(value, colLine.slice(y + 1));
  if (upVis) {
    return true;
  }

  return false;
};

const score = (value: number, others: number[]) => {
  let score = 0;
  for (const v of others) {
    score += 1;
    if (v >= value) {
      break;
    }
  }
  return score;
};

export const scenicScore = (
  grid: number[][],
  value: number,
  x: number,
  y: number
): number => {
  const line = grid[y];
  const colLine = grid.map((l) => l[x]);

  const left = score(value, line.slice(0, x).reverse());
  const right = score(value, line.slice(x + 1));
  const up = score(value, colLine.slice(0, y).reverse());
  const down = score(value, colLine.slice(y + 1));
  return left * right * up * down;
};

export const partOne = (rawInput: string) => {
  const grid = rawInput
    .split('\n')
    .filter(Boolean)
    .map((l) => l.split('').map(Number));

  return grid.reduce((gridAcc: number, line, y) => {
    return (
      gridAcc + line.filter((tree, x) => isTreeVisible(grid, tree, x, y)).length
    );
  }, 0);
};

export const partTwo = (rawInput: string) => {
  const grid = rawInput
    .split('\n')
    .filter(Boolean)
    .map((l) => l.split('').map(Number));

  return grid
    .reduce((scores: number[], line, y) => {
      return [
        ...scores,
        ...line.flatMap((tree, x) => scenicScore(grid, tree, x, y)),
      ];
    }, [])
    .sort((a, b) => (a > b ? -1 : 1))[0];
};
