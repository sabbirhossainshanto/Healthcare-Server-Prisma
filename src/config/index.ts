import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jtw_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_password_secret: process.env.RESET_PASSWORD_SECRET,
  reset_password_expires_in: process.env.RESET_PASSWORD_EXPIRES_IN,
  sender_email: process.env.SENDER_EMAIL,
  app_password: process.env.APP_PASSWORD,
  client_base_url: process.env.CLIENT_BASE_URL,
};
