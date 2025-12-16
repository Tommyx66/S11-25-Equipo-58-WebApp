package com.ecoshop.repository;

import com.ecoshop.domain.PedidoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoItemRepository extends JpaRepository<PedidoItem, Integer> {

  List<PedidoItem> findByPedido_PedidoId(Integer pedidoId);
}
