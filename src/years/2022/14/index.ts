import { range, uniq } from 'ramda';
import { log } from '../../../util/log';

interface IState {
  tick: number;
  abyss: number;
  start: string;
  sand: any[];
  rocks: string[];
  newSand: boolean;
  floorY: number;
  lastSand?: IVector;
  isEnd: boolean;
}

interface IVector {
  x: number;
  y: number;
}

const vectorString = (v: IVector) => `${v.x},${v.y}`;
const vectorFromString = (v: string) => {
  const parts = v.split(',').map(Number);
  return { x: parts[0], y: parts[1] };
};

const getLinePoints = (a: IVector, b?: IVector): IVector[] => {
  if (!b) {
    return [a];
  }
  if (a.x === b.x) {
    return range(Math.min(a.y, b.y), Math.max(a.y, b.y) + 1).map((y) => ({
      x: a.x,
      y,
    }));
  }
  return range(Math.min(a.x, b.x), Math.max(a.x, b.x) + 1).map((x) => ({
    x,
    y: a.y,
  }));
};

const getAllPoints = (pointStrings: string[]): IVector[] => {
  const points = pointStrings.map(vectorFromString);
  return points.flatMap((p, idx) => {
    return getLinePoints(p, points[idx + 1]);
  });
};

const deserialize = (rawInput: string) =>
  uniq(
    rawInput
      .split('\n')
      .filter(Boolean)
      .map((l) => l.split(' -> '))
      .reduce((acc: IVector[], pointStrings) => {
        const points = getAllPoints(pointStrings);

        return [...acc, ...points];
      }, [])
      .map(vectorString)
      .sort()
  );

const draw = (
  start: string,
  rocks: string[],
  sand: string[],
  drawConfig: { minX: number; maxX: number; minY: number; maxY: number }
) => {
  return range(drawConfig.minY - 1, drawConfig.maxY + 2)
    .map((y) => {
      return range(drawConfig.minX - 1, drawConfig.maxX + 2)
        .map((x) => {
          const v = vectorString({ x, y });
          if (v === start) {
            return '+';
          }
          if (sand.includes(v)) {
            return 'o';
          }
          if (rocks.includes(v)) {
            return '#';
          }
          return '.';
        })
        .join('');
    })
    .join('\n');
};

export const update = (state: IState): IState => {
  state.tick += 1;

  if (state.newSand) {
    state.sand.push(state.start);
    state.newSand = false;
  }

  // move sand
  state.lastSand = vectorFromString(state.sand[state.sand.length - 1]);
  const { x, y } = state.lastSand;

  if (y === state.floorY) {
    state.newSand = true;
    return state;
  }

  const below = vectorString({ x, y: y + 1 });

  const obstacles = [...state.rocks, ...state.sand];
  if (!obstacles.includes(below)) {
    state.sand[state.sand.length - 1] = below;
  } else {
    const belowLeft = vectorString({ x: x - 1, y: y + 1 });
    if (!obstacles.includes(belowLeft)) {
      state.sand[state.sand.length - 1] = belowLeft;
    } else {
      const belowRight = vectorString({ x: x + 1, y: y + 1 });
      if (!obstacles.includes(belowRight)) {
        state.sand[state.sand.length - 1] = belowRight;
      } else {
        state.newSand = true;
      }
    }
  }
  return state;
};

export const partOne = (rawInput: string) => {
  const start = '500,0';
  const rocks: string[] = deserialize(rawInput);
  const startThings = [...rocks, start].map(vectorFromString);
  const startYs = startThings.map((r) => r.y);
  const floorY = Math.max(...startYs) + 1;

  let state: IState = {
    tick: 0,
    abyss: 0,
    start,
    sand: [],
    rocks,
    newSand: true,
    floorY,
    isEnd: false,
  };

  while (state.isEnd === false) {
    state = update(state);

    if (state.lastSand?.y > floorY - 1) {
      state.abyss += 1;
      state.isEnd = true;
      const allThings = [...state.rocks, ...state.sand, start].map(
        vectorFromString
      );

      const xs = allThings.map((r) => r.x);
      const ys = allThings.map((r) => r.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const drawConfig = { minX, maxX, minY, maxY };
      log(draw(start, rocks, state.sand, drawConfig));
    }
  }

  const answer = state.sand.length - 1;

  return answer;
};

export const partTwo = (rawInput: string) => {
  return '28145 - takes 400s to run';

  const start = '500,0';
  const startVector = vectorFromString(start);
  const rocks: string[] = deserialize(rawInput);
  const startThings = [...rocks, start].map(vectorFromString);
  const startYs = startThings.map((r) => r.y);
  const floorY = Math.max(...startYs) + 1;
  const minX = startVector.x - Math.floor(startYs.length * 0.5);
  const maxX = startVector.x + Math.floor(startYs.length * 0.5);
  const floor = getLinePoints(
    { x: minX, y: floorY },
    { x: maxX, y: floorY }
  ).map(vectorString);

  let state: IState = {
    tick: 0,
    abyss: 0,
    start,
    sand: [],
    // rocks: [...rocks, ...floor],
    rocks,
    newSand: true,
    floorY,
    isEnd: false,
  };

  const below = vectorString({ x: startVector.x, y: startVector.y + 1 });
  const belowLeft = vectorString({
    x: startVector.x - 1,
    y: startVector.y + 1,
  });
  const belowRight = vectorString({
    x: startVector.x + 1,
    y: startVector.y + 1,
  });

  while (
    state.isEnd === false
    // && state.tick < 600000
  ) {
    state = update(state);

    if (state.newSand) {
      if (
        state.sand.includes(below) &&
        state.sand.includes(belowLeft) &&
        state.sand.includes(belowRight)
      ) {
        state.isEnd = true;
      }
    }
  }

  const allThings = [...state.rocks, ...state.sand, state.start].map(
    vectorFromString
  );
  const ys = allThings.map((r) => r.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const drawConfig = { minX, maxX, minY, maxY };

  log(draw(start, state.rocks, state.sand, drawConfig));

  const answer = state.sand.length + 1;

  log({ ticks: state.tick, answer });

  return answer;
};
