package com.ecoshop.service;

import com.ecoshop.dto.Marca.MarcaRequestDTO;
import com.ecoshop.dto.Marca.MarcaResponseDTO;
import java.util.List;

public interface MarcaService {
  MarcaResponseDTO createMarca(MarcaRequestDTO marcaDTO);

  MarcaResponseDTO getMarcaById(Integer id);

  List<MarcaResponseDTO> getAllMarcas();

  MarcaResponseDTO updateMarca(Integer id, MarcaRequestDTO marcaDTO);

  void deleteMarca(Integer id);
}
