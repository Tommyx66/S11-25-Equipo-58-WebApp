package com.ecoshop.controller;

import com.ecoshop.dto.Pedido.PedidoRequestDTO;
import com.ecoshop.dto.Pedido.PedidoResponseDTO;
import com.ecoshop.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pedidos")
public class PedidoController {

  private final PedidoService pedidoService;

  public PedidoController(PedidoService pedidoService) {
    this.pedidoService = pedidoService;
  }

  @PostMapping
  public ResponseEntity<PedidoResponseDTO> createPedido(@Valid @RequestBody PedidoRequestDTO dto) {
    return new ResponseEntity<>(pedidoService.createPedido(dto), HttpStatus.CREATED);
  }

  @GetMapping("/{id}")
  public ResponseEntity<PedidoResponseDTO> getPedidoById(@PathVariable Integer id) {
    return ResponseEntity.ok(pedidoService.getPedidoById(id));
  }

  @GetMapping
  public ResponseEntity<List<PedidoResponseDTO>> getAllPedidos() {
    return ResponseEntity.ok(pedidoService.getAllPedidos());
  }

  // Endpoint para ver el historial de un usuario
  @GetMapping("/usuario/{usuarioId}")
  public ResponseEntity<List<PedidoResponseDTO>> getPedidosByUsuario(@PathVariable Integer usuarioId) {
    return ResponseEntity.ok(pedidoService.getPedidosByUsuario(usuarioId));
  }

  // Endpoint específico para cambiar estado (ej: de 'procesando' a 'enviado')
  // Se usa PATCH o PUT
  @PatchMapping("/{id}/estado")
  public ResponseEntity<PedidoResponseDTO> updateEstado(@PathVariable Integer id, @RequestParam String estado) {
    return ResponseEntity.ok(pedidoService.updateEstadoPedido(id, estado));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletePedido(@PathVariable Integer id) {
    pedidoService.deletePedido(id);
    return ResponseEntity.noContent().build();
  }
}
