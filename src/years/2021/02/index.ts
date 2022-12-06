interface IPosition {
  x: number;
  depth: number;
  aim?: number;
}

interface IInstruction extends IPosition {
  direction: 'forward' | 'up' | 'down';
  units: number;
}

const deserializeInstructionPartOne = (
  raw: string
): IInstruction | undefined => {
  const parts = raw.split(' ');
  if (parts.length !== 2) {
    return;
  }
  const units = parseFloat(parts[1]);
  if (isNaN(units)) {
    return;
  }
  switch (parts[0]) {
    case 'forward':
      return { direction: 'forward', units, x: units, depth: 0 };
    case 'up':
      return { direction: 'up', units, x: 0, depth: -units };
    case 'down':
      return { direction: 'down', units, x: 0, depth: units };
    default:
      return;
  }
};

const deserializeInstructionPartTwo = (
  raw: string
): IInstruction | undefined => {
  const parts = raw.split(' ');
  if (parts.length !== 2) {
    return;
  }
  const units = parseFloat(parts[1]);
  if (isNaN(units)) {
    return;
  }
  switch (parts[0]) {
    case 'forward':
      return { direction: 'forward', units, x: units, depth: 0, aim: 0 };
    case 'up':
      return { direction: 'up', units, x: 0, depth: 0, aim: -units };
    case 'down':
      return { direction: 'down', units, x: 0, depth: 0, aim: units };
    default:
      return;
  }
};

export const partOne = (rawInput: string) => {
  const instructions = rawInput.split('\n').map(deserializeInstructionPartOne);

  const startPosition: IPosition = { x: 0, depth: 0 };
  const position = instructions.reduce((acc: IPosition, item) => {
    return {
      x: acc.x + item.x,
      // submarine cannot fly
      depth: Math.max(0, acc.depth + item.depth),
    };
  }, startPosition);

  // Calculate the horizontal position and depth you would have after following
  // the planned course. What do you get if you multiply your final horizontal
  // position by your final depth?
  return position.x * position.depth;
};

export const partTwo = (rawInput: string) => {
  const instructions = rawInput.split('\n').map(deserializeInstructionPartTwo);

  const startPosition: IPosition = { x: 0, depth: 0, aim: 0 };
  const position = instructions.reduce((acc: IPosition, item) => {
    const aim = acc.aim + item.aim;
    const depthChange = aim * item.x;
    const x = acc.x + item.x;
    return {
      x,
      aim,
      // submarine cannot fly
      depth: Math.max(0, acc.depth + depthChange),
    };
  }, startPosition);

  return position.x * position.depth;
};
