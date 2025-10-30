package com.quickcanteen.repo;

import com.quickcanteen.model.MenuItem;
import com.quickcanteen.model.Order;
import com.quickcanteen.model.User;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

public class InMemoryStore {
    private static final Map<Long, MenuItem> MENU = new ConcurrentHashMap<>();
    private static final Map<Long, Order> ORDERS = new ConcurrentHashMap<>();
    private static final Map<String, User> USERS = new ConcurrentHashMap<>();
    private static final Map<String, String> TOKENS = new ConcurrentHashMap<>(); // token -> username
    private static final AtomicLong MENU_SEQ = new AtomicLong(0);
    private static final AtomicLong ORDER_SEQ = new AtomicLong(0);

    static {
        // Seed menu with categories and restaurants
        addMenuItem(new MenuItem(null, "Pizza", "Cheesy and delicious, straight from the oven.", 299.00,
                "https://media-assets.swiggy.com/swiggy/image/upload/f_auto,q_auto,fl_lossy/RX_THUMBNAIL/IMAGES/VENDOR/2024/6/26/d112a6d7-d173-4ca7-a5ee-40f845719d18_710674.JPG","Pizza","Oven Street"));
        addMenuItem(new MenuItem(null, "Sushi", "Freshly prepared with the finest ingredients.", 699.00,
                "https://sudachirecipes.com/wp-content/uploads/2024/09/ebikyu-maki-thumb.png","Sushi","Tokyo Dine"));
        addMenuItem(new MenuItem(null, "Salad", "A healthy and refreshing choice for any time.", 189.00,
                "https://nutritionrefined.com/wp-content/uploads/2023/08/homemade-garden-salad-featured.jpg","Salad","Green Bowl"));
        addMenuItem(new MenuItem(null, "Hamburger", "Juicy, savory, and grilled to perfection.", 249.00,
                "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop","Burger","Grill House"));

        // Noodles category examples
        addMenuItem(new MenuItem(null, "Veg Noodles", "Stir-fried vegetables tossed with hakka noodles.", 199.00,
                "https://www.ohmyveg.co.uk/wp-content/uploads/2024/08/hakka-noodles.jpg","Noodles","Spice Hub"));
        addMenuItem(new MenuItem(null, "Butter Noodles", "Rich buttery noodles with herbs.", 179.00,
                "https://i2.wp.com/lifemadesimplebakes.com/wp-content/uploads/2020/02/Garlic-Butter-Noodles-square-1200.jpg","Noodles","Urban Bites"));
        addMenuItem(new MenuItem(null, "Schezwan Noodles", "Fiery and flavorful Indo-Chinese noodles.", 229.00,
                "https://herbivorecucina.com/wp-content/uploads/2023/09/Schezwan-Noodles-2.jpg","Noodles","Dragon Bowl"));
        addMenuItem(new MenuItem(null, "Ramen Bowl", "Umami-rich broth with noodles and toppings.", 499.00,
                "https://thefoodiediaries.co/wp-content/uploads/2020/08/img_4288.jpg","Noodles","Ramen Co."));

        // Seed demo user
        USERS.put("demo", new User("demo", "demo"));
    }

    public static List<MenuItem> getAllMenu() {
        return new ArrayList<>(MENU.values());
    }

    public static MenuItem addMenuItem(MenuItem item) {
        long id = MENU_SEQ.incrementAndGet();
        item.setId(id);
        MENU.put(id, item);
        return item;
    }

    public static Optional<MenuItem> getMenuItem(Long id) {
        return Optional.ofNullable(MENU.get(id));
    }

    public static Order saveOrder(Order order) {
        long id = ORDER_SEQ.incrementAndGet();
        order.setId(id);
        ORDERS.put(id, order);
        return order;
    }

    public static List<Order> getAllOrders() {
        return new ArrayList<>(ORDERS.values());
    }

    // ===== Users & Tokens =====
    public static boolean usernameExists(String username) {
        return USERS.containsKey(username);
    }

    public static void addUser(User user) {
        USERS.put(user.getUsername(), user);
    }

    public static Optional<User> getUser(String username) {
        return Optional.ofNullable(USERS.get(username));
    }

    public static String issueToken(String username) {
        String token = UUID.randomUUID().toString();
        TOKENS.put(token, username);
        return token;
    }

    public static Optional<String> validateToken(String token) {
        return Optional.ofNullable(TOKENS.get(token));
    }
}
