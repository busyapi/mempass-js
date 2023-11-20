import { getDictPwd } from "./dict";
import { L33t } from "./l33t";
import { genFromPassphrase } from "./passphrase";
import { getRandPwd } from "./rand";
import { GenResult, Options } from "./types";

export class Generator {
  private opt: Options;
  private words: string[];
  private l33t: L33t;

  constructor(opt?: Partial<Options>) {
    this.l33t = new L33t();
    this.words = [];
    this.opt = this.setOptions(opt || {});
  }

  async genPassword(): Promise<GenResult> {
    let pwd: string;

    if (this.opt.mode == "passphrase") {
      pwd = genFromPassphrase(this.opt.passphrase as string);
    } else {
      if (this.opt.mode == "rand") {
        this.words = await getRandPwd(this.opt);
      } else if (this.opt.mode == "dict") {
        this.words = await getDictPwd(this.opt);
      }

      this.extraProcess();
      pwd = this.join();

      if (this.opt.padRule != "none") {
        pwd = this.addPwdPadding(pwd);
      }
    }

    return {
      pwd,
      entropy: this.opt.calculateEntropy ? this.entropy(pwd) : 0,
    };
  }

  private setOptions(opt: Partial<Options>): Options {
    const options: Options = {
      mode: opt.mode || "dict",
      passphrase: opt.passphrase,
      wordCount: opt.wordCount || 3,
      minWordLength: opt.minWordLength || 6,
      maxWordLength: opt.maxWordLength || (opt.minWordLength ? 28 : 8),
      digitsAfter: opt.digitsAfter || 0,
      digitsBefore: opt.digitsBefore || 0,
      capRule: opt.capRule || "first_letter",
      capRatio: opt.capRatio || 0.2,
      symbRule: opt.symbRule || "none",
      symbolsAfter: opt.symbolsAfter || 0,
      symbolsBefore: opt.symbolsBefore || 0,
      symbolPool: opt.symbolPool || "@&!-_^$*%,.;:/=+",
      symbol: opt.symbol || "/",
      sepRule: opt.sepRule || "fixed",
      separatorPool: opt.separatorPool || "@&!-_^$*%,.;:/=+",
      separator: opt.separator || "-",
      padRule: opt.padRule || "none",
      padSymbol: opt.padSymbol || ".",
      padLength: opt.padLength || 0,
      l33tRatio: opt.l33tRatio || 0.2,
      calculateEntropy: opt.calculateEntropy || false,
    };

    if (options.minWordLength > 28 || options.maxWordLength > 28) {
      throw new Error("`minWordLength` and `maxWordLength` cannot be greater than 28");
    }

    if (options.minWordLength > options.maxWordLength) {
      throw new Error("minWordLength` cannot be greater than `maxWordLength`");
    }

    if (options.capRule == "random" && (options.capRatio <= 0 || options.capRatio >= 1)) {
      throw new Error("`capRatio` must be between 0 and 1 excluded");
    }

    if (options.l33tRatio < 0 || options.l33tRatio > 1) {
      throw new Error("`l33tRatio` must be between 0 and 1 included");
    }

    if (options.mode == "passphrase" && !options.passphrase) {
      throw new Error("You must provide a phassphrase");
    }

    return options;
  }

  private extraProcess() {
    for (let i = 0; i < this.words.length; i++) {
      if (this.opt.capRule != "none") {
        this.words[i] = this.capWord(this.words[i], i);
      }

      if (this.opt.digitsAfter > 0 || this.opt.digitsBefore > 0) {
        this.words[i] = this.addDigits(this.words[i]);
      }

      if (this.opt.symbRule != "none") {
        this.words[i] = this.addSymbols(this.words[i]);
      }

      if (this.opt.l33tRatio > 0) {
        this.words[i] = this.l33tWord(this.words[i]);
      }
    }
  }

  private capWord(word: string, i: number) {
    let newWord: string;

    switch (this.opt.capRule) {
      case "all":
        newWord = word.toUpperCase();
        break;

      case "all_but_first_letter":
        newWord = word.charAt(0) + word.slice(1).toUpperCase();
        break;

      case "all_but_last_letter":
        newWord = word.charAt(0) + word.slice(1, -1).toUpperCase() + word.slice(-1);
        break;

      case "alternate":
        newWord = word
          .split("")
          .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c))
          .join("");
        break;

