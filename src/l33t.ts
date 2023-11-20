export class L33t {
  private leetMap: Map<string, string>;

  constructor() {
    this.leetMap = new Map<string, string>();
    this.leetMap.set("a", "4");
    this.leetMap.set("A", "4");
    this.leetMap.set("e", "3");
    this.leetMap.set("E", "3");
    this.leetMap.set("i", "1");
    this.leetMap.set("I", "1");
    this.leetMap.set("o", "0");
    this.leetMap.set("O", "0");
    this.leetMap.set("s", "5");
    this.leetMap.set("S", "5");
    this.leetMap.set("t", "7");
    this.leetMap.set("T", "7");
  }

  public can1337(char: string) {
    return this.leetMap.has(char);
  }

  public l33tChar(char: string): string {
    if (this.leetMap.has(char)) {
      return this.leetMap.get(char) || char;
    }

    return char;
  }
}
