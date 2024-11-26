package com.diagnolab.service;

import java.util.List;
import java.util.Optional;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diagnolab.entity.Inventory;
import com.diagnolab.repository.InventoryRepository;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    // Get all inventory items
    @Transactional
    public List<Inventory> getAllInventoryItems() {
        return inventoryRepository.findAll();
    }

    // Get an inventory item by ID
    @Transactional
    public Inventory getInventoryItemById(long id) {
        Optional<Inventory> inventory = inventoryRepository.findById(id);
        return inventory.orElse(null);
    }

    // Create or save a new inventory item
    @Transactional
    public Inventory saveInventoryItem(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    // Update an existing inventory item
    @Transactional
    public Inventory updateInventoryItem(long id, Inventory updatedInventory) {
        Optional<Inventory> existingInventoryOpt = inventoryRepository.findById(id);

        if (existingInventoryOpt.isPresent()) {
            Inventory existingInventory = existingInventoryOpt.get();

            // Use setters to update fields
            existingInventory.setName(
                    updatedInventory.getName() != null ? updatedInventory.getName() : existingInventory.getName());
            existingInventory
                    .setDescription(updatedInventory.getDescription() != null ? updatedInventory.getDescription()
                            : existingInventory.getDescription());
            existingInventory.setQuantity(updatedInventory.getQuantity());
            existingInventory.setPrice(updatedInventory.getPrice());
            existingInventory
                    .setLastStocked(updatedInventory.getLastStocked() != null ? updatedInventory.getLastStocked()
                            : existingInventory.getLastStocked());

            return inventoryRepository.save(existingInventory);
        } else {
            return null; // Item not found
        }
    }

    // Delete an inventory item by ID
    public boolean deleteInventoryItem(long id) {
        if (inventoryRepository.existsById(id)) {
            inventoryRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
