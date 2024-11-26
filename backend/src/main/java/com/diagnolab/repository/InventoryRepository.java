package com.diagnolab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.diagnolab.entity.Inventory;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

}
