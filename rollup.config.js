const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const resolve = require("@rollup/plugin-node-resolve").default;
const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser").default;
const dts = require("rollup-plugin-dts").default;
const pkg = require("./package.json");

module.exports = [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/__tests__/**", "**/*.test.ts", "**/*.spec.ts"],
      }),
      terser(),
    ],
    external: ["react", "react-dom", "uuid"],
  },
  {
    input: "dist/index.d.ts", // <- the generated declarations from first build
    output: [{ file: "dist/typed.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];
