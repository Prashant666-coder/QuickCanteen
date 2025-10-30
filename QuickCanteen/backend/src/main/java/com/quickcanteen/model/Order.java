package com.quickcanteen.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class Order {
    public static class OrderItem {
        @NotNull
        private Long menuItemId;
        @Min(1)
        private int quantity;

        public OrderItem() {}
        public OrderItem(Long menuItemId, int quantity) {
            this.menuItemId = menuItemId;
            this.quantity = quantity;
        }
        public Long getMenuItemId() { return menuItemId; }
        public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    private Long id;
    @NotEmpty
    private List<OrderItem> items;
    private double total;
    private String status = "PLACED"; // PLACED -> PREPARING -> READY -> COMPLETED
    private String paymentMethod; // COD or UPI
    private String address; // delivery address

    public Order() {}

    public Order(Long id, List<OrderItem> items, double total, String status) {
        this.id = id;
        this.items = items;
        this.total = total;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
