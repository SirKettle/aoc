import argsParser from 'args-parser';
const args = argsParser(process.argv);

export const log = (...message: any[]) => {
  if (args.debug) {
    console.log(...message);
  }
};
