package com.ecoshop.controller;

import com.ecoshop.dto.PedidoItem.PedidoItemRequestDTO;
import com.ecoshop.dto.PedidoItem.PedidoItemResponseDTO;
import com.ecoshop.service.PedidoItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pedido-items")
public class PedidoItemController {

  private final PedidoItemService pedidoItemService;

  public PedidoItemController(PedidoItemService pedidoItemService) {
    this.pedidoItemService = pedidoItemService;
  }

  // Agregar un producto al pedido
  @PostMapping
  public ResponseEntity<PedidoItemResponseDTO> addItem(@Valid @RequestBody PedidoItemRequestDTO dto) {
    return new ResponseEntity<>(pedidoItemService.addItem(dto), HttpStatus.CREATED);
  }

  // Ver todos los items de un pedido (el carrito o factura)
  @GetMapping("/pedido/{pedidoId}")
  public ResponseEntity<List<PedidoItemResponseDTO>> getItemsByPedido(@PathVariable Integer pedidoId) {
    return ResponseEntity.ok(pedidoItemService.getItemsByPedido(pedidoId));
  }

  // Actualizar la cantidad de un item (ej: cambiar de 1 a 2 unidades)
  @PutMapping("/{itemId}")
  public ResponseEntity<PedidoItemResponseDTO> updateCantidad(@PathVariable Integer itemId,
      @RequestParam Integer cantidad) {
    return ResponseEntity.ok(pedidoItemService.updateCantidad(itemId, cantidad));
  }

  // Eliminar un item del pedido
  @DeleteMapping("/{itemId}")
  public ResponseEntity<Void> removeItem(@PathVariable Integer itemId) {
    pedidoItemService.removeItem(itemId);
    return ResponseEntity.noContent().build();
  }
}
