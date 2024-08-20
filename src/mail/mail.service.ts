import { Injectable } from '@nestjs/common'; // **Importa el decorador Injectable de NestJS para definir el servicio**
import { Resend } from 'resend'; // **Importa la clase Resend para enviar correos electrónicos usando el servicio Resend**

/**
 * **MailService** es un servicio que utiliza la API de Resend para enviar correos electrónicos.
 * Este servicio encapsula la lógica para la creación y envío de correos electrónicos.
 */
@Injectable()
export class MailService {
  // **Instancia de Resend utilizada para interactuar con la API de Resend**
  private readonly resend: Resend;

  /**
   * **Constructor** inicializa la instancia de Resend con la clave API del entorno.
   */
  constructor() {
    // **Inicializa la instancia de Resend con la clave API almacenada en las variables de entorno**
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  /**
   * **sendEmail** envía un correo electrónico utilizando el servicio de Resend.
   *
   * @param to - La dirección de correo electrónico del destinatario.
   * @param subject - El asunto del correo electrónico.
   * @param html - El contenido HTML del correo electrónico.
   * @returns Los datos de la respuesta del servicio de Resend.
   * @throws Error - Lanza una excepción si ocurre un error durante el envío del correo electrónico.
   */
  async sendEmail(to: string, subject: string, html: string) {
    // **Envía el correo electrónico usando el servicio de Resend**
    const { data, error } = await this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // **Dirección de correo electrónico del remitente**
      to: [to], // **Dirección de correo electrónico del destinatario**
      subject, // **Asunto del correo electrónico**
      html, // **Contenido HTML del correo electrónico**
    });

    // **Maneja errores si ocurren durante el envío del correo electrónico**
    if (error) {
      console.log(error); // **Imprime el error en la consola para depuración**
      throw new Error(error.message); // **Lanza una excepción con el mensaje de error**
    }

    // **Devuelve los datos de la respuesta del servicio de Resend**
    return data;
  }
}
