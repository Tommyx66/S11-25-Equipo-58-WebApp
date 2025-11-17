package com.ecoshop.service.impl;

import com.ecoshop.domain.Product;
import com.ecoshop.dto.ProductDto;
import com.ecoshop.mapper.ProductMapper;
import com.ecoshop.repository.ProductRepository;
import com.ecoshop.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de productos.
 * 
 * Esta clase contiene la lógica de negocio para gestionar productos.
 * Actúa como intermediario entre el controlador (capa de presentación) y
 * el repositorio (capa de acceso a datos).
 * 
 * Responsabilidades:
 * - Convertir entre DTOs y entidades usando el mapper
 * - Manejar transacciones de base de datos
 * - Validar existencia de recursos antes de operaciones
 * - Manejar excepciones de negocio
 * 
 * @Transactional: Todas las operaciones de escritura están dentro de una transacción
 * para garantizar la integridad de los datos. Si ocurre un error, se hace rollback.
 */
@Service // Indica a Spring que esta clase es un componente de servicio (bean de Spring)
@RequiredArgsConstructor // Genera constructor con los campos finales para inyección de dependencias
@Transactional // Todas las operaciones de escritura se ejecutan en una transacción
public class ProductServiceImpl implements ProductService {

    // Repositorio para acceder a la base de datos
    private final ProductRepository productRepository;
    
    // Mapper para convertir entre entidades y DTOs
    private final ProductMapper productMapper;

    /**
     * Obtiene todos los productos de la base de datos.
     * 
     * Proceso:
     * 1. Obtiene todas las entidades Product de la BD
     * 2. Convierte cada entidad a DTO usando el mapper
     * 3. Retorna la lista de DTOs
     * 
     * @Transactional(readOnly = true): Optimiza la consulta indicando que es solo lectura
     * y evita que se abra una transacción de escritura innecesaria.
     */
    @Override
    @Transactional(readOnly = true) // Solo lectura, no necesita transacción de escritura
    public List<ProductDto> findAll() {
        // Stream API para transformar la lista de entidades a DTOs de forma funcional
        return productRepository.findAll().stream()
                .map(productMapper::toDto) // Convierte cada Product a ProductDto
                .collect(Collectors.toList()); // Recopila los resultados en una lista
    }

    /**
     * Busca un producto por su ID.
     * 
     * Proceso:
     * 1. Busca el producto en la BD
     * 2. Si no existe, lanza una excepción
     * 3. Si existe, lo convierte a DTO y lo retorna
     * 
     * @param id Identificador del producto
     * @return ProductDto del producto encontrado
     * @throws EntityNotFoundException si el producto no existe
     */
    @Override
    @Transactional(readOnly = true)
    public ProductDto findById(Long id) {
        // Optional permite manejar el caso cuando el producto no existe
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));
        return productMapper.toDto(product);
    }

    /**
     * Guarda un nuevo producto en la base de datos.
     * 
     * Proceso:
     * 1. Convierte el DTO recibido a una entidad Product
     * 2. Guarda la entidad en la BD (JPA asigna automáticamente el ID)
     * 3. Convierte la entidad guardada de vuelta a DTO (para incluir el ID generado)
     * 4. Retorna el DTO con el ID asignado
     * 
     * @param productDto Datos del producto a guardar
     * @return ProductDto con el ID asignado por la BD
     */
    @Override
    public ProductDto save(ProductDto productDto) {
        // Convierte DTO a entidad para guardar en BD
        Product product = productMapper.toEntity(productDto);
        // Guarda en BD (JPA asigna el ID automáticamente)
        Product savedProduct = productRepository.save(product);
        // Convierte de vuelta a DTO para retornar al controlador
        return productMapper.toDto(savedProduct);
    }

    /**
     * Actualiza un producto existente.
     * 
     * Proceso:
     * 1. Verifica que el producto exista
     * 2. Convierte el DTO a entidad
     * 3. Asigna el ID del producto existente (importante para actualizar, no crear)
     * 4. Guarda los cambios en la BD
     * 5. Retorna el producto actualizado como DTO
     * 
     * @param id ID del producto a actualizar
     * @param productDto Nuevos datos del producto
     * @return ProductDto actualizado
     * @throws EntityNotFoundException si el producto no existe
     */
    @Override
    public ProductDto update(Long id, ProductDto productDto) {
        // Primero verificamos que el producto exista
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));

        // Convertimos el DTO a entidad
        Product productToUpdate = productMapper.toEntity(productDto);
        // CRÍTICO: Asignamos el ID del producto existente
        // Si no hacemos esto, JPA intentaría crear un nuevo producto en lugar de actualizar
        productToUpdate.setId(existingProduct.getId());
        
        // Guardamos los cambios (JPA detecta que tiene ID y actualiza en lugar de crear)
        Product updatedProduct = productRepository.save(productToUpdate);
        return productMapper.toDto(updatedProduct);
    }

    /**
     * Elimina un producto de la base de datos.
     * 
     * Proceso:
     * 1. Verifica que el producto exista
     * 2. Si existe, lo elimina de la BD
     * 3. Si no existe, lanza una excepción
     * 
     * Nota: Verificamos existencia antes de eliminar para dar un mensaje de error
     * más claro. También podríamos dejar que JPA lance la excepción, pero este
     * enfoque nos da más control sobre el mensaje de error.
     * 
     * @param id Identificador del producto a eliminar
     * @throws EntityNotFoundException si el producto no existe
     */
    @Override
    public void deleteById(Long id) {
        // Verificamos existencia antes de eliminar para un mejor mensaje de error
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Producto no encontrado con id: " + id);
        }
        // Eliminamos el producto de la BD
        productRepository.deleteById(id);
    }
}

