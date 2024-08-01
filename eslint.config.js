import babelParser from "@babel/eslint-parser";

export default [
    {
        files: ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.jsx", "**/*.tsx"],
        languageOptions: {
            parser: babelParser
        }
    }
];