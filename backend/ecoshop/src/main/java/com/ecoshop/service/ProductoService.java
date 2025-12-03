package com.ecoshop.service;

import com.ecoshop.dto.Producto.ProductoRequestDTO;
import com.ecoshop.dto.Producto.ProductoResponseDTO;

import java.util.List;

public interface ProductoService {
    ProductoResponseDTO createProducto(ProductoRequestDTO productoDTO);
    ProductoResponseDTO getProductoById(Integer id);
    List<ProductoResponseDTO> getAllProductos();
    List<ProductoResponseDTO> getProductosByMarca(Integer marcaId);
    ProductoResponseDTO updateProducto(Integer id, ProductoRequestDTO productoDTO);
    void deleteProducto(Integer id);
}
