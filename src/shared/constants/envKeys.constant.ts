import { DatabaseType } from 'typeorm';
import { REGISTER_AS_CONFIG_NAMES } from './registerAsConfigNames';

interface IEnvKeys {
  PORT_SERVER: string;
  PORT: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
  JWT_REFRESH_SECRET: string;
  URI_DATABASE: string;
  DB_TYPE: DatabaseType;
}
export const ENV_KEYS: IEnvKeys = {
  PORT_SERVER: process.env.PORT_SERVER || '3000',
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '24h',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'secret',
  URI_DATABASE: process.env.URI_DATABASE as string,
  DB_TYPE: process.env.DB_TYPE as DatabaseType,
};

export const DATABASE_CONFIG = {
  [REGISTER_AS_CONFIG_NAMES.DATABASE]: {
    type: ENV_KEYS.DB_TYPE,
    url: ENV_KEYS.URI_DATABASE,
  },
};

export enum EnvVariables {
  DB_TYPE = 'DB_TYPE',
  URI_DATABASE = 'URI_DATABASE',
  JWT_SECRET_VERIFICATION_ACCOUNT = 'JWT_SECRET_VERIFICATION_ACCOUNT',
  JWT_SECRET_AUTHENTICATION = 'JWT_SECRET_AUTHENTICATION',
  JWT_SECRET_RESET_PASSWORD = 'JWT_SECRET_RESET_PASSWORD',
  RESEND_API_KEY = 'RESEND_API_KEY',
}

export const config = {
  database: {
    type: process.env[EnvVariables.DB_TYPE],
    uri: process.env[EnvVariables.URI_DATABASE],
  },
  jwt: {
    secretVerification:
      process.env[EnvVariables.JWT_SECRET_VERIFICATION_ACCOUNT],
    secretAuth: process.env[EnvVariables.JWT_SECRET_AUTHENTICATION],
    secretResetPassword: process.env[EnvVariables.JWT_SECRET_RESET_PASSWORD],
    expirationResetPassword: 3600,
    expirationVerification: 3600,
    expirationAuth: 3600,
  },
  resendApiKey: process.env[EnvVariables.RESEND_API_KEY],
};
