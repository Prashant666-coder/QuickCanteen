package com.quickcanteen.model;

public class MenuItem {
    private Long id;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
    private String category;    // e.g., Pizza, Sushi, Salad, Noodles
    private String restaurant;  // e.g., "Spice Hub"

    public MenuItem() {}

    public MenuItem(Long id, String name, String description, double price, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    public MenuItem(Long id, String name, String description, double price, String imageUrl, String category, String restaurant) {
        this(id, name, description, price, imageUrl);
        this.category = category;
        this.restaurant = restaurant;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getRestaurant() { return restaurant; }
    public void setRestaurant(String restaurant) { this.restaurant = restaurant; }
}
