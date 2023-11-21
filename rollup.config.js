import typescript from "rollup-plugin-typescript";
import del from "rollup-plugin-delete";

export default [
  {
    input: "src/mempass.ts",
    plugins: [typescript(), del({ targets: "dist/*" })],
    output: [
      {
        dir: "./dist/esm",
        external: ["remove-accent"],
      },
      {
        dir: "./dist/cjs",
        external: ["remove-accent"],
        format: "cjs",
      },
    ],
  },
];
