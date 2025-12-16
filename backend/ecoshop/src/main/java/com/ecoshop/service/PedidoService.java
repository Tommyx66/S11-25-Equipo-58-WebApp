package com.ecoshop.service;

import com.ecoshop.dto.Pedido.PedidoRequestDTO;
import com.ecoshop.dto.Pedido.PedidoResponseDTO;
import java.util.List;

public interface PedidoService {
  PedidoResponseDTO createPedido(PedidoRequestDTO dto);

  PedidoResponseDTO getPedidoById(Integer id);

  List<PedidoResponseDTO> getAllPedidos();

  List<PedidoResponseDTO> getPedidosByUsuario(Integer usuarioId);

  PedidoResponseDTO updateEstadoPedido(Integer id, String nuevoEstado); // Método simplificado para cambiar estado

  void deletePedido(Integer id);
}
