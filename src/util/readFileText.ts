import { readFile } from 'node:fs/promises';

export const readFileText = async (filePath: string) => {
  try {
    const buffer = await readFile(filePath);
    return buffer.toString('utf-8');
  } catch (err) {
    throw err;
  }
};
