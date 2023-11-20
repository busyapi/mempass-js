import { numbers } from "./const";
import { L33t } from "./l33t";
import removeAccents from "remove-accents";
const l33t = new L33t();

export function genFromPassphrase(passphrase: string): string {
  passphrase = preprocess(passphrase);
  const stats = analyze(passphrase);
  const ratio = 1 / 8;
  const min = Math.floor(stats.len * ratio);
  const addUcCount = min - stats.uc;
  const addNumCount = min - stats.num;
  const addScCount = min - stats.sc;

  passphrase = addUc(passphrase, addUcCount, stats.lcPos);
  passphrase = addNums(passphrase, addNumCount, stats.lcPos);
  passphrase = addSc(passphrase, addScCount);

  return passphrase;
}

function preprocess(passphrase: string) {
  passphrase = passphrase.replace(/\s+/g, "-");
  passphrase = passphrase.replace(/-+/g, "-");
  passphrase = removeAccents(passphrase);

  return passphrase;
}

function analyze(input: string) {
  let len = input.length;
  let uc = 0;
  let sc = 0;
  let num = 0;
  let lcPos: number[] = [];

  for (let i = 0; i < len; i++) {
    let char = input[i];

    // Check if character is uppercase
    if (isUpper(char)) {
      uc++;
    }
    // Check if character is a digit
    else if (isNumber(char)) {
      num++;
    }
    // Check if character is lowercase and store its index
    else if (isLower(char)) {
      lcPos.push(i);
    }
    // If character is none of the above, it is a special character
    else {
      sc++;
    }
  }

  return { len, uc, sc, num, lcPos };
}

function addUc(passphrase: string, count: number, lcPos: number[]) {
  const newPassphrase = passphrase.split("");

  if (lcPos.length == 0) {
    return passphrase;
  }

  for (let i = 0; i < count; i++) {
    const j = (lcPos.length * Math.random()) | 0;
    const char = passphrase.charAt(lcPos[j]);

    if (!isLower(char)) {
      i--;
      continue;
    }

    newPassphrase[lcPos[j]] = char.toUpperCase();
    lcPos.splice(j, 1);
  }

  return newPassphrase.join("");
}

function addNums(passphrase: string, count: number, lcPos: number[]) {
  let done = 0;
  const newPassphrase = passphrase.split("");
  const l337able = find1337able(passphrase);

  if (l337able.length > 0) {
    for (let i = 0; i < count; i++) {
      // Get a random position from the l33table characters positions array
      const idx = Math.floor(Math.random() * l337able.length);
      const pos = l337able[idx];

      // Transform the character
      newPassphrase[pos] = l33t.l33tChar(newPassphrase[pos]);

      // Remove the l33ted character from the l33table array
      l337able.splice(idx, 1);

      done++;
    }
  }

  if (done < count) {
    for (let i = done + 1; i <= count; i++) {
      const idx = Math.floor(Math.random() * 10);
      newPassphrase.push(String(numbers[idx]));
    }
  }

  return newPassphrase.join("");
}

function addSc(passphrase: string, count: number) {
  return count > 0 ? passphrase + "-".repeat(count) : passphrase;
}

function find1337able(passphrase: string) {
  const l33table: number[] = [];

  for (let i = 0; i < passphrase.length; i++) {
    if (l33t.can1337(passphrase.charAt(i))) {
      l33table.push(i);
    }
  }

  return l33table;
}

function isUpper(char: string) {
  return char >= "A" && char <= "Z";
}

function isLower(char: string) {
  return char >= "a" && char <= "z";
}

function isNumber(char: string) {
  return char >= "0" && char <= "9";
}
