package com.ecoshop.controller;

import com.ecoshop.dto.ProductDto;
import com.ecoshop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar productos.
 * 
 * Este controlador expone los endpoints CRUD para la gestión de productos.
 * Todos los endpoints están bajo la ruta base "/api/v1/products".
 * 
 * Flujo de datos:
 * 1. El cliente envía una petición HTTP
 * 2. El controlador valida la petición (si aplica)
 * 3. El controlador delega la lógica de negocio al servicio
 * 4. El servicio procesa la petición y retorna un DTO
 * 5. El controlador envía la respuesta HTTP al cliente
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor // Genera automáticamente un constructor con los campos finales (inyección de dependencias)
public class ProductController {

    // Inyección de dependencias: Spring proporciona automáticamente una instancia de ProductService
    private final ProductService productService;

    /**
     * Obtiene todos los productos existentes en la base de datos.
     * 
     * @return ResponseEntity con la lista de productos y código HTTP 200 (OK)
     * 
     * Ejemplo de uso:
     * GET http://localhost:8080/api/v1/products
     */
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        // Delegamos la lógica al servicio para mantener separación de responsabilidades
        List<ProductDto> products = productService.findAll();
        return ResponseEntity.ok(products); // Retorna código HTTP 200 con la lista de productos
    }

    /**
     * Obtiene un producto específico por su ID.
     * 
     * @param id Identificador único del producto
     * @return ResponseEntity con el producto encontrado y código HTTP 200 (OK)
     * @throws jakarta.persistence.EntityNotFoundException si el producto no existe
     * 
     * Ejemplo de uso:
     * GET http://localhost:8080/api/v1/products/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        // @PathVariable extrae el valor del ID desde la URL
        ProductDto product = productService.findById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * Crea un nuevo producto en la base de datos.
     * 
     * @param productDto Datos del producto a crear (viene en el cuerpo de la petición)
     * @return ResponseEntity con el producto creado y código HTTP 201 (CREATED)
     * @throws org.springframework.web.bind.MethodArgumentNotValidException si los datos no son válidos
     * 
     * Validaciones aplicadas (definidas en ProductDto):
     * - nombre: obligatorio, máximo 200 caracteres
     * - precio: obligatorio, mayor a 0, máximo 8 dígitos enteros y 2 decimales
     * 
     * Ejemplo de uso:
     * POST http://localhost:8080/api/v1/products
     * Body: { "nombre": "Botella reutilizable", "precio": 14990, ... }
     */
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductDto productDto) {
        // @Valid activa las validaciones definidas en ProductDto
        // @RequestBody convierte el JSON del cuerpo de la petición a un objeto ProductDto
        ProductDto createdProduct = productService.save(productDto);
        // Retornamos código HTTP 201 (CREATED) para indicar que se creó un nuevo recurso
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    /**
     * Actualiza un producto existente en la base de datos.
     * 
     * @param id Identificador único del producto a actualizar
     * @param productDto Nuevos datos del producto (viene en el cuerpo de la petición)
     * @return ResponseEntity con el producto actualizado y código HTTP 200 (OK)
     * @throws jakarta.persistence.EntityNotFoundException si el producto no existe
     * @throws org.springframework.web.bind.MethodArgumentNotValidException si los datos no son válidos
     * 
     * Ejemplo de uso:
     * PUT http://localhost:8080/api/v1/products/1
     * Body: { "nombre": "Botella actualizada", "precio": 15990, ... }
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto productDto) {
        ProductDto updatedProduct = productService.update(id, productDto);
        return ResponseEntity.ok(updatedProduct);
    }

    /**
     * Elimina un producto de la base de datos.
     * 
     * @param id Identificador único del producto a eliminar
     * @return ResponseEntity vacío con código HTTP 204 (NO CONTENT)
     * @throws jakarta.persistence.EntityNotFoundException si el producto no existe
     * 
     * Ejemplo de uso:
     * DELETE http://localhost:8080/api/v1/products/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteById(id);
        // Retornamos código HTTP 204 (NO CONTENT) para indicar que la operación fue exitosa
        // pero no hay contenido en la respuesta
        return ResponseEntity.noContent().build();
    }
}

