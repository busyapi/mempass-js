import typescript from "rollup-plugin-typescript";
import { string } from "rollup-plugin-string";
import del from "rollup-plugin-delete";

export default [
  {
    input: "src/mempass.ts",
    plugins: [
      typescript(), // so Rollup can convert TypeScript to JavaScript
      string({
        include: "**/*.txt",
      }),
      del({ targets: "dist/*" }),
    ],
    output: {
      dir: "./dist",
      external: ["remove-accent"],
    },
  },
];
