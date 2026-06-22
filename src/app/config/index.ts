import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  database_url: process.env.DATABASE_URLs,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  app_url: process.env.APP_URL,

  jwt: {
    access_token: process.env.JWT_ACCESS_TOKEN as string,
    refresh_token: process.env.JWT_REFRESH_TOKEN as string,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as string,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
  },
};
