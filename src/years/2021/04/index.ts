import { sum } from 'ramda';

const deserialize = (
  rawInput: string
): { numbers: number[]; boards: number[][][] } => {
  const blocks = rawInput.split('\n\n');
  const numbers: number[] = blocks[0].split(',').map(Number);
  const boards: number[][][] = blocks.slice(1).map((rawBoard) => {
    return rawBoard.split('\n').map((line) => {
      return line
        .split(' ')
        .filter((char) => char !== '')
        .map(Number);
    });
  });
  return { numbers, boards };
};

const checkWin = (numbersCalled: number[]) => (board: number[][]) => {
  const squaresCount = board[0].length;

  // check horizontal
  const horizontalWin = board.some((line) =>
    line.every((num) => numbersCalled.includes(num))
  );
  if (horizontalWin) {
    return true;
  }

  const verticalWin = board[0].some((_, idx) => {
    return board.every((line) => numbersCalled.includes(line[idx]));
  });

  return verticalWin;
};

const getBoardScore = (numbersCalled: number[], board: number[][]): number => {
  const unmarkedNumbers: number[] = (board || []).reduce((acc, line) => {
    return [...acc, ...line.filter((num) => !numbersCalled.includes(num))];
  }, []);

  const totalUnmarkedNumbers = sum(unmarkedNumbers);
  const lastNumberCalled = numbersCalled[numbersCalled.length - 1];
  const winningScore = totalUnmarkedNumbers * lastNumberCalled;
  return winningScore;
};

export const partOne = (rawInput: string) => {
  const { numbers, boards } = deserialize(rawInput);

  let winningBoard;

  const winningNumbersCalled = numbers.reduce((acc: number[], number) => {
    if (winningBoard) {
      return acc;
    }
    const numbersCalled = [...acc, number];

    winningBoard = boards.find(checkWin(numbersCalled));

    return numbersCalled;
  }, []);

  return getBoardScore(winningNumbersCalled, winningBoard);
};

interface WinningBoard {
  boardIdx: number;
  roundIdx: number;
  numbersCalled: number[];
}

export const partTwo = (rawInput: string) => {
  const { numbers, boards } = deserialize(rawInput);
  const winningBoards: WinningBoard[] = [];

  numbers.reduce((acc: number[], number, roundIdx) => {
    const numbersCalled = [...acc, number];

    boards.forEach((b, boardIdx) => {
      const isWinnerAlready = winningBoards.find(
        (w) => w.boardIdx === boardIdx
      );
      if (isWinnerAlready) {
        return;
      }
      const isWin = checkWin(numbersCalled)(b);
      if (isWin) {
        winningBoards.push({ roundIdx, boardIdx, numbersCalled });
      }
    });

    return numbersCalled;
  }, []);

  const lastWinningBoardInfo = winningBoards[winningBoards.length - 1];
  const lastWinningBoard = boards[lastWinningBoardInfo.boardIdx];

  return getBoardScore(lastWinningBoardInfo.numbersCalled, lastWinningBoard);
};
