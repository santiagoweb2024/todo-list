import { NestFactory } from '@nestjs/core'; // **Importa la función para crear la aplicación Nest**
import { AppModule } from './app.module'; // **Importa el módulo principal de la aplicación**
import { ConfigService } from '@nestjs/config'; // **Importa el servicio de configuración**
import { ENV_KEYS } from './shared/constants/envKeys.constant'; // **Importa las claves de entorno**
import { Logger } from '@nestjs/common'; // **Importa el logger de NestJS**
import { ExceptionFilterAll } from './shared/exceptions/filterException.exception'; // **Importa el filtro de excepciones global**
import { SuccesInterceptor } from './shared/utils/succesInterceptorResponse'; // **Importa el interceptor de éxito**
import { CustomValidationPipe } from './shared/pipes/validationPipe.pipe'; // **Importa el pipe de validación personalizado**
import * as morgan from 'morgan'; // **Importa Morgan para registrar las solicitudes HTTP**

async function bootstrap() {
  // **Crea la instancia de la aplicación NestJS**
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev')); // **Activa el middleware de Morgan para registrar las solicitudes HTTP**

  // **Configura los pipes globales para transformar y validar los datos de entrada**
  app.useGlobalPipes(
    new CustomValidationPipe({
      transform: true, // **Transforma los datos de entrada a los tipos esperados**
      stopAtFirstError: true, // **Detiene la validación al primer error**
    }),
  );

  // **Configura el filtro de excepciones global para manejar errores de manera centralizada**
  app.useGlobalFilters(new ExceptionFilterAll());

  // **Configura el interceptor global para manejar las respuestas exitosas**
  app.useGlobalInterceptors(new SuccesInterceptor());

  // **Obtiene el servicio de configuración para acceder a variables de entorno**
  const configService = app.get(ConfigService);

  // **Define el puerto en el que la aplicación escuchará**
  const port = configService.get(ENV_KEYS.PORT_SERVER) || 3000;

  // **Establece el prefijo global para todas las rutas de la API**
  app.setGlobalPrefix('/api/v1');

  // **Inicia el servidor y registra el mensaje de inicio**
  await app.listen(port, () =>
    new Logger('NestApplication').log(`Application listening on port ${port}`),
  );
}

// **Ejecuta la función bootstrap para iniciar la aplicación**
bootstrap();
