package com.ecoshop.service.impl;

import com.ecoshop.domain.Certification;
import com.ecoshop.dto.CertificationRequest;
import com.ecoshop.dto.CertificationResponse;
import com.ecoshop.exception.BadRequestException;
import com.ecoshop.mapper.CertificationMapper;
import com.ecoshop.repository.CertificationRepository;
import com.ecoshop.service.CertificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de certificaciones.
 * 
 * Esta clase contiene la lógica de negocio para gestionar certificaciones.
 * Actúa como intermediario entre el controlador (capa de presentación) y
 * el repositorio (capa de acceso a datos).
 * 
 * Responsabilidades:
 * - Convertir entre DTOs y entidades usando el mapper
 * - Manejar transacciones de base de datos
 * - Validar existencia de recursos antes de operaciones
 * - Validar reglas de negocio (ej: unicidad de códigos)
 * - Manejar excepciones de negocio
 * 
 * @Transactional: Todas las operaciones de escritura están dentro de una transacción
 * para garantizar la integridad de los datos. Si ocurre un error, se hace rollback.
 */
@Service // Indica a Spring que esta clase es un componente de servicio (bean de Spring)
@RequiredArgsConstructor // Genera constructor con los campos finales para inyección de dependencias
@Transactional // Todas las operaciones de escritura se ejecutan en una transacción
public class CertificationServiceImpl implements CertificationService {

    // Repositorio para acceder a la base de datos
    private final CertificationRepository certificationRepository;
    
    // Mapper para convertir entre entidades y DTOs
    private final CertificationMapper certificationMapper;

    /**
     * Obtiene todas las certificaciones de la base de datos.
     * 
     * Proceso:
     * 1. Obtiene todas las entidades Certification de la BD
     * 2. Convierte cada entidad a CertificationResponse usando el mapper
     * 3. Retorna la lista de CertificationResponse
     * 
     * @Transactional(readOnly = true): Optimiza la consulta indicando que es solo lectura
     * y evita que se abra una transacción de escritura innecesaria.
     */
    @Override
    @Transactional(readOnly = true) // Solo lectura, no necesita transacción de escritura
    public List<CertificationResponse> findAll() {
        // Stream API para transformar la lista de entidades a CertificationResponse de forma funcional
        return certificationRepository.findAll().stream()
                .map(certificationMapper::toResponse) // Convierte cada Certification a CertificationResponse
                .collect(Collectors.toList()); // Recopila los resultados en una lista
    }

    /**
     * Busca una certificación por su ID.
     * 
     * Proceso:
     * 1. Busca la certificación en la BD
     * 2. Si no existe, lanza una excepción
     * 3. Si existe, la convierte a CertificationResponse y la retorna
     * 
     * @param id Identificador de la certificación
     * @return CertificationResponse de la certificación encontrada
     * @throws EntityNotFoundException si la certificación no existe
     */
    @Override
    @Transactional(readOnly = true)
    public CertificationResponse findById(Long id) {
        // Optional permite manejar el caso cuando la certificación no existe
        Certification certification = certificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Certificación no encontrada con id: " + id));
        return certificationMapper.toResponse(certification);
    }

    /**
     * Busca una certificación por su código único.
     * 
     * Proceso:
     * 1. Busca la certificación en la BD por código
     * 2. Si no existe, lanza una excepción
     * 3. Si existe, la convierte a CertificationResponse y la retorna
     * 
     * @param code Código único de la certificación
     * @return CertificationResponse de la certificación encontrada
     * @throws EntityNotFoundException si la certificación no existe
     */
    @Override
    @Transactional(readOnly = true)
    public CertificationResponse findByCode(String code) {
        // Normalizamos el código para búsqueda case-insensitive
        String normalizedCode = code != null ? code.trim().toUpperCase() : null;
        
        // Buscamos la certificación usando búsqueda case-insensitive para ser consistente
        // con el resto del código que normaliza los códigos a mayúsculas
        Certification certification = certificationRepository.findByCodeIgnoreCase(normalizedCode)
                .orElseThrow(() -> new EntityNotFoundException("Certificación no encontrada con código: " + code));
        return certificationMapper.toResponse(certification);
    }

