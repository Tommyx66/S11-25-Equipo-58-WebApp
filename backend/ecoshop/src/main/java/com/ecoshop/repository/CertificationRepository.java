package com.ecoshop.repository;

import com.ecoshop.domain.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para acceder a los datos de certificaciones en la base de datos.
 * 
 * Esta interfaz extiende JpaRepository que proporciona métodos CRUD básicos
 * sin necesidad de implementarlos manualmente. Spring Data JPA genera
 * automáticamente la implementación en tiempo de ejecución.
 * 
 * Ventajas de usar Spring Data JPA:
 * - No necesitamos escribir código SQL manualmente
 * - Spring genera automáticamente las consultas
 * - Métodos tipo-safe (tipado seguro)
     * - Facilita las pruebas unitarias
 * - Soporte para paginación y ordenamiento
 * 
 * Genéricos:
 * - Certification: Tipo de entidad
 * - Long: Tipo del ID de la entidad
 */
@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    
    /**
     * Busca una certificación por su código único.
     * 
     * La búsqueda es case-sensitive. Para una búsqueda case-insensitive,
     * usar findByCodeIgnoreCase().
     * 
     * @param code Código único de la certificación
     * @return Optional con la certificación encontrada, o vacío si no existe
     */
    Optional<Certification> findByCode(String code);
    
    /**
     * Busca una certificación por su código único sin distinguir mayúsculas/minúsculas.
     * 
     * Útil cuando los códigos pueden venir en diferentes formatos pero representan
     * la misma certificación.
     * 
     * @param code Código único de la certificación (case-insensitive)
     * @return Optional con la certificación encontrada, o vacío si no existe
     */
    @Query("SELECT c FROM Certification c WHERE UPPER(TRIM(c.code)) = UPPER(TRIM(:code))")
    Optional<Certification> findByCodeIgnoreCase(@Param("code") String code);
    
    /**
     * Verifica si existe una certificación con el código especificado.
     * 
     * @param code Código único de la certificación
     * @return true si existe, false en caso contrario
     */
    boolean existsByCode(String code);
    
    /**
     * Verifica si existe una certificación con el código especificado sin distinguir mayúsculas/minúsculas.
     * 
     * @param code Código único de la certificación (case-insensitive)
     * @return true si existe, false en caso contrario
     */
    @Query("SELECT COUNT(c) > 0 FROM Certification c WHERE UPPER(TRIM(c.code)) = UPPER(TRIM(:code))")
    boolean existsByCodeIgnoreCase(@Param("code") String code);
}

