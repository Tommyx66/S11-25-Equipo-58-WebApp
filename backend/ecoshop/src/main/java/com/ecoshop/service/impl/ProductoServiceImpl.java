package com.ecoshop.service.impl;

import com.ecoshop.dto.Producto.ProductoRequestDTO;
import com.ecoshop.dto.Producto.ProductoResponseDTO;
import com.ecoshop.domain.Marca;
import com.ecoshop.domain.Producto;
import com.ecoshop.exception.ResourceNotFoundException;
import com.ecoshop.repository.MarcaRepository;
import com.ecoshop.repository.ProductoRepository;
import com.ecoshop.service.ProductoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final MarcaRepository marcaRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository, MarcaRepository marcaRepository) {
        this.productoRepository = productoRepository;
        this.marcaRepository = marcaRepository;
    }

    @Override
    @Transactional
    public ProductoResponseDTO createProducto(ProductoRequestDTO dto) {
        // 1. Validar existencia de la marca
        Marca marca = marcaRepository.findById(dto.getMarcaId())
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada con id: " + dto.getMarcaId()));

        // 2. Mapear
        Producto producto = new Producto();
        producto.setMarca(marca);
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setSku(dto.getSku());
        producto.setMateriales(dto.getMateriales());
        producto.setOrigen(dto.getOrigen());
        producto.setHuellaCarbonoKg(dto.getHuellaCarbonoKg());
        producto.setPorcentajeReciclable(dto.getPorcentajeReciclable());
        producto.setEcoBadge(dto.getEcoBadge());
        producto.setImagenUrl(dto.getImagenUrl());

        // 3. Guardar
        Producto savedProducto = productoRepository.save(producto);
        return mapToResponseDTO(savedProducto);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoResponseDTO getProductoById(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        return mapToResponseDTO(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponseDTO> getAllProductos() {
        return productoRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponseDTO> getProductosByMarca(Integer marcaId) {
        return productoRepository.findByMarca_MarcaId(marcaId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductoResponseDTO updateProducto(Integer id, ProductoRequestDTO dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        // Actualizar campos
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setMateriales(dto.getMateriales());
        producto.setOrigen(dto.getOrigen());
        producto.setHuellaCarbonoKg(dto.getHuellaCarbonoKg());
        producto.setPorcentajeReciclable(dto.getPorcentajeReciclable());
        producto.setEcoBadge(dto.getEcoBadge());
        producto.setImagenUrl(dto.getImagenUrl());
        
        // El SKU usualmente no se edita, o se valida duplicado antes

        return mapToResponseDTO(productoRepository.save(producto));
    }

    @Override
    @Transactional
    public void deleteProducto(Integer id) {
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado");
        }
        productoRepository.deleteById(id);
    }

    private ProductoResponseDTO mapToResponseDTO(Producto p) {
        ProductoResponseDTO dto = new ProductoResponseDTO();
        dto.setProductoId(p.getProductoId());
        dto.setMarcaId(p.getMarca().getMarcaId());
        dto.setNombreMarca(p.getMarca().getNombreOficial());
        dto.setNombre(p.getNombre());
        dto.setDescripcion(p.getDescripcion());
        dto.setPrecio(p.getPrecio());
        dto.setStock(p.getStock());
        dto.setSku(p.getSku());
        dto.setMateriales(p.getMateriales());
        dto.setOrigen(p.getOrigen());
        dto.setHuellaCarbonoKg(p.getHuellaCarbonoKg());
        dto.setPorcentajeReciclable(p.getPorcentajeReciclable());
        dto.setEcoBadge(p.getEcoBadge());
        dto.setImagenUrl(p.getImagenUrl());
        dto.setActivo(p.getActivo());
        dto.setFechaCreacion(p.getFechaCreacion());
        return dto;
    }
}