    /**
     * Crea una nueva certificación en la base de datos.
     * 
     * Proceso:
     * 1. Normaliza el código (trim) para eliminar espacios en blanco extremos
     * 2. Valida que no exista otra certificación con el mismo código
     * 3. Si el código ya existe, lanza BadRequestException
     * 4. Convierte el DTO a entidad usando el mapper
     * 5. Guarda la entidad en la BD (JPA asigna automáticamente el ID)
     * 6. Convierte la entidad guardada a CertificationResponse y la retorna
     * 
     * @param request Datos de la certificación a crear
     * @return CertificationResponse de la certificación creada
     * @throws BadRequestException si ya existe una certificación con el mismo código
     */
    @Override
    public CertificationResponse create(CertificationRequest request) {
        // Normalizamos el código: eliminamos espacios en blanco extremos y convertimos a mayúsculas
        // Esto asegura consistencia en la base de datos
        String normalizedCode = request.getCode() != null ? request.getCode().trim().toUpperCase() : null;
        
        // Validamos que no exista otra certificación con el mismo código (case-insensitive)
        if (certificationRepository.existsByCodeIgnoreCase(normalizedCode)) {
            throw new BadRequestException("Ya existe una certificación con el código: " + normalizedCode);
        }
        
        // Convertimos el DTO a entidad usando el mapper
        Certification certification = certificationMapper.toEntity(request);
        
        // Aseguramos que el código esté normalizado (mayúsculas) en la entidad
        certification.setCode(normalizedCode);
        
        // Guardamos en BD (JPA asigna el ID automáticamente)
        Certification savedCertification = certificationRepository.save(certification);
        
        // Convertimos de vuelta a DTO para retornar al controlador
        return certificationMapper.toResponse(savedCertification);
    }

    /**
     * Actualiza una certificación existente.
     * 
     * Proceso:
     * 1. Busca la certificación por ID, si no existe lanza EntityNotFoundException
     * 2. Normaliza el código (trim) para eliminar espacios en blanco extremos
     * 3. Si el código se cambia, valida que no duplique otra certificación
     * 4. Actualiza la entidad con los nuevos datos usando el mapper
     * 5. Guarda los cambios en la BD
     * 6. Convierte la entidad actualizada a CertificationResponse y la retorna
     * 
     * @param id ID de la certificación a actualizar
     * @param request Nuevos datos de la certificación
     * @return CertificationResponse de la certificación actualizada
     * @throws EntityNotFoundException si la certificación no existe
     * @throws BadRequestException si el nuevo código ya existe en otra certificación
     */
    @Override
    public CertificationResponse update(Long id, CertificationRequest request) {
        // Buscamos la certificación existente
        Certification existingCertification = certificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Certificación no encontrada con id: " + id));
        
        // Preservamos la fecha de creación original antes de actualizar
        // Esto es importante porque createdAt no debe cambiar al actualizar una certificación
        java.time.LocalDateTime createdAtOriginal = existingCertification.getCreatedAt();
        
        // Normalizamos el código: eliminamos espacios en blanco extremos y convertimos a mayúsculas
        // Esto asegura consistencia en la base de datos
        String normalizedCode = request.getCode() != null ? request.getCode().trim().toUpperCase() : null;
        
        // Normalizamos el código existente para comparar correctamente
        String existingCodeNormalized = existingCertification.getCode() != null 
                ? existingCertification.getCode().trim().toUpperCase() 
                : null;
        
        // Si el código se cambia, validamos que no duplique otra certificación (case-insensitive)
        if (!existingCodeNormalized.equals(normalizedCode)) {
            if (certificationRepository.existsByCodeIgnoreCase(normalizedCode)) {
                throw new BadRequestException("Ya existe una certificación con el código: " + normalizedCode);
            }
        }
        
        // Actualizamos la entidad con los nuevos datos usando el mapper
        certificationMapper.updateEntity(existingCertification, request);
        
        // Aseguramos que el código esté normalizado (mayúsculas) en la entidad
        existingCertification.setCode(normalizedCode);
        
        // Aseguramos que createdAt se mantenga con su valor original
        // Esto previene que se sobrescriba con un nuevo timestamp si el mapper crea uno incorrecto
        existingCertification.setCreatedAt(createdAtOriginal);
        
        // Guardamos los cambios (JPA detecta que tiene ID y actualiza en lugar de crear)
        Certification updatedCertification = certificationRepository.save(existingCertification);
        
        // Convertimos de vuelta a DTO para retornar al controlador
        return certificationMapper.toResponse(updatedCertification);
    }

    /**
     * Elimina una certificación de la base de datos.
     * 
     * Proceso:
     * 1. Verifica que la certificación exista
     * 2. Si existe, la elimina de la BD
     * 3. Si no existe, lanza una excepción
     * 
     * Nota: Verificamos existencia antes de eliminar para dar un mensaje de error
     * más claro. También podríamos dejar que JPA lance la excepción, pero este
     * enfoque nos da más control sobre el mensaje de error.
     * 
     * @param id Identificador de la certificación a eliminar
     * @throws EntityNotFoundException si la certificación no existe
     */
    @Override
    public void delete(Long id) {
        // Verificamos existencia antes de eliminar para un mejor mensaje de error
        if (!certificationRepository.existsById(id)) {
            throw new EntityNotFoundException("Certificación no encontrada con id: " + id);
        }
        // Eliminamos la certificación de la BD
        certificationRepository.deleteById(id);
    }
}
