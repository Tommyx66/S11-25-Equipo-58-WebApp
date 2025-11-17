package com.ecoshop.repository;

import com.ecoshop.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
    // Esta interfaz está vacía porque JpaRepository proporciona todos los métodos necesarios
    // Podríamos agregar métodos personalizados aquí si necesitáramos consultas específicas
    // Ejemplo: List<Product> findByMarca(String marca);
}

