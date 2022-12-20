import { last, sum } from 'ramda';
import { log } from '../../../util/log';

type TOpeningChar = '[' | '(' | '{' | '<';
type TClosingChar = ')' | ']' | '}' | '>';

const pairs: Record<TOpeningChar, TClosingChar> = {
  '[': ']',
  '(': ')',
  '{': '}',
  '<': '>',
};

const points: Record<TClosingChar, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const autoCompletePoints: Record<TClosingChar, number> = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const isOpeningChar = (char: string): char is TOpeningChar => {
  return char?.length === 1 && '[({<'.includes(char);
};
const isClosingChar = (char: string): char is TClosingChar => {
  return char?.length === 1 && '])}>'.includes(char);
};

const validateLine = (line: string): TClosingChar | null => {
  const expectedChars: TClosingChar[] = [];
  const chars: (TOpeningChar | TClosingChar)[] = line.split('') as (
    | TOpeningChar
    | TClosingChar
  )[];
  let illegalChar: TClosingChar | null = null;

  let charIdx = 0;
  while (illegalChar === null && charIdx < chars.length) {
    const char = chars[charIdx];
    charIdx += 1;

    if (isOpeningChar(char)) {
      expectedChars.push(pairs[char]);
      // log(`Opening char: "${char}" - expected closing char: "${last(expectedChars)}"`);
    } else {
      if (char === last(expectedChars)) {
        // log(`Expected closing char: "${char}"`);
        expectedChars.pop();
      } else {
        log(
          `Expected ${last(expectedChars)}, but found ${char} instead.`,
          charIdx
        );
        illegalChar = char;
      }
    }
  }

  return illegalChar;
};

export const partOne = (rawInput: string) => {
  return sum(
    rawInput
      .split('\n')
      .map(validateLine)
      .filter(isClosingChar)
      .map((char) => points[char])
  );
};

const completeLine = (line: string): TClosingChar[] => {
  const expectedChars: TClosingChar[] = [];
  const chars: (TOpeningChar | TClosingChar)[] = line.split('') as (
    | TOpeningChar
    | TClosingChar
  )[];
  let illegalChar: TClosingChar | null = null;

  let charIdx = 0;
  while (illegalChar === null && charIdx < chars.length) {
    const char = chars[charIdx];
    charIdx += 1;

    if (isOpeningChar(char)) {
      expectedChars.push(pairs[char]);
    } else {
      if (char === last(expectedChars)) {
        expectedChars.pop();
      } else {
        log(
          `Expected ${last(expectedChars)}, but found ${char} instead.`,
          charIdx
        );
        illegalChar = char;
      }
    }
  }

  return expectedChars.reverse();
};

export const autoCompleteScore = (line: string): number | null => {
  if (validateLine(line)) {
    return null;
  }
  const completeChars = completeLine(line);
  // log(line + ' - ' + completeChars.join(''));
  return completeChars.reduce((acc: number, char, idx) => {
    return 5 * acc + autoCompletePoints[char];
  }, 0);
};

export const partTwo = (rawInput: string) => {
  const autoCompleteScores = rawInput
    .split('\n')
    .map(autoCompleteScore)
    .filter((score) => typeof score === 'number')
    .sort((a, b) => (a > b ? -1 : 1));

  return autoCompleteScores[Math.floor(autoCompleteScores.length / 2 - 1)];
};
