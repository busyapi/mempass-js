import { Options } from "./types";

export async function getDictPwd(opt: Options): Promise<string[]> {
  let dict: string[][] = (await import("./dicts/dict-en")).default as string[][];
  dict = dict.slice(opt.minWordLength, opt.maxWordLength + 1);
  const words: string[] = [];

  for (let i = 0; i < opt.wordCount; i++) {
    const idx1 = Math.floor(Math.random() * dict.length);
    if (!dict[idx1]) {
      i--;
      continue;
    }

    const idx2 = Math.floor(Math.random() * dict[idx1].length);
    words.push(dict[idx1][idx2]);
  }

  return words;
}
