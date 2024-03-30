module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "google",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["tsconfig.json", "./test/tsconfig.json"],
        sourceType: "module",
        ecmaFeatures: {
            experimentalDecorators: true,
        },
    },
    ignorePatterns: [
        "/lib/**/*", // Ignore built files.
        "/build/**/*", // Ignore built files.
        "/dist/**/*", // Ignore built files.
        "/resources/**/*", // Ignore built files.
        "register.js",
        "webpack.config.js",
    ],
    plugins: [
        "@typescript-eslint",
        "import",
    ],
    rules: {
        "quotes": ["error", "double"],
        "import/no-unresolved": 0,
        "indent": "off",
        "@typescript-eslint/indent": ["error", 4],
        "require-jsdoc": 0,
        "max-len": ["error", {"code": 120}],
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": "off",
        "semi": "off",
        "@typescript-eslint/semi": ["error", "always"],
        "arrow-parens": ["error", "as-needed"],
        "linebreak-style": ["error", "unix"],
        "import/no-named-as-default": 0,
    },
};
