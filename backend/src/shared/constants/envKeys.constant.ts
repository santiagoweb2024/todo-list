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

/**
 * Configuracion general de la aplicaci n
 */
export const config = {
  /**
   * Configuracion de la base de datos
   */
  database: {
    /**
     * Tipo de base de datos (postgres, mysql, etc.)
     */
    type: process.env[EnvVariables.DB_TYPE],
    /**
     * URI de la base de datos
     */
    uri: process.env[EnvVariables.URI_DATABASE],
  },
  /**
   * Configuracion de los tokens JWT
   */
  jwt: {
    /**
     * Secreto para la verificacion de cuentas
     */
    secretVerification:
      process.env[EnvVariables.JWT_SECRET_VERIFICATION_ACCOUNT],
    /**
     * Secreto para la autenticacion
     */
    secretAuth: process.env[EnvVariables.JWT_SECRET_AUTHENTICATION],
    /**
     * Secreto para el restablecimiento de contraseñas
     */
    secretResetPassword: process.env[EnvVariables.JWT_SECRET_RESET_PASSWORD],
    /**
     * Tiempo de expiracion para el restablecimiento de contraseñas en segundos
     */
    expirationResetPassword: 3600,
    /**
     * Tiempo de expiracion para la verificacion de cuentas en segundos
     */
    expirationVerification: 3600,
    /**
     * Tiempo de expiracion para la autenticacion
     */
    expirationAuth: 3600,
  },
  /**
   * Configuracion para el envio de correos electronicos
   */
  resendApiKey: process.env[EnvVariables.RESEND_API_KEY],
};
