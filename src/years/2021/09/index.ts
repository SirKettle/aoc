import { reduce, sum } from 'ramda';

interface IPointValue {
  rowIdx: 0;
  colIdx: 0;
  value: number;
}

export const lowPointFactory =
  (grid: number[][]) =>
  ({ rowIdx, colIdx, value }: IPointValue): boolean => {
    const maxColsIdx = grid[rowIdx].length - 1;
    const maxRowsIdx = grid.length - 1;

    // check left
    if (colIdx > 0 && grid[rowIdx][colIdx - 1] <= value) {
      return false;
    }
    // check right
    if (colIdx < maxColsIdx && grid[rowIdx][colIdx + 1] <= value) {
      return false;
    }
    // check up
    if (rowIdx > 0 && grid[rowIdx - 1][colIdx] <= value) {
      return false;
    }
    // check down
    if (rowIdx < maxRowsIdx && grid[rowIdx + 1][colIdx] <= value) {
      return false;
    }

    return true;
  };

export const partOne = (rawInput: string) => {
  const deserialized = rawInput
    .split('\n')
    .filter(Boolean)
    .map((l) => l.split('').map(Number));

  // console.log(rawInput);

  const isLowPoint = lowPointFactory(deserialized);

  return sum(
    deserialized
      .reduce((lowPoints: IPointValue[], row, rowIdx) => {
        return [
          ...lowPoints,
          ...row
            .map((value, colIdx) => ({ rowIdx, colIdx, value }))
            .filter(isLowPoint),
        ];
      }, [])
      .map((d) => d.value + 1)
  );
};

export const partTwo = (rawInput: string) => {
  return 'todo';
};
