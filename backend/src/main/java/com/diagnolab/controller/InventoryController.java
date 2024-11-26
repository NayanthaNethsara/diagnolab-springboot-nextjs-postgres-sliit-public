
package com.diagnolab.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diagnolab.entity.Inventory;
import com.diagnolab.service.InventoryService;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    // Get all inventory items
    @GetMapping("/all")
    public ResponseEntity<List<Inventory>> getAllInventoryItems() {
        List<Inventory> inventoryList = inventoryService.getAllInventoryItems();
        return new ResponseEntity<>(inventoryList, HttpStatus.OK);
    }

    // Get an inventory item by ID
    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryItemById(@PathVariable("id") long id) {
        Inventory inventory = inventoryService.getInventoryItemById(id);
        return inventory != null
                ? new ResponseEntity<>(inventory, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Create a new inventory item
    @PostMapping
    public ResponseEntity<Inventory> createInventoryItem(@RequestBody Inventory inventory) {
        Inventory createdInventory = inventoryService.saveInventoryItem(inventory);
        return new ResponseEntity<>(createdInventory, HttpStatus.CREATED);
    }

    // Update an inventory item
    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventoryItem(@PathVariable("id") long id,
            @RequestBody Inventory inventory) {
        Inventory updatedInventory = inventoryService.updateInventoryItem(id, inventory);
        return updatedInventory != null
                ? new ResponseEntity<>(updatedInventory, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete an inventory item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventoryItem(@PathVariable("id") long id) {
        boolean isDeleted = inventoryService.deleteInventoryItem(id);
        return isDeleted
                ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
