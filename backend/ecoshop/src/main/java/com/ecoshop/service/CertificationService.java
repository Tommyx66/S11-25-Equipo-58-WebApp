package com.ecoshop.service;

import com.ecoshop.dto.CertificationRequest;
import com.ecoshop.dto.CertificationResponse;

import java.util.List;

/**
 * Interfaz del servicio de certificaciones.
 * 
 * Define el contrato para las operaciones de negocio relacionadas con certificaciones.
 * Esta interfaz separa la definición de las operaciones de su implementación,
 * permitiendo cambiar la implementación sin afectar a los clientes (controladores).
 * 
 * Responsabilidades:
 * - Definir las operaciones CRUD (Create, Read, Update, Delete) para certificaciones
 * - Trabajar con DTOs en lugar de entidades para mantener desacoplamiento
 * - Manejar la lógica de negocio relacionada con certificaciones
 */
public interface CertificationService {
    
    /**
     * Obtiene todas las certificaciones existentes.
     * 
     * @return Lista de todas las certificaciones convertidas a CertificationResponse
     */
    List<CertificationResponse> findAll();
    
    /**
     * Busca una certificación por su ID.
     * 
     * @param id Identificador único de la certificación
     * @return Certificación encontrada convertida a CertificationResponse
     * @throws jakarta.persistence.EntityNotFoundException si la certificación no existe
     */
    CertificationResponse findById(Long id);
    
    /**
     * Busca una certificación por su código único.
     * 
     * @param code Código único de la certificación
     * @return Certificación encontrada convertida a CertificationResponse
     * @throws jakarta.persistence.EntityNotFoundException si la certificación no existe
     */
    CertificationResponse findByCode(String code);
    
    /**
     * Crea una nueva certificación en la base de datos.
     * 
     * @param request Datos de la certificación a crear
     * @return Certificación creada convertida a CertificationResponse
     * @throws com.ecoshop.exception.BadRequestException si ya existe una certificación con el mismo código
     */
    CertificationResponse create(CertificationRequest request);
    
    /**
     * Actualiza una certificación existente.
     * 
     * @param id Identificador único de la certificación a actualizar
     * @param request Nuevos datos de la certificación
     * @return Certificación actualizada convertida a CertificationResponse
     * @throws jakarta.persistence.EntityNotFoundException si la certificación no existe
     * @throws com.ecoshop.exception.BadRequestException si el nuevo código ya existe en otra certificación
     */
    CertificationResponse update(Long id, CertificationRequest request);
    
    /**
     * Elimina una certificación de la base de datos.
     * 
     * @param id Identificador único de la certificación a eliminar
     * @throws jakarta.persistence.EntityNotFoundException si la certificación no existe
     */
    void delete(Long id);
}

