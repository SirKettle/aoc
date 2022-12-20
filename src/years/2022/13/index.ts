import { times } from 'ramda';
import { log } from '../../../util/log';

type TPacket = number | TPacket[];
type TPacketPair = [TPacket, TPacket];
type TResult = 'EQUAL' | 'LEFT' | 'RIGHT';
const comparePackets = ([left, right]: TPacketPair, tab = 0): TResult => {
  const tabSpaces = times(() => '  ', tab).join('');
  log(
    tabSpaces,
    '- Compare',
    JSON.stringify(left),
    'vs',
    JSON.stringify(right)
  );
  let result: TResult = 'EQUAL';
  if (typeof left === 'number' && typeof right === 'number') {
    if (left === right) {
      result = 'EQUAL';
      // log(result);
      return result;
    }
    if (left < right) {
      log(
        tabSpaces,
        '- Left side is smaller, so inputs are in the right order'
      );
      return 'LEFT';
    }

    log(
      tabSpaces,
      ' - Right side is smaller, so inputs are NOT in the right order'
    );
    return 'RIGHT';
  }
  const leftArr = Array.isArray(left) ? left : [left];
  const rightArr = Array.isArray(right) ? right : [right];
  let idx = 0;
  while (
    idx < Math.max(leftArr.length, rightArr.length) &&
    result === 'EQUAL'
  ) {
    if (typeof leftArr[idx] === 'undefined') {
      log(
        tabSpaces,
        '- Left side ran out of items, so inputs are in the right order'
      );
      return 'LEFT';
    }
    if (typeof rightArr[idx] === 'undefined') {
      log(
        tabSpaces,
        '- Right side ran out of items, so inputs are NOT in the right order'
      );
      return 'RIGHT';
    }
    result = comparePackets([leftArr[idx], rightArr[idx]], tab + 1);
    idx += 1;
  }
  return result;
};

export const partOne = (rawInput: string) => {
  const packets: TPacket[][] = rawInput
    .split('\n\n')
    .map((rawPair) => rawPair.split('\n').filter(Boolean).map(eval));

  const results = packets.slice(0).map((pair, idx) => {
    return comparePackets(pair as TPacketPair);
  });

  return results.reduce((acc, item, idx) => {
    if (item === 'LEFT') {
      return acc + idx + 1;
    }
    return acc;
  }, 0);
};

export const partTwo = (rawInput: string) => {
  const packets: TPacket[] = rawInput.split('\n').filter(Boolean).map(eval);

  const stringPacket = (p: TPacket) => JSON.stringify(p);
  const dividerPackets = [[[2]], [[6]]];
  const dividerPacketStrings = dividerPackets.map(stringPacket);

  const sorted = [...packets, ...dividerPackets].sort((a, b) => {
    const result = comparePackets([a, b]);
    if (result === 'EQUAL') {
      return 0;
    }
    return result === 'LEFT' ? -1 : 1;
  });

  return sorted.map(stringPacket).reduce((acc, item, idx) => {
    if (dividerPacketStrings.includes(item)) {
      return acc * (idx + 1);
    }
    return acc;
  }, 1);
};
