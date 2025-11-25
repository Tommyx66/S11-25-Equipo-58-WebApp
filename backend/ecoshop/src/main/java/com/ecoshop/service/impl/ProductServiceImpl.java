package com.ecoshop.service.impl;

import com.ecoshop.domain.Certification;
import com.ecoshop.domain.Product;
import com.ecoshop.dto.ProductDto;
import com.ecoshop.dto.ProductResponse;
import com.ecoshop.exception.BadRequestException;
import com.ecoshop.mapper.ProductMapper;
import com.ecoshop.repository.CertificationRepository;
import com.ecoshop.repository.ProductRepository;
import com.ecoshop.service.ProductService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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
    
    // Repositorio para acceder a las certificaciones
    private final CertificationRepository certificationRepository;
    
    // Mapper para convertir entre entidades y DTOs
    private final ProductMapper productMapper;
    
    // EntityManager para operaciones avanzadas de JPA (refresh, flush, etc.)
    private final EntityManager entityManager;

    /**
     * Obtiene todos los productos de la base de datos.
     * 
     * Proceso:
     * 1. Obtiene todas las entidades Product de la BD
     * 2. Convierte cada entidad a ProductResponse usando el mapper
     * 3. Retorna la lista de ProductResponse
     * 
     * @Transactional(readOnly = true): Optimiza la consulta indicando que es solo lectura
     * y evita que se abra una transacción de escritura innecesaria.
     */
    @Override
    @Transactional(readOnly = true) // Solo lectura, no necesita transacción de escritura
    public List<ProductResponse> findAll() {
        // Obtenemos todos los productos de la BD
        // Con FetchType.EAGER, las certificaciones se cargan automáticamente
        List<Product> products = productRepository.findAll();
        
        // Convertimos cada entidad a ProductResponse usando el mapper
        // El mapper maneja la conversión de certificaciones a nombres
        return products.stream()
                .map(productMapper::toResponse) // Convierte cada Product a ProductResponse
                .collect(Collectors.toList()); // Recopila los resultados en una lista
    }

    /**
     * Busca un producto por su ID.
     * 
     * Proceso:
     * 1. Busca el producto en la BD
     * 2. Si no existe, lanza una excepción
     * 3. Si existe, lo convierte a ProductResponse y lo retorna
     * 
     * @param id Identificador del producto
     * @return ProductResponse del producto encontrado
     * @throws EntityNotFoundException si el producto no existe
     */
    @Override
    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        // Optional permite manejar el caso cuando el producto no existe
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));
        return productMapper.toResponse(product);
    }

    /**
     * Guarda un nuevo producto en la base de datos.
     * 
     * Proceso:
     * 1. Convierte el DTO recibido a una entidad Product (sin certificaciones)
     * 2. Asigna las certificaciones según los códigos del DTO
     * 3. Guarda la entidad en la BD (JPA asigna automáticamente el ID)
     * 4. Convierte la entidad guardada de vuelta a DTO (para incluir el ID generado)
     * 5. Retorna el DTO con el ID asignado
     * 
     * @param productDto Datos del producto a guardar
     * @return ProductDto con el ID asignado por la BD
     * @throws BadRequestException si algún código de certificación no existe
     */
    @Override
    public ProductDto save(ProductDto productDto) {
        // Convierte DTO a entidad para guardar en BD (sin certificaciones)
        Product product = productMapper.toEntity(productDto);
        
        // Asigna las certificaciones según los códigos del DTO
        Set<Certification> certificaciones = loadCertificationsByCodes(productDto.getCertificaciones());
        product.setCertificaciones(certificaciones);
        
        // Guarda en BD (JPA asigna el ID automáticamente)
        Product savedProduct = productRepository.save(product);
        
        // Forzamos el flush para asegurar que los cambios se persistan en la BD
        entityManager.flush();
        
        // Recargamos el producto desde la BD para asegurar que las certificaciones se carguen
        // Esto es necesario porque después de save(), las relaciones pueden no estar completamente cargadas
        Product refreshedProduct = productRepository.findById(savedProduct.getId())
                .orElseThrow(() -> new EntityNotFoundException("Error al recargar el producto guardado con id: " + savedProduct.getId()));
        
        // Convierte de vuelta a DTO para retornar al controlador
        return productMapper.toDto(refreshedProduct);
    }

    /**
     * Actualiza un producto existente.
     * 
     * Proceso:
     * 1. Verifica que el producto exista
     * 2. Convierte el DTO a entidad (sin certificaciones)
     * 3. Asigna el ID del producto existente (importante para actualizar, no crear)
     * 4. Asigna las certificaciones según los códigos del DTO (reemplaza las existentes)
     * 5. Guarda los cambios en la BD
     * 6. Retorna el producto actualizado como DTO
     * 
     * @param id ID del producto a actualizar
     * @param productDto Nuevos datos del producto
     * @return ProductDto actualizado
     * @throws EntityNotFoundException si el producto no existe
     * @throws BadRequestException si algún código de certificación no existe
     */
    @Override
    public ProductDto update(Long id, ProductDto productDto) {
        // IMPORTANTE: El parámetro 'id' viene del path variable (@PathVariable) de la URL
        // Ignoramos completamente el campo 'id' del productDto (si existe) y usamos solo el path variable
        
        // Cargamos la entidad existente (gestionada por JPA) con sus certificaciones
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));

        // Preservamos la fecha de creación original antes de actualizar
        // Esto es importante porque fechaCreacion no debe cambiar al actualizar un producto
        java.time.LocalDateTime fechaCreacionOriginal = existingProduct.getFechaCreacion();

        // Actualizamos los campos básicos del producto desde el DTO
        Product productFromDto = productMapper.toEntity(productDto);
        
        // Actualizamos los campos directamente en la entidad existente
        // IMPORTANTE: No copiamos fechaCreacion para preservar la fecha original de creación
        existingProduct.setNombre(productFromDto.getNombre());
        existingProduct.setMarca(productFromDto.getMarca());
        existingProduct.setPrecio(productFromDto.getPrecio());
        existingProduct.setImpactoAmbiental(productFromDto.getImpactoAmbiental());
        existingProduct.setImagen(productFromDto.getImagen());
        
        // Aseguramos que fechaCreacion se mantenga con su valor original
        // Esto previene que se sobrescriba con un nuevo timestamp si productFromDto tiene uno incorrecto
        existingProduct.setFechaCreacion(fechaCreacionOriginal);
        
        // Cargamos las nuevas certificaciones según los códigos del DTO
        Set<Certification> nuevasCertificaciones = loadCertificationsByCodes(productDto.getCertificaciones());
        
        // Limpiamos las certificaciones existentes y asignamos las nuevas
        // Esto es necesario para que JPA sincronice correctamente la tabla intermedia
        existingProduct.getCertificaciones().clear();
        if (!nuevasCertificaciones.isEmpty()) {
            existingProduct.getCertificaciones().addAll(nuevasCertificaciones);
        }
        
        // Guardamos los cambios (JPA detecta automáticamente los cambios en la entidad gestionada)
        Product updatedProduct = productRepository.save(existingProduct);
        
        // Forzamos el flush para asegurar que los cambios se persistan en la BD
        entityManager.flush();
        
        // Extraemos los códigos de las certificaciones ANTES de pasar al mapper
        // Esto evita que el mapper acceda a product.getCertificaciones() que puede
        // disparar la carga de la relación bidireccional y causar StackOverflowError
        // IMPORTANTE: ProductDto espera códigos (no nombres) porque se usa en POST/PUT
        List<String> codigosCertificaciones = nuevasCertificaciones.stream()
                .map(Certification::getCode)
                .filter(code -> code != null && !code.trim().isEmpty())
                .collect(Collectors.toList());
        
        // Creamos el DTO usando el mapper pero evitando que acceda a las certificaciones
        // Construimos el DTO manualmente con los datos del producto actualizado
        ProductDto.ImpactoAmbientalDto impactoDto = null;
        if (updatedProduct.getImpactoAmbiental() != null) {
            String huellaCarbonoStr = null;
            if (updatedProduct.getImpactoAmbiental().getHuellaCarbonoKg() != null) {
                huellaCarbonoStr = String.format("%.1f kg CO₂", updatedProduct.getImpactoAmbiental().getHuellaCarbonoKg());
            }
            impactoDto = ProductDto.ImpactoAmbientalDto.builder()
                    .huellaCarbono(huellaCarbonoStr)
                    .materialesReciclables(updatedProduct.getImpactoAmbiental().getMaterialesReciclables())
                    .nivel(updatedProduct.getImpactoAmbiental().getNivel())
                    .build();
        }
        
        // Construimos el DTO sin acceder a las certificaciones de la entidad
        return ProductDto.builder()
                .id(updatedProduct.getId())
                .nombre(updatedProduct.getNombre())
                .marca(updatedProduct.getMarca())
                .precio(updatedProduct.getPrecio())
                .impactoAmbiental(impactoDto)
                .imagen(updatedProduct.getImagen())
                .certificaciones(codigosCertificaciones) // Usamos los códigos que ya extrajimos (ProductDto espera códigos)
                .fechaCreacion(updatedProduct.getFechaCreacion())
                .build();
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
        // Verificamos que el producto exista
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Producto no encontrado con id: " + id);
        }
        
        // Eliminamos directamente las relaciones de la tabla intermedia usando una consulta nativa
        // Esto es más eficiente y evita problemas con foreign key constraints
        productRepository.deleteProductCertifications(id);
        
        // Forzamos el flush para asegurar que las relaciones se eliminen antes de eliminar el producto
        entityManager.flush();
        
        // Ahora eliminamos el producto de forma segura
        // Las relaciones ya fueron eliminadas en el paso anterior
        productRepository.deleteById(id);
        
        // Forzamos el flush final para asegurar que la eliminación se persista
        entityManager.flush();
    }

    /**
     * Carga las certificaciones desde la base de datos según los códigos proporcionados.
     * 
     * Este método privado encapsula la lógica de carga de certificaciones:
     * 1. Si la lista de códigos es null o vacía, retorna un Set vacío
     * 2. Para cada código, busca la certificación correspondiente
     * 3. Si algún código no existe, lanza una excepción BadRequestException
     * 4. Retorna un Set con todas las certificaciones encontradas
     * 
     * @param certificacionCodes Lista de códigos de certificaciones (ej: ["FAIR_TRADE", "CARBON_NEUTRAL"])
     * @return Set de entidades Certification correspondientes a los códigos
     * @throws BadRequestException si algún código de certificación no existe
     */
    private Set<Certification> loadCertificationsByCodes(List<String> certificacionCodes) {
        // Si no hay códigos, retornamos un Set vacío
        if (certificacionCodes == null || certificacionCodes.isEmpty()) {
            return new HashSet<>();
        }

        // Creamos un Set para almacenar las certificaciones encontradas
        Set<Certification> certificaciones = new HashSet<>();
        
        // Lista para almacenar los códigos que no se encontraron
        List<String> codigosNoEncontrados = new ArrayList<>();

        // Iteramos sobre cada código y buscamos la certificación correspondiente
        for (String code : certificacionCodes) {
            // Validamos que el código no sea null ni vacío
            if (code == null || code.trim().isEmpty()) {
                continue; // Saltamos códigos vacíos o null
            }

            // Normalizamos el código: trim para eliminar espacios en blanco y convertimos a mayúsculas
            // Esto asegura consistencia con cómo se almacenan los códigos en la BD
            String normalizedCode = code.trim().toUpperCase();
            
            // Buscamos la certificación por código usando búsqueda case-insensitive
            // Esto asegura que encontremos la certificación sin importar el formato del código
            Optional<Certification> certificationOpt = certificationRepository.findByCodeIgnoreCase(normalizedCode);
            
            if (certificationOpt.isPresent()) {
                // Si existe, la agregamos al Set
                certificaciones.add(certificationOpt.get());
            } else {
                // Si no existe, la agregamos a la lista de códigos no encontrados
                codigosNoEncontrados.add(code);
            }
        }

        // Si hay códigos que no se encontraron, lanzamos una excepción
        if (!codigosNoEncontrados.isEmpty()) {
            String mensaje = codigosNoEncontrados.size() == 1
                    ? String.format("Certificación con código '%s' no encontrada", codigosNoEncontrados.get(0))
                    : String.format("Certificaciones con códigos %s no encontradas", codigosNoEncontrados);
            throw new BadRequestException(mensaje);
        }

        return certificaciones;
    }
}

