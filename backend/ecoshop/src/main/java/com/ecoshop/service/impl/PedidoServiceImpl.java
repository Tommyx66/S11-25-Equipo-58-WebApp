package com.ecoshop.service.impl;

import com.ecoshop.dto.Pedido.PedidoRequestDTO;
import com.ecoshop.dto.Pedido.PedidoResponseDTO;
import com.ecoshop.domain.Pedido;
import com.ecoshop.domain.Usuario;
import com.ecoshop.exception.ResourceNotFoundException;
import com.ecoshop.repository.PedidoRepository;
import com.ecoshop.repository.UsuarioRepository;
import com.ecoshop.service.PedidoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoServiceImpl implements PedidoService {

  private final PedidoRepository pedidoRepository;
  private final UsuarioRepository usuarioRepository;

  public PedidoServiceImpl(PedidoRepository pedidoRepository, UsuarioRepository usuarioRepository) {
    this.pedidoRepository = pedidoRepository;
    this.usuarioRepository = usuarioRepository;
  }

  @Override
  @Transactional
  public PedidoResponseDTO createPedido(PedidoRequestDTO dto) {
    Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + dto.getUsuarioId()));

    Pedido pedido = new Pedido();
    pedido.setUsuario(usuario);
    pedido.setDireccionEnvio(dto.getDireccionEnvio());
    pedido.setTotal(java.math.BigDecimal.ZERO);
    pedido.setEstado(dto.getEstado() != null ? dto.getEstado() : "pendiente_pago");
    pedido.setMetodoPago(dto.getMetodoPago());
    pedido.setIdTransaccionPago(dto.getIdTransaccionPago());
    pedido.setHuellaCarbonoTotalKg(
        dto.getHuellaCarbonoTotalKg() != null ? dto.getHuellaCarbonoTotalKg() : java.math.BigDecimal.ZERO);

    Pedido savedPedido = pedidoRepository.save(pedido);
    return mapToResponseDTO(savedPedido);
  }

  @Override
  @Transactional(readOnly = true)
  public PedidoResponseDTO getPedidoById(Integer id) {
    Pedido pedido = pedidoRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
    return mapToResponseDTO(pedido);
  }

  @Override
  @Transactional(readOnly = true)
  public List<PedidoResponseDTO> getAllPedidos() {
    return pedidoRepository.findAll().stream()
        .map(this::mapToResponseDTO)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<PedidoResponseDTO> getPedidosByUsuario(Integer usuarioId) {
    if (!usuarioRepository.existsById(usuarioId)) {
      throw new ResourceNotFoundException("Usuario no encontrado");
    }
    return pedidoRepository.findByUsuario_UsuarioId(usuarioId).stream()
        .map(this::mapToResponseDTO)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public PedidoResponseDTO updateEstadoPedido(Integer id, String nuevoEstado) {
    Pedido pedido = pedidoRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

    // NOTE: Analizar la posiblidad de validar el estado
    return mapToResponseDTO(pedidoRepository.save(pedido));
  }

  @Override
  @Transactional
  public void deletePedido(Integer id) {
    if (!pedidoRepository.existsById(id)) {
      throw new ResourceNotFoundException("Pedido no encontrado");
    }
    pedidoRepository.deleteById(id);
  }

  private PedidoResponseDTO mapToResponseDTO(Pedido p) {
    PedidoResponseDTO dto = new PedidoResponseDTO();
    dto.setPedidoId(p.getPedidoId());
    dto.setUsuarioId(p.getUsuario().getUsuarioId());
    dto.setEmailUsuario(p.getUsuario().getEmail());
    dto.setFechaPedido(p.getFechaPedido());
    dto.setEstado(p.getEstado());
    dto.setTotal(p.getTotal());
    dto.setDireccionEnvio(p.getDireccionEnvio());
    dto.setMetodoPago(p.getMetodoPago());
    dto.setIdTransaccionPago(p.getIdTransaccionPago());
    dto.setHuellaCarbonoTotalKg(p.getHuellaCarbonoTotalKg());
    return dto;
  }
}
