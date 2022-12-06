import { uniq } from 'ramda';

const allUniq = (arr: string[]) => arr.length === uniq(arr).length;

export const nextCharIdxAfterUniqSlice = (rawInput: string, uniqChars = 1) => {
  const test = rawInput.split('\n')[0];
  const chars = test.split('');
  let nextCharIdx = 0;
  let idx = 0;
  while (idx < chars.length - uniqChars - 1) {
    const slice = chars.slice(idx, idx + uniqChars);

    if (allUniq(slice)) {
      nextCharIdx = idx + uniqChars;
      break;
    }

    idx += 1;
  }
  return nextCharIdx;
};

export const partOne = (rawInput: string) => {
  return nextCharIdxAfterUniqSlice(rawInput, 4);
};

export const partTwo = (rawInput: string) => {
  return nextCharIdxAfterUniqSlice(rawInput, 14);
};
