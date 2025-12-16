package com.ecoshop.service.impl;

import com.ecoshop.dto.Marca.MarcaRequestDTO;
import com.ecoshop.dto.Marca.MarcaResponseDTO;
import com.ecoshop.domain.Marca;
import com.ecoshop.domain.Usuario;
import com.ecoshop.exception.ResourceNotFoundException;
import com.ecoshop.repository.MarcaRepository;
import com.ecoshop.repository.UsuarioRepository;
import com.ecoshop.service.MarcaService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarcaServiceImpl implements MarcaService {

  private final MarcaRepository marcaRepository;
  private final UsuarioRepository usuarioRepository;

  // Constructor manual en lugar de @RequiredArgsConstructor
  public MarcaServiceImpl(MarcaRepository marcaRepository, UsuarioRepository usuarioRepository) {
    this.marcaRepository = marcaRepository;
    this.usuarioRepository = usuarioRepository;
  }

  @Override
  @Transactional
  public MarcaResponseDTO createMarca(MarcaRequestDTO dto) {
    Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + dto.getUsuarioId()));

    // Mapeo manual sin Builder
    Marca marca = new Marca();
    marca.setUsuario(usuario);
    marca.setNombreOficial(dto.getNombreOficial());
    marca.setDescripcionSostenible(dto.getDescripcionSostenible());
    marca.setSitioWeb(dto.getSitioWeb());
    marca.setLogoUrl(dto.getLogoUrl());

    Marca savedMarca = marcaRepository.save(marca);
    return mapToResponseDTO(savedMarca);
  }

  @Override
  @Transactional(readOnly = true)
  public MarcaResponseDTO getMarcaById(Integer id) {
    Marca marca = marcaRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada con id: " + id));
    return mapToResponseDTO(marca);
  }

  @Override
  @Transactional(readOnly = true)
  public List<MarcaResponseDTO> getAllMarcas() {
    return marcaRepository.findAll().stream()
        .map(this::mapToResponseDTO)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public MarcaResponseDTO updateMarca(Integer id, MarcaRequestDTO dto) {
    Marca marca = marcaRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada con id: " + id));

    marca.setNombreOficial(dto.getNombreOficial());
    marca.setDescripcionSostenible(dto.getDescripcionSostenible());
    marca.setSitioWeb(dto.getSitioWeb());
    marca.setLogoUrl(dto.getLogoUrl());

    Marca updatedMarca = marcaRepository.save(marca);
    return mapToResponseDTO(updatedMarca);
  }

  @Override
  @Transactional
  public void deleteMarca(Integer id) {
    if (!marcaRepository.existsById(id)) {
      throw new ResourceNotFoundException("Marca no encontrada con id: " + id);
    }
    marcaRepository.deleteById(id);
  }

  private MarcaResponseDTO mapToResponseDTO(Marca marca) {
    // Constructor manual del DTO
    return new MarcaResponseDTO(
        marca.getMarcaId(),
        marca.getUsuario().getUsuarioId(),
        marca.getNombreOficial(),
        marca.getDescripcionSostenible(),
        marca.getSitioWeb(),
        marca.getLogoUrl(),
        marca.getFechaUnion());
  }
}
