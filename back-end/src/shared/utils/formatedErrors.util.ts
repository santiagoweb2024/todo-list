import { ValidationError } from '@nestjs/common';

/**
 * **formatErrors** toma una lista de errores de validación y los convierte en un formato amigable.
 * @param validationErrors Lista de errores de validación de class-validator.
 * @returns Un objeto que contiene errores formateados por campo.
 */
export function formatErrors(validationErrors: ValidationError[]): {
  [key: string]: string[];
} {
  // **Inicializa un objeto vacío** que almacenará los errores formateados por campo.
  const errors: { [key: string]: string[] } = {};

  // **Itera sobre cada error** de validación en la lista.
  validationErrors.forEach((error) => {
    // **Desestructura** el objeto de error para obtener la propiedad y las restricciones.
    const { property, constraints } = error;

    // **Verifica si hay restricciones** (errores específicos) para esta propiedad.
    if (constraints) {
      // **Asigna las restricciones** (errores) a la propiedad correspondiente en el objeto `errors`.
      // `Object.values(constraints)` convierte el objeto de restricciones en un array de mensajes de error.
      errors[property] = Object.values(constraints);
    }
  });

  // **Devuelve el objeto `errors`** que contiene todos los errores formateados por campo.
  return errors;
}
