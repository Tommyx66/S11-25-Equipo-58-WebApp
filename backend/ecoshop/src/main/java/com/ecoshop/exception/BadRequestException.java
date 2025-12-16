package com.ecoshop.exception;

/**
 * Excepción personalizada para errores de validación de negocio.
 * 
 * Esta excepción se lanza cuando se produce un error de validación de negocio
 * que debe retornar un código HTTP 400 (Bad Request).
 * 
 */
public class BadRequestException extends RuntimeException {

    /**
     * Construye una nueva excepción con el mensaje especificado.
     * 
     * @param message Mensaje descriptivo del error
     */
    public BadRequestException(String message) {
        super(message);
    }

    /**
     * Construye una nueva excepción con el mensaje y la causa especificados.
     * 
     * @param message Mensaje descriptivo del error
     * @param cause Causa de la excepción (excepción original)
     */
    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}

