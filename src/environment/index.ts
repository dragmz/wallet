import { Environment } from "@pluginTypes/index";

const {
  REACT_APP_GOLDFISH_URL: GOLDFISH_URL = "",
  REACT_APP_FRACTAL_WEBSITE_URL: FRACTAL_WEBSITE_URL = "",
  NODE_ENV: IS_DEV,
} = process.env;

const environment: Environment = {
  GOLDFISH_URL,
  FRACTAL_WEBSITE_URL,
  IS_DEV: IS_DEV === undefined || IS_DEV === "development",
};

export default environment;
