package com.ecoshop.service.impl;

import com.ecoshop.dto.PedidoItem.PedidoItemRequestDTO;
import com.ecoshop.dto.PedidoItem.PedidoItemResponseDTO;
import com.ecoshop.domain.Pedido;
import com.ecoshop.domain.PedidoItem;
import com.ecoshop.domain.Producto;
import com.ecoshop.exception.ResourceNotFoundException;
import com.ecoshop.repository.PedidoItemRepository;
import com.ecoshop.repository.PedidoRepository;
import com.ecoshop.repository.ProductoRepository;
import com.ecoshop.service.PedidoItemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoItemServiceImpl implements PedidoItemService {

  private final PedidoItemRepository pedidoItemRepository;
  private final PedidoRepository pedidoRepository;
  private final ProductoRepository productoRepository;

  public PedidoItemServiceImpl(PedidoItemRepository pedidoItemRepository,
      PedidoRepository pedidoRepository,
      ProductoRepository productoRepository) {
    this.pedidoItemRepository = pedidoItemRepository;
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
  }

  @Override
  @Transactional
  public PedidoItemResponseDTO addItem(PedidoItemRequestDTO dto) {
    Pedido pedido = pedidoRepository.findById(dto.getPedidoId())
        .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
    Producto producto = productoRepository.findById(dto.getProductoId())
        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

    PedidoItem item = new PedidoItem();
    item.setPedido(pedido);
    item.setProducto(producto);
    item.setCantidad(dto.getCantidad());
    item.setPrecioUnitario(producto.getPrecio()); // Congelamos precio

    PedidoItem savedItem = pedidoItemRepository.save(item);

    // --- MAGIA: Recalculamos el total del padre ---
    recalcularTotalPedido(pedido.getPedidoId());
    // ----------------------------------------------

    return mapToResponseDTO(savedItem);
  }

  @Override
  @Transactional
  public PedidoItemResponseDTO updateCantidad(Integer itemId, Integer nuevaCantidad) {
    PedidoItem item = pedidoItemRepository.findById(itemId)
        .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));

    item.setCantidad(nuevaCantidad);
    PedidoItem savedItem = pedidoItemRepository.save(item);

    // --- MAGIA: Recalculamos el total del padre ---
    recalcularTotalPedido(item.getPedido().getPedidoId());
    // ----------------------------------------------

    return mapToResponseDTO(savedItem);
  }

  @Override
  @Transactional
  public void removeItem(Integer itemId) {
    PedidoItem item = pedidoItemRepository.findById(itemId)
        .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));

    Integer pedidoId = item.getPedido().getPedidoId();
    pedidoItemRepository.deleteById(itemId);

    // --- MAGIA: Recalculamos el total del padre ---
    recalcularTotalPedido(pedidoId);
    // ----------------------------------------------
  }

  @Override
  @Transactional(readOnly = true)
  public List<PedidoItemResponseDTO> getItemsByPedido(Integer pedidoId) {
    if (!pedidoRepository.existsById(pedidoId)) {
      throw new ResourceNotFoundException("Pedido no encontrado");
    }
    return pedidoItemRepository.findByPedido_PedidoId(pedidoId).stream()
        .map(this::mapToResponseDTO)
        .collect(Collectors.toList());
  }

  // --- MÉTODO PRIVADO PARA RECALCULAR ---
  private void recalcularTotalPedido(Integer pedidoId) {
    Pedido pedido = pedidoRepository.findById(pedidoId)
        .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

    List<PedidoItem> items = pedidoItemRepository.findByPedido_PedidoId(pedidoId);

    BigDecimal nuevoTotal = BigDecimal.ZERO;

    for (PedidoItem item : items) {
      BigDecimal subtotal = item.getPrecioUnitario().multiply(new BigDecimal(item.getCantidad()));
      nuevoTotal = nuevoTotal.add(subtotal);
    }

    pedido.setTotal(nuevoTotal);
    pedidoRepository.save(pedido);
  }
  // --------------------------------------

  private PedidoItemResponseDTO mapToResponseDTO(PedidoItem item) {
    PedidoItemResponseDTO dto = new PedidoItemResponseDTO();
    dto.setPedidoItemId(item.getPedidoItemId());
    dto.setPedidoId(item.getPedido().getPedidoId());
    dto.setProductoId(item.getProducto().getProductoId());
    dto.setNombreProducto(item.getProducto().getNombre());
    dto.setImagenUrl(item.getProducto().getImagenUrl());
    dto.setCantidad(item.getCantidad());
    dto.setPrecioUnitario(item.getPrecioUnitario());
    dto.setSubtotal(item.getPrecioUnitario().multiply(new BigDecimal(item.getCantidad())));
    return dto;
  }
}
