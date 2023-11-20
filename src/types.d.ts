export type Mode = "dict" | "rand" | "passphrase";
export type CapRule =
  | "none"
  | "all"
  | "alternate"
  | "word_alternate"
  | "first_letter"
  | "last_letter"
  | "all_but_first_letter"
  | "all_but_last_letter"
  | "random";
export type SepRule = "none" | "fixed" | "random";
export type SymbRule = "none" | "fixed" | "random";
export type PadRule = "none" | "fixed" | "random";
export type Options = {
  mode: Mode; // Generation mode. Default is `ModeDict`
  passphrase?: string; // User passphrase. Only used if `Mode` is `passphrase`
  wordCount: number; // Number of words to generate. Using less than 2 is discouraged. Default is 3
  minWordLength: number; // Minimum word length. 0 = no minimum. Using less than 4 is discouraged. Default is 6
  maxWordLength: number; // Maximum word length. 0 = no maximum. Default is 8
  digitsAfter: number; // Number of digits to add at the end of each word. Default is 0
  digitsBefore: number; // Number of digits to add at the beginning of each word. Default is 0
  capRule: CapRule; // Capitalization rule. Default is `CapRuleNone`
  capRatio: number; // Uppercase ratio. 0.0 = no uppercase, 1.0 = all uppercase, 0.3 = 1/3 uppercase, etc. Only used if `CapRule` is `CapRandom`. Default is 0.2
  symbRule: SymbRule; // Rule for adding symbols. Default is `SymbRuleNone`
  symbolsAfter: number; // Number of symbols to add at the end of each word. Default is 0
  symbolsBefore: number; // Number of symbols to add at the beginning of each word. Default is 0
  symbolPool: string; // Symbols pool. Only used if `SymbRule` is `SymbRuleRandom`. Default is "@&!-_^$*%,.;:/=+"
  symbol: string; // Symbol character. Only used if `SymbRule` is `SymbRuleFixed`. Default is `/`
  sepRule: SepRule; // Separator type. Default is `SepRuleFixed`
  separatorPool: string; // Separators pool. Only used if `SepRule` is `SepRuleRandom`. Default is "@&!-_^$*%,.;:/=+"
  separator: string; // Separator for words. Only used if `SepRule` is `SepRuleFixed`. Default is '-'
  padRule: PadRule; // Padding rule. Ignored if `PadLength` is 0
  padSymbol: string; // Padding symbol. Only used if `PadRule` is `PadRuleFixed`. Default is `.`
  padLength: number; // Password length to reach with padding.
  l33tRatio: number; // 1337 coding ratio. 0.0 = no 1337, 1.0 = all 1337, 0.3 = 1/3 1337, etc. Default is 0
  calculateEntropy: boolean; // Calculate entropy. Default is false
};
export type GenResult = {
  pwd: string;
  entropy: number;
};
