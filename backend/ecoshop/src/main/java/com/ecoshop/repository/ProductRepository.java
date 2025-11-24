package com.ecoshop.repository;

import com.ecoshop.domain.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para acceder a los datos de productos en la base de datos.
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
 * - Product: Tipo de entidad
 * - Long: Tipo del ID de la entidad
 */
@Repository // Indica a Spring que esta interfaz es un repositorio (bean de Spring)
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * Obtiene todos los productos con sus certificaciones cargadas.
     * 
     * @EntityGraph: Especifica que se deben cargar las certificaciones
     * junto con los productos en una sola consulta, evitando el problema
     * N+1 y las referencias circulares.
     */
    @Override
    @EntityGraph(attributePaths = "certificaciones")
    List<Product> findAll();
    
    /**
     * Obtiene un producto por su ID con sus certificaciones cargadas.
     * 
     * @EntityGraph: Especifica que se deben cargar las certificaciones
     * junto con el producto en una sola consulta.
     */
    @Override
    @EntityGraph(attributePaths = "certificaciones")
    Optional<Product> findById(Long id);
    
    /**
     * Elimina todas las relaciones de certificaciones para un producto específico.
     * 
     * Este método elimina directamente las filas de la tabla intermedia
     * producto_certificaciones para un producto dado.
     * 
     * @param productId ID del producto cuyas relaciones se eliminarán
     */
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM producto_certificaciones WHERE producto_id = :productId", nativeQuery = true)
    void deleteProductCertifications(@Param("productId") Long productId);
}

