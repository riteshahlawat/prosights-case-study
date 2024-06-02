/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    plugins: [
        "prettier-plugin-tailwindcss",
        "prettier-plugin-organize-imports",
    ],
    tabWidth: 4,
};

export default config;
