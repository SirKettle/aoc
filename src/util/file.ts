import { readFile, writeFile } from 'node:fs/promises';

export const readFileText = async (filePath: string) => {
  try {
    const buffer = await readFile(filePath);
    return buffer.toString('utf-8');
  } catch (err) {
    throw err;
  }
};

export const writeToFile = async (filePath: string, text: string) => {
  try {
    console.log(`Write to ${filePath}\n`);
    await writeFile(filePath, Buffer.from(text, 'utf-8'));
    return text;
  } catch (err) {
    throw err;
  }
};
