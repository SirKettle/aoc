export const partOne = (rawInput: string) => {
  return rawInput
    .split('\n')
    .filter(Boolean)
    .map((pair) =>
      pair
        .split(',')
        .map((range) => range.split('-').map(Number))
        .map((entry) => {
          const range = {
            min: Math.min(entry[0], entry[1]),
            max: Math.max(entry[0], entry[1]),
          };
          return {
            ...range,
            range: range.max - range.min,
          };
        })
        .sort((a, b) => (a.range > b.range ? -1 : 1))
    )
    .filter((pair) => {
      return pair[0].min <= pair[1].min && pair[0].max >= pair[1].max;
    }).length;
};

export const partTwo = (rawInput: string) => {
  return rawInput
    .split('\n')
    .filter(Boolean)
    .map((pair) =>
      pair
        .split(',')
        .map((range) => range.split('-').map(Number))
        .map((entry) => {
          const range = {
            min: Math.min(entry[0], entry[1]),
            max: Math.max(entry[0], entry[1]),
          };
          return {
            ...range,
            range: range.max - range.min,
          };
        })
        .sort((a, b) => (a.range > b.range ? -1 : 1))
    )
    .filter((pair) => {
      if (pair[1].min >= pair[0].min && pair[1].min <= pair[0].max) {
        return true;
      }
      if (pair[1].max >= pair[0].min && pair[1].max <= pair[0].max) {
        return true;
      }
      return false;
    }).length;
};
