package com.diagnolab.controller;

import com.diagnolab.dto.BillRequestDTO;
import com.diagnolab.dto.BillResponseDTO;
import com.diagnolab.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    /**
     * Endpoint to create a new bill.
     *
     * @param billRequest the request body containing bill details
     * @return ResponseEntity with success message
     */
    @PostMapping
    public ResponseEntity<BillResponseDTO> createBill(@RequestBody BillRequestDTO billRequest) {
        try {
            BillResponseDTO bill = billService.generate(billRequest);
            return new ResponseEntity<>(bill, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Endpoint to retrieve all bills.
     *
     * @return ResponseEntity containing list of all bills
     */
    @GetMapping
    public ResponseEntity<List<BillResponseDTO>> getAllBills() {
        List<BillResponseDTO> bills = billService.getAllBills();
        if (bills.isEmpty()) {
            return new ResponseEntity<>(bills, HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(bills);
    }

    /**
     * Endpoint to delete a bill by ID.
     *
     * @param billId the ID of the bill to be deleted
     * @return ResponseEntity with success or error message
     */
    @DeleteMapping("/{billId}")
    public ResponseEntity<String> deleteBill(@PathVariable Long billId) {
        try {
            billService.deleteBill(billId);
            return ResponseEntity.ok("Bill deleted successfully");
        } catch (RuntimeException e) {
            if (e.getMessage().equalsIgnoreCase("Bill not found")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            } else if (e.getMessage().contains("pending samples")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
            } else {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }
    }

    /**
     * Endpoint to update an existing bill.
     *
     * @param billId      the ID of the bill to be updated
     * @param billRequest the request body containing updated bill details
     * @return ResponseEntity with success message
     */
    @PutMapping("/{billId}")
    public ResponseEntity<String> updateBill(@PathVariable Long billId, @RequestBody BillRequestDTO billRequest) {
        try {
            billService.updateBill(billId, billRequest);
            return ResponseEntity.ok("Bill updated successfully");
        } catch (RuntimeException e) {
            if (e.getMessage().equalsIgnoreCase("Bill not found")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }
    }
}
