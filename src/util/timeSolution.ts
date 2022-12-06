import { ISolution } from '../../types';

export const timeSolution = (func: () => void): ISolution => {
  const start = Date.now();
  const answer = func();
  const timeMs = Date.now() - start;
  return {
    answer,
    timeMs,
  };
};
