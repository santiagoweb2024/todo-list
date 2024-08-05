import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from './shared/constants/envKeys.constant';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get(ENV_KEYS.PORT_SERVER) || 3000;
  await app.listen(port, () =>
    console.log(`Server is running on port ${port}`),
  );
}
bootstrap();
