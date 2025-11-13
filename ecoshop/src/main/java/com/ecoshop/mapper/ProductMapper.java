package com.ecoshop.mapper;

import com.ecoshop.domain.ImpactoAmbiental;
import com.ecoshop.domain.Product;
import com.ecoshop.dto.ProductDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Mapper para convertir entre entidades y DTOs de productos.
 * 
 * Esta clase es responsable de la conversión bidireccional entre:
 * - Product (entidad JPA) <-> ProductDto (objeto de transferencia)
 * 
 * ¿Por qué usar un mapper?
 * - Separación de responsabilidades: las entidades representan la estructura de la BD
 * - Los DTOs representan lo que se expone en la API
 * - Evita exponer detalles internos de la entidad (como relaciones JPA)
 * - Permite cambiar la estructura de la BD sin afectar la API
 * - Facilita la validación y el control de datos expuestos
 * 
 * Patrón usado: Data Transfer Object (DTO) Pattern
 */
@Component // Indica a Spring que esta clase es un componente (bean de Spring)
public class ProductMapper {

    /**
     * Convierte una entidad Product a un DTO ProductDto.
     * 
     * Este método se usa cuando se necesita enviar datos desde la BD al cliente.
     * Por ejemplo, cuando se consulta un producto o se lista todos los productos.
     * 
     * Proceso:
     * 1. Verifica que la entidad no sea null (evita NullPointerException)
     * 2. Convierte el objeto ImpactoAmbiental embeddable a ImpactoAmbientalDto
     * 3. Construye el DTO con todos los campos de la entidad
     * 4. Retorna el DTO listo para ser enviado en la respuesta HTTP
     * 
     * @param product Entidad Product de la base de datos
     * @return ProductDto listo para enviar al cliente, o null si product es null
     */
    public ProductDto toDto(Product product) {
        // Validación: si la entidad es null, retornamos null
        // Esto evita NullPointerException y permite manejar casos donde no hay datos
        if (product == null) {
            return null;
        }

        // Convertimos el objeto embeddable ImpactoAmbiental a su DTO correspondiente
        // Verificamos que no sea null antes de acceder a sus propiedades
        ProductDto.ImpactoAmbientalDto impactoDto = null;
        if (product.getImpactoAmbiental() != null) {
            // Usamos el patrón Builder para construir el DTO de forma segura
            impactoDto = ProductDto.ImpactoAmbientalDto.builder()
                    .huellaCarbono(product.getImpactoAmbiental().getHuellaCarbono())
                    .materialesReciclables(product.getImpactoAmbiental().getMaterialesReciclables())
                    .nivel(product.getImpactoAmbiental().getNivel())
                    .build();
        }

        // Construimos el DTO principal con todos los campos de la entidad
        // Nota: Verificamos que certificaciones no sea null antes de asignarlo
        // y creamos una copia para evitar problemas con colecciones lazy no inicializadas
        // Esto asegura que la lista esté completamente cargada antes de construir el DTO
        List<String> certificacionesList = null;
        if (product.getCertificaciones() != null) {
            certificacionesList = new ArrayList<>(product.getCertificaciones());
        } else {
            certificacionesList = new ArrayList<>();
        }
        
        return ProductDto.builder()
                .id(product.getId())
                .nombre(product.getNombre())
                .marca(product.getMarca())
                .precio(product.getPrecio())
                .impactoAmbiental(impactoDto) // Puede ser null si no tiene impacto ambiental
                .imagen(product.getImagen())
                .certificaciones(certificacionesList) // Lista de certificaciones (copiamos para evitar problemas de lazy loading)
                .build();
    }

    /**
     * Convierte un DTO ProductDto a una entidad Product.
     * 
     * Este método se usa cuando se necesita guardar datos que vienen del cliente en la BD.
     * Por ejemplo, cuando se crea o actualiza un producto.
     * 
     * Proceso:
     * 1. Verifica que el DTO no sea null
     * 2. Convierte el ImpactoAmbientalDto a la entidad embeddable ImpactoAmbiental
     * 3. Construye la entidad con todos los campos del DTO
     * 4. Retorna la entidad lista para ser guardada en la BD
     * 
     * Nota importante:
     * - Si el DTO tiene un ID, se usará para actualizar un producto existente
     * - Si el DTO no tiene ID (null), se creará un nuevo producto (JPA asignará el ID)
     * 
     * @param dto ProductDto recibido del cliente
     * @return Product entidad lista para guardar en BD, o null si dto es null
     */
    public Product toEntity(ProductDto dto) {
        // Validación: si el DTO es null, retornamos null
        if (dto == null) {
            return null;
        }

        // Convertimos el DTO de impacto ambiental a la entidad embeddable
        ImpactoAmbiental impacto = null;
        if (dto.getImpactoAmbiental() != null) {
            impacto = ImpactoAmbiental.builder()
                    .huellaCarbono(dto.getImpactoAmbiental().getHuellaCarbono())
                    .materialesReciclables(dto.getImpactoAmbiental().getMaterialesReciclables())
                    .nivel(dto.getImpactoAmbiental().getNivel())
                    .build();
        }

        // Construimos la entidad con todos los campos del DTO
        // Nota: Si certificaciones es null, inicializamos una lista vacía para evitar NullPointerException
        return Product.builder()
                .id(dto.getId()) // Puede ser null para crear nuevo, o tener valor para actualizar
                .nombre(dto.getNombre())
                .marca(dto.getMarca())
                .precio(dto.getPrecio())
                .impactoAmbiental(impacto) // Puede ser null
                .imagen(dto.getImagen())
                // Si las certificaciones son null, inicializamos una lista vacía
                // Esto evita problemas con JPA al intentar guardar null en una colección
                .certificaciones(dto.getCertificaciones() != null ? dto.getCertificaciones() : new java.util.ArrayList<>())
                .build();
    }
}

