export const env = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI as string,
  MOOD: process.env.MOOD as string,
  SALT: process.env.SALT as string,
  JWT_KEY: process.env.JWT_KEY as string,
  USER_SIGNATURE: process.env.JWT_USER_SIGNATURE as string,
  ADMIN_SIGNATURE: process.env.JWT_ADMIN_SIGNATURE as string,
  ADMIIN_REFRESH_TOKEN: process.env.JWT_ADMIN_REFRESH_SIGNATURE as string,
  USER_REFRESH_TOKEN: process.env.JWT_USER_REFRESH_SIGNATURE as string,
  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASS: process.env.EMAIL_PASS as string,
  BASE_URL: process.env.BASE_URL as string,
  REDIS_URI: process.env.REDIS_URL as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  //s3
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME as string,
  AWS_REGION: process.env.AWS_REGION as string,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  AWS_EXPIRATION_IN: parseInt(
    (process.env.AWS_EXPIRATION_IN as string) || '120',
  ),
};

export default env;
