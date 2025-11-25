package com.ecoshop.mapper;

import com.ecoshop.domain.Certification;
import com.ecoshop.domain.ImpactoAmbiental;
import com.ecoshop.domain.Product;
import com.ecoshop.dto.ImpactoAmbientalResponse;
import com.ecoshop.dto.ProductDto;
import com.ecoshop.dto.ProductResponse;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
            // Convertimos el Double de huella de carbono a String formateado
            String huellaCarbonoStr = null;
            if (product.getImpactoAmbiental().getHuellaCarbonoKg() != null) {
                huellaCarbonoStr = String.format("%.1f kg CO₂", product.getImpactoAmbiental().getHuellaCarbonoKg());
            }
            
            // Usamos el patrón Builder para construir el DTO de forma segura
            impactoDto = ProductDto.ImpactoAmbientalDto.builder()
                    .huellaCarbono(huellaCarbonoStr)
                    .materialesReciclables(product.getImpactoAmbiental().getMaterialesReciclables())
                    .nivel(product.getImpactoAmbiental().getNivel())
                    .build();
        }

        // Convertimos el Set<Certification> a List<String> con los códigos de las certificaciones
        // IMPORTANTE: ProductDto se usa en POST/PUT, donde se esperan códigos (no nombres)
        // Por lo tanto, devolvemos códigos para mantener consistencia con el contrato de la API
        List<String> certificacionesList = extractCertificationCodes(product.getCertificaciones());
        
        return ProductDto.builder()
                .id(product.getId())
                .nombre(product.getNombre())
                .marca(product.getMarca())
                .precio(product.getPrecio())
                .impactoAmbiental(impactoDto) // Puede ser null si no tiene impacto ambiental
                .imagen(product.getImagen())
                .certificaciones(certificacionesList) // Lista de códigos de certificaciones (ej: ["FAIR_TRADE", "CARBON_NEUTRAL"])
                .fechaCreacion(product.getFechaCreacion())
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
            // Convertimos el string de huella de carbono a Double
            // El formato puede ser "0.8kg CO₂", "0.8 kg CO₂", "0.8", etc.
            Double huellaCarbonoKg = null;
            if (dto.getImpactoAmbiental().getHuellaCarbono() != null && 
                !dto.getImpactoAmbiental().getHuellaCarbono().trim().isEmpty()) {
                try {
                    // Extraemos el número del string, removiendo texto adicional
                    String huellaStr = dto.getImpactoAmbiental().getHuellaCarbono()
                            .replaceAll("[^0-9.]", "") // Remueve todo excepto números y punto
                            .trim();
                    if (!huellaStr.isEmpty()) {
                        huellaCarbonoKg = Double.parseDouble(huellaStr);
                    }
                } catch (NumberFormatException e) {
                    // Si no se puede parsear, dejamos null
                    huellaCarbonoKg = null;
                }
            }
            
            impacto = ImpactoAmbiental.builder()
                    .huellaCarbonoKg(huellaCarbonoKg)
                    .materialesReciclables(dto.getImpactoAmbiental().getMaterialesReciclables())
                    .nivel(dto.getImpactoAmbiental().getNivel())
                    .build();
        }

        // Construimos la entidad con todos los campos del DTO
        // Nota: Las certificaciones se manejan por separado ya que ahora son entidades
        // Por ahora, dejamos el Set de certificaciones vacío. En el futuro, cuando se implemente
        // la lógica de asignación de certificaciones, se puede buscar por código o ID.
        return Product.builder()
                .id(dto.getId()) // Puede ser null para crear nuevo, o tener valor para actualizar
                .nombre(dto.getNombre())
                .marca(dto.getMarca())
                .precio(dto.getPrecio())
                .impactoAmbiental(impacto) // Puede ser null
                .imagen(dto.getImagen())
                // Las certificaciones se asignan por separado en el servicio
                // ya que ahora son entidades relacionadas, no strings simples
                .certificaciones(new java.util.HashSet<>())
                .build();
    }

    /**
     * Convierte una entidad Product a un DTO ProductResponse.
     * 
     * Este método se usa cuando se necesita enviar datos desde la BD al cliente
     * en las respuestas GET. Formatea la huella de carbono como string.
     * 
     * Proceso:
     * 1. Verifica que la entidad no sea null
     * 2. Convierte el objeto ImpactoAmbiental embeddable a ImpactoAmbientalResponse
     * 3. Formatea la huella de carbono numérica como string: "X kg CO₂"
     * 4. Construye el ProductResponse con todos los campos necesarios
     * 5. Retorna el DTO listo para ser enviado en la respuesta HTTP
     * 
     * @param product Entidad Product de la base de datos
     * @return ProductResponse listo para enviar al cliente, o null si product es null
     */
    public ProductResponse toResponse(Product product) {
        // Validación: si la entidad es null, retornamos null
        if (product == null) {
            return null;
        }

        // Convertimos el objeto embeddable ImpactoAmbiental a su DTO de respuesta
        ImpactoAmbientalResponse impactoResponse = toImpactoAmbientalResponse(product.getImpactoAmbiental());

        // Convertimos el Set<Certification> a List<String> con los nombres de las certificaciones
        // IMPORTANTE: Los endpoints GET devuelven nombres para mostrar información legible al usuario
        List<String> certificacionesList = extractCertificationNames(product.getCertificaciones());

        // Construimos el ProductResponse con el formato exacto especificado
        return ProductResponse.builder()
                .id(product.getId())
                .nombre(product.getNombre())
                .marca(product.getMarca())
                .precio(product.getPrecio())
                .impactoAmbiental(impactoResponse) // Puede ser null si no tiene impacto ambiental
                .imagen(product.getImagen())
                .certificaciones(certificacionesList) // Lista de nombres de certificaciones (ej: ["Fair Trade", "Carbon Neutral"])
                .fechaCreacion(product.getFechaCreacion())
                .build();
    }

    /**
     * Convierte una entidad ImpactoAmbiental a un DTO ImpactoAmbientalResponse.
     * 
     * Este método formatea la huella de carbono numérica (Double) como string
     * con el formato "X kg CO₂".
     * 
     * Proceso:
     * 1. Verifica que el objeto no sea null
     * 2. Formatea la huella de carbono numérica como string: "X kg CO₂"
     * 3. Construye el ImpactoAmbientalResponse con todos los campos
     * 
     * @param impactoAmbiental Entidad ImpactoAmbiental embeddable
     * @return ImpactoAmbientalResponse con la huella de carbono formateada, o null si impactoAmbiental es null
     */
    public ImpactoAmbientalResponse toImpactoAmbientalResponse(ImpactoAmbiental impactoAmbiental) {
        // Validación: si el objeto es null, retornamos null
        if (impactoAmbiental == null) {
            return null;
        }

        // Formateamos la huella de carbono numérica como string: "X kg CO₂"
        String huellaCarbonoFormateada = null;
        if (impactoAmbiental.getHuellaCarbonoKg() != null) {
            huellaCarbonoFormateada = String.format("%.1f kg CO₂", impactoAmbiental.getHuellaCarbonoKg());
        }

        // Construimos el DTO de respuesta
        return ImpactoAmbientalResponse.builder()
                .huellaCarbono(huellaCarbonoFormateada)
                .materialesReciclables(impactoAmbiental.getMaterialesReciclables())
                .nivel(impactoAmbiental.getNivel())
                .build();
    }

    /**
     * Extrae los nombres de las certificaciones de un Set<Certification> y los convierte
     * a una List<String>.
     * 
     * Este método se usa en los endpoints GET (ProductResponse) para devolver nombres
     * legibles al usuario.
     * 
     * IMPORTANTE: Creamos una copia de la colección antes de iterarla para evitar
     * ConcurrentModificationException cuando hay relaciones bidireccionales.
     * 
     * @param certificaciones Set de entidades Certification
     * @return Lista de nombres de certificaciones (ej: ["Fair Trade", "Carbon Neutral"]),
     *         o lista vacía si certificaciones es null o vacío
     */
    private List<String> extractCertificationNames(Set<Certification> certificaciones) {
        if (certificaciones == null || certificaciones.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Creamos una copia de la colección para evitar ConcurrentModificationException
        // cuando hay relaciones bidireccionales entre Product y Certification
        List<Certification> certificacionesList = new ArrayList<>(certificaciones);
        
        return certificacionesList.stream()
                .map(Certification::getName)
                .filter(name -> name != null) // Filtramos nombres nulos por seguridad
                .collect(Collectors.toList());
    }

    /**
     * Extrae los códigos de las certificaciones de un Set<Certification> y los convierte
     * a una List<String>.
     * 
     * Este método se usa en los endpoints POST/PUT (ProductDto) donde se esperan códigos
     * de certificaciones para buscar las entidades correspondientes.
     * 
     * IMPORTANTE: Creamos una copia de la colección antes de iterarla para evitar
     * ConcurrentModificationException cuando hay relaciones bidireccionales.
     * 
     * @param certificaciones Set de entidades Certification
     * @return Lista de códigos de certificaciones (ej: ["FAIR_TRADE", "CARBON_NEUTRAL"]),
     *         o lista vacía si certificaciones es null o vacío
     */
    private List<String> extractCertificationCodes(Set<Certification> certificaciones) {
        if (certificaciones == null || certificaciones.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Creamos una copia de la colección para evitar ConcurrentModificationException
        // cuando hay relaciones bidireccionales entre Product y Certification
        List<Certification> certificacionesList = new ArrayList<>(certificaciones);
        
        return certificacionesList.stream()
                .map(Certification::getCode)
                .filter(code -> code != null && !code.trim().isEmpty()) // Filtramos códigos nulos o vacíos por seguridad
                .collect(Collectors.toList());
    }
}

