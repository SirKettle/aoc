import { sum } from 'ramda';

const WIN = 6;
const DRAW = 3;
const LOSE = 0;

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;

const codeMap = {
  A: ROCK,
  B: PAPER,
  C: SCISSORS,
  X: ROCK,
  Y: PAPER,
  Z: SCISSORS,
};

const winningShape = (loses: 1 | 2 | 3): 1 | 2 | 3 => {
  switch (loses) {
    case ROCK:
      return PAPER;
    case PAPER:
      return SCISSORS;
    case SCISSORS:
      return ROCK;
  }
};

const losingShape = (wins: 1 | 2 | 3): 1 | 2 | 3 => {
  switch (wins) {
    case ROCK:
      return SCISSORS;
    case PAPER:
      return ROCK;
    case SCISSORS:
      return PAPER;
  }
};

const validateRound = (round: string[]) => {
  return (
    ['A', 'B', 'C'].includes(round[0]) && ['X', 'Y', 'Z'].includes(round[1])
  );
};

const scoreRound = ([opponentShape, yourShape]: [1 | 2 | 3, 1 | 2 | 3]) => {
  if (opponentShape === yourShape) {
    return [DRAW + opponentShape, DRAW + yourShape];
  }

  return yourShape === winningShape(opponentShape)
    ? [LOSE + opponentShape, WIN + winningShape(opponentShape)]
    : [WIN + opponentShape, LOSE + losingShape(opponentShape)];
};

const partOneDecodeRound = (round: string[]): [1 | 2 | 3, 1 | 2 | 3] => {
  if (!validateRound(round)) {
    throw new Error('invalid round');
  }

  return [codeMap[round[0]], codeMap[round[1]]];
};

export const partOne = (rawInput: string) => {
  const rounds = rawInput
    .split('\n')
    .filter(Boolean)
    .map((round) => round.split(' '));
  const scores = rounds.map(partOneDecodeRound).map(scoreRound);
  const yourScore = sum(scores.map((s) => s[1]));
  return yourScore;
};

/*
 * The Elf finishes helping with the tent and sneaks back over to you.
 * "Anyway, the second column says how the round needs to end:
 * X means you need to lose,
 * Y means you need to end the round in a draw,
 * and Z means you need to win.
 * Good luck!"
 */

const partTwoDecodeRound = (round: string[]): [1 | 2 | 3, 1 | 2 | 3] => {
  if (!validateRound(round)) {
    throw new Error('invalid round');
  }

  const opponentShape = codeMap[round[0]];

  switch (round[1]) {
    case 'X':
      return [opponentShape, losingShape(opponentShape)];
    case 'Z':
      return [opponentShape, winningShape(opponentShape)];
    default:
      return [opponentShape, opponentShape];
  }
};

export const partTwo = (rawInput: string) => {
  const rounds = rawInput
    .split('\n')
    .filter(Boolean)
    .map((round) => round.split(' '));
  const decoded = rounds.map(partTwoDecodeRound);
  const scores = decoded.map(scoreRound);
  const yourScore = sum(scores.map((s) => s[1]));
  return yourScore;
};
