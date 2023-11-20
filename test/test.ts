import { Generator } from "../src/mempass";

(async function () {
  const dictGen = new Generator({
    mode: "dict",
    calculateEntropy: true,
    // wordCount: 5,
    // capRule: "random",
    // minWordLength: 10,
    // maxWordLength: 20,
    // digitsAfter: 2,
    // digitsBefore: 3,
    // symbolsAfter: 1,
    // symbolsBefore: 2,
    // symbRule: "random",
    // l33tRatio: 0.5,
    // padRule: "fixed",
    // padSymbol: "_",
    // padLength: 100,
  });
  let pwd = await dictGen.genPassword();
  console.log(pwd);

  const randGen = new Generator({
    mode: "rand",
    calculateEntropy: true,
    // wordCount: 5,
    // capRule: "random",
    // minWordLength: 10,
    // maxWordLength: 20,
    // digitsAfter: 2,
    // digitsBefore: 3,
    // symbolsAfter: 1,
    // symbolsBefore: 2,
    // symbRule: "random",
    // l33tRatio: 0.5,
    // padRule: "fixed",
    // padSymbol: "_",
    // padLength: 100,
  });
  pwd = await randGen.genPassword();
  console.log(pwd);

  const phraseGen = new Generator({
    mode: "passphrase",
    passphrase: "A very strong password indeed",
    calculateEntropy: true,
  });
  pwd = await phraseGen.genPassword();
  console.log(pwd);
})();
