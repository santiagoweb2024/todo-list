import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from './shared/constants/envKeys.constant';
import { Logger } from '@nestjs/common';
import { ExeptionFilterAll } from './shared/utils/filterExeption.util';
import { SuccesInterceptor } from './shared/utils/succesInterceptorResponse';
import { CustomValidationPipe } from './shared/pipes/validationPipe.pipe';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* app.useGlobalPipes(new ValidationPipe()); */
  app.useGlobalPipes(
    new CustomValidationPipe({
      transform: true,
      stopAtFirstError: false,
    }),
  );
  app.useGlobalFilters(new ExeptionFilterAll());
  app.useGlobalInterceptors(new SuccesInterceptor());
  const configService = app.get(ConfigService);
  const port = configService.get(ENV_KEYS.PORT_SERVER) || 3000;
  await app.listen(port, () =>
    new Logger('NestApplication').log(`Application listening on port ${port}`),
  );
}
bootstrap();
