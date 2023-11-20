/*
  This comes from https://www.multicians.org/thvv/gpw.js
  
  GPW - Generate pronounceable passwords
  This program uses statistics on the frequency of three-letter sequences
  in English to generate passwords.  The statistics are
  generated from your dictionary by the program load_trigram.

  See www.multicians.org/thvv/gpw.html for history and info.
  Tom Van Vleck

  THVV 06/01/94 Coded
  THVV 04/14/96 converted to Java
  THVV 07/30/97 fixed for Netscape 4.0
  THVV 11/27/09 ported to Javascript
*/

import { alphabet } from "./const";
import { Options } from "./types";

/*
  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:
  
  The above copyright notice and this permission notice shall be included
  in all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/

export async function getRandPwd(opt: Options): Promise<string[]> {
  const words: string[] = [];

  for (let i = 0; i < opt.wordCount; i++) {
    let wl: number;
    const count = opt.maxWordLength - opt.minWordLength;

    if (count == 0) {
      wl = opt.minWordLength;
    } else {
      wl = opt.minWordLength + Math.floor(Math.random() * count);
    }

    words.push(await genWord(wl));
  }

  return words;
}

async function genWord(pwl: number) {
  let output = "";
  let c1, c2, c3;
  let sum = 0;
  let nchar;
  let ranno;
  let pik;

  // letter frequencies
  const trigrams = (await import("./rands/rand-en")).default;

  // Pick a random starting point.
  pik = Math.random(); // random number [0,1]
  ranno = pik * 125729.0;
  sum = 0;
  for (c1 = 0; c1 < 26; c1++) {
    for (c2 = 0; c2 < 26; c2++) {
      for (c3 = 0; c3 < 26; c3++) {
        sum += trigrams[c1][c2][c3];
        if (sum > ranno) {
          output += alphabet.charAt(c1);
          output += alphabet.charAt(c2);
          output += alphabet.charAt(c3);
          c1 = 26; // Found start. Break all 3 loops.
          c2 = 26;
          c3 = 26;
        } // if sum
      } // for c3
    } // for c2
  } // for c1
  // Now do a random walk.
  nchar = 3;
  while (nchar < pwl) {
    c1 = alphabet.indexOf(output.charAt(nchar - 2));
    c2 = alphabet.indexOf(output.charAt(nchar - 1));
    sum = 0;
    for (c3 = 0; c3 < 26; c3++) sum += trigrams[c1][c2][c3];
    if (sum == 0) {
      //alert("sum was 0, outut="+output);
      break; // exit while loop
    }
    //pik = ran.nextDouble();
    pik = Math.random();
    ranno = pik * sum;
    sum = 0;
    for (c3 = 0; c3 < 26; c3++) {
      sum += trigrams[c1][c2][c3];
      if (sum > ranno) {
        output += alphabet.charAt(c3);
        c3 = 26; // break for loop
      } // if sum
    } // for c3
    nchar++;
  } // while nchar

  return output;
}
