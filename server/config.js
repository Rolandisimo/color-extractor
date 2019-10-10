const { cleanEnv, str, num } = require("envalid");

const env = cleanEnv(
  process.env,
  {
    NODE_ENV: str({
      choices: ["production", "development", "test"],
      default: "development",
    }),
    PORT: num({
      default: 3001,
    }),
  },
);

module.exports = env;
