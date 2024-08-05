import { registerAs } from '@nestjs/config';
import { ENV_KEYS } from 'src/shared/constants/envKeys.constant';
import { REGISTER_AS_CONFIG_NAMES } from 'src/shared/constants/registerAsConfigNames';

export default registerAs(REGISTER_AS_CONFIG_NAMES.DATABASE, () => ({
  type: ENV_KEYS.DB_TYPE,
  url: ENV_KEYS.URI_DATABASE,
}));
