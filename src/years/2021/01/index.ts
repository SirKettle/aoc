import { add, reduce } from 'ramda';

const test = [3, 4, 1, 5, 5, 3, 4, 6, 7];

export const countIncreases = (listOfNumbers: number[]) =>
  listOfNumbers.reduce((acc, item, idx) => {
    if (idx === 0) {
      return acc;
    }
    const prevItem = listOfNumbers[idx - 1];
    return item > prevItem ? acc + 1 : acc;
  }, 0);

export const getSumNumbers = (
  listOfNumbers: number[],
  sumParts = 3,
  idx = 0
) => {
  return reduce(add, 0, listOfNumbers.slice(idx, idx + sumParts));
};

export const countSumIncreases = (listOfNumbers: number[], sumParts = 3) =>
  listOfNumbers.slice(sumParts - 1).reduce((acc, _item, idx) => {
    if (idx === 0) {
      return acc;
    }

    const newSum = getSumNumbers(listOfNumbers, sumParts, idx);
    const prevSum = getSumNumbers(listOfNumbers, sumParts, idx - 1);

    if (newSum > prevSum) {
      return acc + 1;
    }

    return acc;
  }, 0);

export const partOne = (rawInput: string) => {
  return countIncreases(rawInput.split('\n').map(Number));
};

export const partTwo = (rawInput: string) => {
  return countSumIncreases(rawInput.split('\n').map(Number));
};
