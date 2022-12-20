import fetch from 'node-fetch';
import { readFileText, writeToFile } from './file';

export const fetchInput = async (year: number, day: number) => {
  try {
    const url = `https://adventofcode.com/${year}/day/${day}/input`;
    console.log(`GET - ${url}`);
    const response = await fetch(url, {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'sec-ch-ua':
          '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        cookie: process.env.COOKIES,
      },
      body: null,
      method: 'GET',
    });
    if (response.status > 200) {
      throw new Error(response.status.toString());
    }
    console.log('Success ' + response.status);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getRawInput = async (
  inputPath: string,
  year: number,
  day: number
) => {
  let rawInput = '';
  try {
    rawInput = await readFileText(inputPath);
  } catch (noFileErr) {
    try {
      console.log(`\nNo file found for Day ${day}`);
      const response = await fetchInput(year, day);
      rawInput = await response.text();
      await writeToFile(inputPath, rawInput);
    } catch (err) {
      console.log('Oh dear!');
      throw new Error(err.message);
    }
  }
  return rawInput;
};
