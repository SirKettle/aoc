import { times, uniq } from 'ramda';

interface IVector {
  x: number;
  y: number;
}

type TDirection = 'R' | 'U' | 'D' | 'L';

const intialPosition: IVector = { x: 0, y: 0 };
const vectorKey = (vector: IVector): string => `${vector.x}:${vector.y}`;

export const updatePositionTally = (
  positions: Record<string, number>,
  vector: IVector
): Record<string, number> => {
  const key = vectorKey(vector);
  return {
    ...positions,
    [key]: (positions[key] || 0) + 1,
  };
};

interface IMovement {
  directions: TDirection[];
  pos: IVector;
}

const moveHead = (head: IVector, direction: TDirection): IMovement => {
  if (direction === 'R') {
    head.x += 1;
  }
  if (direction === 'L') {
    head.x -= 1;
  }
  if (direction === 'U') {
    head.y += 1;
  }
  if (direction === 'D') {
    head.y -= 1;
  }

  const movement = {
    pos: head,
    directions: [direction],
  };

  return movement;
};

const moveTail = (tail: IVector, head: IVector): IMovement => {
  const directions: TDirection[] = [];

  const xDistance = head.x - tail.x;
  const yDistance = head.y - tail.y;
  let movedX = false;
  let movedY = false;

  if (Math.abs(xDistance) > 1) {
    tail.x += xDistance < 0 ? -1 : 1;
    movedX = true;
    directions.push(xDistance < 0 ? 'L' : 'R');

    if (Math.abs(yDistance) > 0) {
      tail.y += yDistance < 0 ? -1 : 1;
      movedY = true;
      directions.push(yDistance < 0 ? 'D' : 'U');
    }
  }

  if (Math.abs(yDistance) > 1 && !movedY) {
    tail.y += yDistance < 0 ? -1 : 1;
    directions.push(yDistance < 0 ? 'D' : 'U');

    if (Math.abs(xDistance) > 0 && !movedX) {
      tail.x += xDistance < 0 ? -1 : 1;
      directions.push(xDistance < 0 ? 'L' : 'R');
    }
  }

  return {
    pos: tail,
    directions,
  };
};

export const partOne = (rawInput: string) => {
  const headPositions: IVector[] = [];
  const tailPositions: IVector[] = [];
  let head = { ...intialPosition };
  let tail = { ...intialPosition };
  rawInput
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      const parts = l.split(' ');
      return { direction: parts[0] as TDirection, amount: Number(parts[1]) };
    })
    .forEach((op) => {
      times(() => {
        head = moveHead(head, op.direction).pos;
        headPositions.push({ ...head });
        tail = moveTail(tail, head).pos;
        tailPositions.push({ ...tail });
      }, op.amount);
    });
  return uniq(tailPositions.map(vectorKey)).length;
};

export const partTwo = (rawInput: string) => {
  const headPositions: IVector[] = [];
  const tailPositions: IVector[] = [];
  let head = { ...intialPosition };
  let tails = times(() => ({ ...intialPosition }), 9);
  rawInput
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      const parts = l.split(' ');
      return { direction: parts[0] as TDirection, amount: Number(parts[1]) };
    })
    .forEach((op) => {
      times(() => {
        head = moveHead(head, op.direction).pos;
        headPositions.push({ ...head });

        tails.forEach((tail, idx) => {
          const prev = idx === 0 ? { ...head } : { ...tails[idx - 1] };

          tail = moveTail(tail, prev).pos;
        });

        tailPositions.push({ ...tails[tails.length - 1] });
      }, op.amount);
    });
  return uniq(tailPositions.map(vectorKey)).length;
};
