package com.ecoshop.repository;

import com.ecoshop.domain.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
  List<Producto> findByMarca_MarcaId(Integer marcaId);

  // Verificar SKU duplicado
  boolean existsBySku(String sku);
}
