const Environment = {
  Development: "development",
  Production: "production",
  Staging: "staging",
}

let baseUrl = "http://localhost:3001";
if (process.env.NODE_ENV === Environment.Production) {
  baseUrl = "";
}

export const BASE_URL = baseUrl;

export const COLORS = "/colors";