      case "first_letter":
        newWord = word.charAt(0).toUpperCase() + word.slice(1);
        break;

      case "last_letter":
        newWord = word.slice(0, -1) + word.slice(-1).toUpperCase();
        break;

      case "random":
        newWord = word
          .split("")
          .map((c) => (Math.random() < this.opt.capRatio ? c.toUpperCase() : c))
          .join("");
        break;

      case "word_alternate":
        newWord = i % 2 == 0 ? word.toUpperCase() : word;
        break;

      default:
        newWord = word;
        break;
    }

    return newWord;
  }

  private addDigits(word: string) {
    return this.addRandomWordPadding(word, "0123456789", this.opt.digitsAfter, this.opt.digitsBefore);
  }

  private addSymbols(word: string) {
    let padBefore, padAfter: string;

    if (this.opt.symbRule == "random") {
      padBefore = this.genRandomString(this.opt.symbolPool, this.opt.symbolsBefore);
      padAfter = this.genRandomString(this.opt.symbolPool, this.opt.symbolsAfter);
    } else {
      padBefore = this.opt.symbol.repeat(this.opt.symbolsBefore);
      padAfter = this.opt.symbol.repeat(this.opt.symbolsAfter);
    }

    return this.addPadding(word, padBefore, padAfter);
  }

  private addPadding(word: string, padBefore: string, padAfter: string) {
    if (padBefore != "") {
      word = `${padBefore}${word}`;
    }

    if (padAfter != "") {
      word = `${word}${padAfter}`;
    }

    return word;
  }

  private addRandomWordPadding(word: string, source: string, na: number, nb: number) {
    if (nb > 0) {
      word = `${this.genRandomString(source, nb)}${word}`;
    }

    if (na > 0) {
      word = `${word}${this.genRandomString(source, na)}`;
    }

    return word;
  }

  private genRandomString(source: string, count: number) {
    let pad = "";

    for (let i = 0; i < count; i++) {
      pad += source.charAt(Math.floor(Math.random() * source.length));
    }

    return pad;
  }

  private join() {
    if (this.opt.sepRule != "none") {
      return this.addSeparator(
        this.opt.sepRule == "fixed" ? this.opt.separator : this.genRandomString(this.opt.separatorPool, 1)
      );
    }

    return this.words.join("");
  }

  private addSeparator(separator: string) {
    return this.words.join(separator);
  }

  private l33tWord(word: string) {
    return word
      .split("")
      .map((c) => (Math.random() < this.opt.l33tRatio ? this.l33t.l33tChar(c) : c))
      .join("");
  }

  private addPwdPadding(pwd: string) {
    let padding: string;
    let count = this.opt.padLength - pwd.length;

    if (count <= 0) {
      return pwd;
    }

    if (this.opt.padRule == "random") {
      padding = this.genRandomString(this.opt.symbolPool, count);
    } else {
      padding = this.opt.padSymbol.repeat(count);
    }

    return this.addPadding(pwd, "", padding);
  }

  private entropy(pwd: string) {
    let charRange = 26;
    let usedSymbols = "";

    if (this.opt.capRule != "none") {
      charRange *= 2;
    }
    if ((this.opt.symbolsAfter > 0 || this.opt.symbolsBefore > 0) && this.opt.symbRule != "none") {
      usedSymbols = this.opt.symbRule == "fixed" ? this.opt.symbol : this.opt.symbolPool;
    }

    if (this.opt.sepRule != "none") {
      usedSymbols = this.mergeString(usedSymbols, this.opt.sepRule == "fixed" ? this.opt.symbol : this.opt.symbolPool);
    }

    if (this.opt.padRule != "none") {
      usedSymbols = this.mergeString(
        usedSymbols,
        this.opt.padRule == "fixed" ? this.opt.padSymbol : this.opt.symbolPool
      );
    }

    charRange += usedSymbols.length;

    return Math.log2(Math.pow(charRange, pwd.length));
  }

  private mergeString(dest: string, src: string) {
    let destChars = new Map<string, true>();
    for (let i = 0; i < dest.length; i++) {
      destChars.set(dest.charAt(i), true);
    }

    let res = dest;

    for (let i = 0; i < src.length; i++) {
      const char = src.charAt(i);
      if (!destChars.get(char)) {
        res += char;
      }
    }

    return res;
  }
}
