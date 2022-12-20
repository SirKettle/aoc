import { identity, last, pick, prop, times, uniq } from 'ramda';
import { log } from '../../../util/log';

interface IVector {
  x: number;
  y: number;
}

interface IVectorKey {
  vector: IVector;
  vectorKey: string;
}

interface ISensorInfo extends IVectorKey {
  closestBeacon: IVectorKey;
  closestBeaconManhattenDist: number;
}

interface IData {
  map: Record<string, ISensorInfo>;
  sensors: IVectorKey[];
  beacons: IVectorKey[];
  boundary?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

const manhattenDistance = (a: IVector, b: IVector) =>
  Math.round(Math.abs(a.x - b.x) + Math.abs(a.y - b.y));

const vectorKey = (v: IVector) => `x:${v.x},y:${v.y}`;

const deserialise = (rawInput: string): IData => {
  // Sensor at x=20, y=1: closest beacon is at x=15, y=3

  const sensorInfos: ISensorInfo[] = rawInput
    .split('\n')
    .filter(Boolean)
    .map((line): ISensorInfo => {
      const vector = Object.freeze({
        x: Number(line.split('Sensor at x=')[1].split(',')[0]),
        y: Number(line.split(', y=')[1].split(':')[0]),
      });
      const closestBeaconVector = Object.freeze({
        x: Number(line.split(': closest beacon is at x=')[1].split(',')[0]),
        y: Number(line.split(', y=')[2]),
      });
      const info: ISensorInfo = {
        vector,
        vectorKey: vectorKey(vector),
        closestBeacon: {
          vector: closestBeaconVector,
          vectorKey: vectorKey(closestBeaconVector),
        },
        closestBeaconManhattenDist: manhattenDistance(
          vector,
          closestBeaconVector
        ),
      };

      return info;
    });

  const data: IData = {
    map: sensorInfos.reduce((acc: Record<string, ISensorInfo>, info) => {
      return {
        ...acc,
        [info.vectorKey]: Object.freeze({ ...info }),
      };
    }, {}),
    sensors: sensorInfos.map(pick(['vector', 'vectorKey'])),
    beacons: sensorInfos.map(prop('closestBeacon')),
  };

  const allThings = [...data.sensors, ...data.beacons];
  const xs = allThings.map((v) => v.vector.x);
  const ys = allThings.map((v) => v.vector.x);

  return {
    ...data,
    boundary: {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    },
  };
};
/*
                 1    1    2    2
       0    5    0    5    0    5
 9 ...#########################...
10 ..####B######################..
11 .###S#############.###########.

In this example, in the row where y=10, there are 
26 positions where a beacon cannot be present.
*/

const noBeaconsForBeaconAtY =
  (y: number, searchMinX?: number, searchMaxX?: number) =>
  (sensor: ISensorInfo): string[] => {
    // check sensor can see y
    const s = sensor.vector;
    const minY = s.y - sensor.closestBeaconManhattenDist;
    const maxY = s.y + sensor.closestBeaconManhattenDist;

    if (minY < y && maxY > y) {
      // console.log('\ny dist');
      const yDistance = Math.abs(s.y - y);
      const xDistance = sensor.closestBeaconManhattenDist - yDistance;
      const minX =
        typeof searchMinX === 'number' ? searchMinX : s.x - xDistance;
      const maxX =
        typeof searchMaxX === 'number' ? searchMaxX : s.x + xDistance;
      // console.log(sensor);
      return times(identity, maxX - minX).map((idx) => {
        const vector = { x: minX + idx, y };
        const key = vectorKey(vector);
        return key;
      });
    }
    return [];
  };
// const noBeaconsForBeaconAtY =
//   (y: number, searchMinX?: number, searchMaxX?: number) =>
//   (sensor: ISensorInfo): Record<string, IVector> => {
//     // check sensor can see y
//     const s = sensor.vector;
//     const minY = s.y - sensor.closestBeaconManhattenDist;
//     const maxY = s.y + sensor.closestBeaconManhattenDist;

//     if (minY < y && maxY > y) {
//       // console.log('\ny dist');
//       const yDistance = Math.abs(s.y - y);
//       const xDistance = sensor.closestBeaconManhattenDist - yDistance;
//       const minX =
//         typeof searchMinX === 'number' ? searchMinX : s.x - xDistance;
//       const maxX =
//         typeof searchMaxX === 'number' ? searchMaxX : s.x + xDistance;
//       // console.log(sensor);
//       return times(identity, maxX - minX).reduce(
//         (acc: Record<string, IVector>, idx) => {
//           const vector = { x: minX + idx, y };
//           const key = vectorKey(vector);
//           return {
//             ...acc,
//             [key]: vector,
//           };
//         },
//         {}
//       );
//     }
//     return {};
//   };

const recordTime = (ts: number[], label = 'something') => {
  const newTime = Date.now();
  log(label + ' - ' + (newTime - last(ts)) + 'ms');
  return [...ts, newTime];
};

export const partOne = (rawInput: string) => {
  let ts = [Date.now()];
  const data = deserialise(rawInput);

  ts = recordTime(ts, 'deserialize');

  // const noBeaconsFunc = noBeaconsForBeaconAtY(20);
  const noBeaconsFunc = noBeaconsForBeaconAtY(2000000);

  // return pick(['map', 'boundary'], deserialise(rawInput));]

  const noBeacons = Object.values(data.map).flatMap(noBeaconsFunc);
  ts = recordTime(ts, 'noBeacons map');

  const uniqNoBeacons = uniq(noBeacons);
  ts = recordTime(ts, 'uniq noBeacons');

  // const uniqNoBeacons = noBeacons.reduce(
  //   (acc: Record<string, IVector>, beacons) => {
  //     return {
  //       ...acc,
  //       ...beacons,
  //     };
  //   },
  //   {}
  // );
  // ts = recordTime(ts, 'noBeacons merge');

  return uniqNoBeacons.length;
};

// export const partTwo = (rawInput: string) => {
//   const data = deserialise(rawInput);
//   const searchMin = 0;
//   const searchMax = 20;
//   const noBeacons = uniq(
//     Object.values(data.map).flatMap((s) => {
//       // const noBeacons = noBeaconsAt2000000(s);
//       const noBeacons = times(
//         (idx) => noBeaconsForBeaconAtY(idx, searchMin, searchMax)(s),
//         searchMax - searchMin
//       ).flat();
//       // return {
//       //   sensor: s.vectorKey,
//       //   manhattenDistance: s.closestBeaconManhattenDist,
//       //   noBeacons: noBeaconsAt20(s),
//       // };
//       return noBeacons;
//     })
//   );

//   const possibleXs = times(identity,searchMax - searchMin).filter(x => )

//   return noBeacons;
// };
