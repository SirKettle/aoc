import { last, times } from 'ramda';

const deserialize = (
  rawInput: string
): {
  containers: Record<string, string[]>;
  instructions: {
    quantity: number;
    from: string;
    to: string;
  }[];
} => {
  const top = rawInput.split('\n\n')[0].split('\n').filter(Boolean);
  const containerCode = top.slice(0, -1);
  const containerIdsLine = last(top);
  const containerIds = containerIdsLine.split('').filter((c) => c !== ' ');
  const containers = containerIds.reduce(
    (acc: Record<string, string[]>, id) => {
      const charIdx = containerIdsLine.indexOf(id);
      return {
        ...acc,
        [id]: containerCode
          .map((line) => line.charAt(charIdx))
          .filter((item) => item !== ' ')
          .reverse(),
      };
    },
    {}
  );
  const instructionLines = rawInput
    .split('\n\n')[1]
    .split('\n')
    .filter(Boolean);
  const instructions = instructionLines.map((line) => {
    const parts = line.split(' ');
    return {
      quantity: Number(parts[1]),
      from: parts[3],
      to: parts[5],
    };
  });

  return {
    instructions,
    containers,
  };
};

export const partOne = (rawInput: string) => {
  const data = deserialize(rawInput);

  const containers = data.instructions.reduce(
    (acc: Record<string, string[]>, instruction) => {
      times(() => {
        acc[instruction.to].push(acc[instruction.from].pop());
      }, instruction.quantity);

      return acc;
    },
    data.containers
  );

  const answer = Object.values(containers).map(last).join('');
  return answer;
};

export const partTwo = (rawInput: string) => {
  const data = deserialize(rawInput);

  const containers = data.instructions.reduce(
    (acc: Record<string, string[]>, instruction) => {
      const toStay = acc[instruction.from].slice(0, -instruction.quantity);
      const toMove = acc[instruction.from].slice(-instruction.quantity);
      return {
        ...acc,
        [instruction.to]: [...acc[instruction.to], ...toMove],
        [instruction.from]: toStay,
      };
    },
    data.containers
  );

  const answer = Object.values(containers).map(last).join('');
  return answer;
};
