import { Module } from '@nestjs/common'; // **Importa el decorador Module de NestJS para definir un módulo**
import { MailService } from './mail.service'; // **Importa el servicio MailService para enviar correos electrónicos**

/**
 * **MailModule** define el módulo para la gestión del envío de correos electrónicos.
 * Este módulo proporciona el servicio necesario para enviar correos a través de la API de Resend.
 */
@Module({
  // **Proveedores de este módulo**: Servicios que se proporcionan y gestionan dentro del módulo.
  providers: [MailService], // **Servicio para el envío de correos electrónicos**

  // **Exportaciones de este módulo**: Servicios que se deben exportar para ser utilizados en otros módulos.
  exports: [MailService], // **Permite que otros módulos importen y utilicen el servicio MailService**
})
export class MailModule {}
