package com.quickcanteen.controller;

import com.quickcanteen.model.MenuItem;
import com.quickcanteen.model.Order;
import com.quickcanteen.repo.InMemoryStore;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestHeader(name = "Authorization", required = false) String authHeader,
                                        @Valid @RequestBody Order order) {
        // Require a valid token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", "Unauthorized"));
        }
        String token = authHeader.substring(7);
        if (InMemoryStore.validateToken(token).isEmpty()) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", "Invalid token"));
        }
        // Calculate total using current menu prices
        double total = 0.0;
        for (Order.OrderItem item : order.getItems()) {
            MenuItem menuItem = InMemoryStore.getMenuItem(item.getMenuItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid menuItemId: " + item.getMenuItemId()));
            total += menuItem.getPrice() * item.getQuantity();
        }
        order.setTotal(total);
        order.setStatus("PLACED");
        Order saved = InMemoryStore.saveOrder(order);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Order>> listOrders() {
        return ResponseEntity.ok(InMemoryStore.getAllOrders());
    }
}
