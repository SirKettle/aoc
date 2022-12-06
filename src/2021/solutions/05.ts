import path from 'path';
import { timeSolution } from '../../util/timeSolution';
import { printResults } from '../../util/printResults';
import { paths } from '../input/05';
import { checkIntersection } from 'line-intersect';
import { uniq } from 'ramda';

interface IVector {
  x: number;
  y: number;
}

type TVectorPath = [IVector, IVector];

const fixRoundingErrors = (v: IVector): IVector => ({
  x: Number(v.x.toPrecision(12)),
  y: Number(v.y.toPrecision(12)),
});

const toVectorKey = (v: IVector) => `{x:${v.x},y:${v.y}}`;

const partOne = (vectorPaths: TVectorPath[]) => {
  const straightLines = vectorPaths.filter(
    (p) => p[0].x === p[1].x || p[0].y === p[1].y
  );
  // .slice(0, 30);

  const intersections = straightLines.flatMap((l, idx) => {
    const linesToCheck = straightLines.slice(idx + 1);
    console.log(linesToCheck.length);
    return linesToCheck
      .map((l2) =>
        checkIntersection(
          l[0].x,
          l[0].y,
          l[1].x,
          l[1].y,
          l2[0].x,
          l2[0].y,
          l2[1].x,
          l2[1].y
        )
      )
      .filter((d) => d.type === 'intersecting')
      .map((d) => d.type === 'intersecting' && d.point)
      .map(fixRoundingErrors)
      .map(toVectorKey)
      .sort();
  });

  // console.log(straightLines);
  console.log(vectorPaths.length);
  console.log(straightLines.length);
  console.log(intersections);
  console.log(intersections.length);
  return uniq(intersections).length;
};

const partTwo = () => `TODO`;

export default () => {
  const vectorPaths: TVectorPath[] = paths.map(
    (p): TVectorPath => [
      { x: p[0][0], y: p[0][1] },
      { x: p[1][0], y: p[1][1] },
    ]
  );

  // console.log(paths.slice(0, 4));
  // console.log(vectorPaths.length);

  printResults(path.basename(__filename), [
    // part1
    timeSolution(() => partOne(vectorPaths.slice(0))),
    // part2
    timeSolution(() => partTwo()),
  ]);
};
