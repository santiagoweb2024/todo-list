import { ENV_KEYS } from '@/shared/constants/envKeys.constant';
import { REGISTER_AS_CONFIG_NAMES } from '@/shared/constants/registerAsConfigNames';
import { registerAs } from '@nestjs/config';

export default registerAs(REGISTER_AS_CONFIG_NAMES.DATABASE, () => ({
  type: ENV_KEYS.DB_TYPE,
  url: ENV_KEYS.URI_DATABASE,
}));
