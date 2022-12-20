import { multiply, times } from 'ramda';

interface IMonkey {
  id: string;
  items: number[];
  operation: {
    func: (old: number) => number;
    op: string;
    by: number | null;
  };
  testDivisor: number;
  throwIfTrue: string;
  throwIfFalse: string;
}

export const div3 = (num: number) => Math.floor(num / 3);

export const partOne = (rawInput: string) => {
  const inspections: Record<string, number> = {};
  const monkeys: Record<string, IMonkey> = rawInput
    .split('\n\n')
    .map((d) => d.split('\n').filter(Boolean))
    .reduce((acc: Record<string, IMonkey>, d) => {
      // console.log(d);
      const operationParts = d[2].split('Operation: new = old ')[1].split(' ');
      const op = operationParts[0];
      const by = Number(operationParts[1]);
      const id = d[0].split(' ')[1].replace(/:/, '');
      return {
        ...acc,
        [id]: {
          id,
          items: d[1].split('Starting items: ')[1].split(', ').map(Number),
          operation: {
            op,
            by,
            func: (old: number) => {
              const thing = isNaN(by) ? old : by;
              if (op === '+') {
                return old + thing;
              }
              if (op === '-') {
                return old - thing;
              }
              if (op === '*') {
                return old * thing;
              }
              if (op === '/') {
                return old / thing;
              }
            },
          },
          testDivisor: Number(d[3].split('Test: divisible by ')[1]),
          throwIfTrue: d[4].split('If true: throw to monkey ')[1],
          throwIfFalse: d[5].split('If false: throw to monkey ')[1],
        },
      };
    }, {});

  times(() => {
    Object.keys(monkeys).forEach((id) => {
      const m = monkeys[id];
      const items = m.items.slice(0);

      inspections[id] = (inspections[id] || 0) + items.length;

      items
        .map(m.operation.func)
        .map(div3)
        .forEach((num) => {
          if (num % m.testDivisor === 0) {
            monkeys[m.throwIfTrue].items.push(num);
          } else {
            monkeys[m.throwIfFalse].items.push(num);
          }
        });
      m.items = [];
    });
  }, 20);
  // console.log({ monkeys, inspections });
  return Object.values(inspections)
    .sort((a, b) => (a > b ? -1 : 1))
    .slice(0, 2)
    .reduce((acc, item) => acc * item);
};

export const partTwo = (rawInput: string) => {
  const inspections: Record<string, number> = {};
  const monkeys: Record<string, IMonkey> = rawInput
    .split('\n\n')
    .map((d) => d.split('\n').filter(Boolean))
    .reduce((acc: Record<string, IMonkey>, d) => {
      // console.log(d);
      const operationParts = d[2].split('Operation: new = old ')[1].split(' ');
      const op = operationParts[0];
      const by = Number(operationParts[1]);
      const id = d[0].split(' ')[1].replace(/:/, '');
      return {
        ...acc,
        [id]: {
          id,
          items: d[1].split('Starting items: ')[1].split(', ').map(Number),
          operation: {
            op,
            by,
            func: (old: number) => {
              const thing = isNaN(by) ? old : by;
              if (op === '+') {
                return old + thing;
              }
              if (op === '-') {
                return old - thing;
              }
              if (op === '*') {
                return old * thing;
              }
              if (op === '/') {
                return old / thing;
              }
            },
          },
          testDivisor: Number(d[3].split('Test: divisible by ')[1]),
          throwIfTrue: d[4].split('If true: throw to monkey ')[1],
          throwIfFalse: d[5].split('If false: throw to monkey ')[1],
        },
      };
    }, {});

  const mod = Object.values(monkeys)
    .map((m) => m.testDivisor)
    .reduce(multiply);

  const relief = (num: number) => num % mod;

  times(() => {
    Object.keys(monkeys).forEach((id) => {
      const m = monkeys[id];
      const items = m.items.slice(0);

      inspections[id] = (inspections[id] || 0) + items.length;

      items
        .map(m.operation.func)
        .map(relief)
        .forEach((num) => {
          if (num % m.testDivisor === 0) {
            monkeys[m.throwIfTrue].items.push(num);
          } else {
            monkeys[m.throwIfFalse].items.push(num);
          }
        });
      m.items = [];
    });
  }, 10000);
  // console.log({ monkeys, inspections });
  return Object.values(inspections)
    .sort((a, b) => (a > b ? -1 : 1))
    .slice(0, 2)
    .reduce((acc, item) => acc * item);
};
