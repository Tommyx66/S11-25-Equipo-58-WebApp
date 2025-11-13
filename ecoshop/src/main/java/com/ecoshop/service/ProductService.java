package com.ecoshop.service;

import com.ecoshop.dto.ProductDto;

import java.util.List;

/**
 * Interfaz del servicio de productos.
 * 
 * Define el contrato para las operaciones de negocio relacionadas con productos.
 * Esta interfaz separa la definición de las operaciones de su implementación,
 * permitiendo cambiar la implementación sin afectar a los clientes (controladores).
 * 
 * Responsabilidades:
 * - Definir las operaciones CRUD (Create, Read, Update, Delete) para productos
 * - Trabajar con DTOs en lugar de entidades para mantener desacoplamiento
 * - Manejar la lógica de negocio relacionada con productos
 */
public interface ProductService {
    
    /**
     * Obtiene todos los productos existentes.
     * 
     * @return Lista de todos los productos convertidos a DTOs
     */
    List<ProductDto> findAll();
    
    /**
     * Busca un producto por su ID.
     * 
     * @param id Identificador único del producto
     * @return Producto encontrado convertido a DTO
     * @throws jakarta.persistence.EntityNotFoundException si el producto no existe
     */
    ProductDto findById(Long id);
    
    /**
     * Guarda un nuevo producto en la base de datos.
     * 
     * @param productDto Datos del producto a guardar
     * @return Producto guardado con su ID asignado
     */
    ProductDto save(ProductDto productDto);
    
    /**
     * Actualiza un producto existente.
     * 
     * @param id Identificador del producto a actualizar
     * @param productDto Nuevos datos del producto
     * @return Producto actualizado
     * @throws jakarta.persistence.EntityNotFoundException si el producto no existe
     */
    ProductDto update(Long id, ProductDto productDto);
    
    /**
     * Elimina un producto de la base de datos.
     * 
     * @param id Identificador del producto a eliminar
     * @throws jakarta.persistence.EntityNotFoundException si el producto no existe
     */
    void deleteById(Long id);
}

