const movements: IVector[] = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
];

interface IVector {
  x: number;
  y: number;
}

const pointKey = (p: IVector) => `x${p.x}:y${p.y}`;
const getElevation = (char: string) => {
  let c = char;
  if (c === 'S') {
    c = 'a';
  }
  if (c === 'E') {
    c = 'z';
  }
  return c.codePointAt(0) - 'a'.codePointAt(0);
};

const elevationGrid = (
  rawInput: string,
  startChars: string[]
): { grid: number[][]; startingPoints: IVector[]; endPoint: IVector } => {
  const startingPoints: IVector[] = [];
  let endPoint: IVector;

  const grid = rawInput
    .split('\n')
    .filter(Boolean)
    .map((line, y) =>
      line.split('').map((char, x) => {
        if (startChars.includes(char)) {
          startingPoints.push({ x, y });
        }
        if (char === 'E') {
          endPoint = { x, y };
        }
        return getElevation(char);
      })
    );
  return { startingPoints, endPoint, grid };
};

function solve(rawInput: string, startChars: string[]) {
  let answer = 0;

  const { grid, startingPoints, endPoint } = elevationGrid(
    rawInput,
    startChars
  );

  const journeys = startingPoints.map((start) => ({ pos: start, steps: 0 }));

  const s: string[] = [];
  while (journeys.length) {
    const {
      pos: { x, y },
      steps,
    } = journeys.shift();

    if (s.includes(pointKey({ x, y }))) {
      continue;
    }
    if (y === endPoint.y && x === endPoint.x) {
      answer = steps;
      break;
    }
    for (const m of movements) {
      if (
        grid[y + m.y]?.[x + m.x] === undefined ||
        grid[y + m.y][x + m.x] > grid[y][x] + 1 ||
        s.includes(pointKey({ x: x + m.x, y: y + m.y }))
      ) {
        continue;
      }
      journeys.push({
        pos: {
          x: x + m.x,
          y: y + m.y,
        },
        steps: steps + 1,
      });
    }

    s.push(pointKey({ x, y }));
  }

  return answer;
}

export const partOne = (rawInput: string) => {
  return solve(rawInput, ['S']);
};

export const partTwo = (rawInput: string) => {
  return solve(rawInput, ['S', 'a']);
};
