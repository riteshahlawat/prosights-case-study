import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    webpack: (config, _context) => {
        config.resolve.alias["jotai"] = path.resolve(
            __dirname,
            "node_modules/jotai",
        );
        return config;
    },
};

export default config;
