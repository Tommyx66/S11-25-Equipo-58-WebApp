package com.ecoshop.controller;

import com.ecoshop.dto.Marca.MarcaRequestDTO;
import com.ecoshop.dto.Marca.MarcaResponseDTO;
import com.ecoshop.service.MarcaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/marcas")
public class MarcaController {

  private final MarcaService marcaService;

  public MarcaController(MarcaService marcaService) {
    this.marcaService = marcaService;
  }

  @PostMapping
  public ResponseEntity<MarcaResponseDTO> createMarca(@Valid @RequestBody MarcaRequestDTO marcaDTO) {
    MarcaResponseDTO newMarca = marcaService.createMarca(marcaDTO);
    return new ResponseEntity<>(newMarca, HttpStatus.CREATED);
  }

  @GetMapping("/{id}")
  public ResponseEntity<MarcaResponseDTO> getMarcaById(@PathVariable Integer id) {
    return ResponseEntity.ok(marcaService.getMarcaById(id));
  }

  @GetMapping
  public ResponseEntity<List<MarcaResponseDTO>> getAllMarcas() {
    return ResponseEntity.ok(marcaService.getAllMarcas());
  }

  @PutMapping("/{id}")
  public ResponseEntity<MarcaResponseDTO> updateMarca(@PathVariable Integer id,
      @Valid @RequestBody MarcaRequestDTO marcaDTO) {
    return ResponseEntity.ok(marcaService.updateMarca(id, marcaDTO));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteMarca(@PathVariable Integer id) {
    marcaService.deleteMarca(id);
    return ResponseEntity.noContent().build();
  }
}
