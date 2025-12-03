package com.ecoshop.service;

import com.ecoshop.dto.PedidoItem.PedidoItemRequestDTO;
import com.ecoshop.dto.PedidoItem.PedidoItemResponseDTO;
import java.util.List;

public interface PedidoItemService {
  PedidoItemResponseDTO addItem(PedidoItemRequestDTO dto);

  List<PedidoItemResponseDTO> getItemsByPedido(Integer pedidoId);

  void removeItem(Integer itemId);

  // Opcional: En caso de actualizar cantidad
  PedidoItemResponseDTO updateCantidad(Integer itemId, Integer nuevaCantidad);
}
