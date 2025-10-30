# QuickCanteen - Frontend/Backend Split

This repo now has a clean separation between a static frontend and a Spring Boot backend.

## Project Structure

```
mini project/
├─ frontend/
│  ├─ index.html
│  ├─ style.css
│  └─ app.js
├─ backend/
│  ├─ pom.xml
│  └─ src/
│     ├─ main/java/com/quickcanteen/
│     │  ├─ QuickCanteenApplication.java
│     │  ├─ config/WebConfig.java
│     │  ├─ controller/MenuController.java
│     │  ├─ controller/OrderController.java
│     │  ├─ model/MenuItem.java
│     │  └─ model/Order.java
│     └─ main/resources/application.properties
└─ Java Project/  (legacy UI kept for reference)
```

## Prerequisites
- Java 17+
- Maven 3.9+
- Any static server for the frontend (or open `index.html` directly)

## Run Backend (Spring Boot)

```bash
cd "backend"
./mvnw spring-boot:run   # if mvnw is available
# or
mvn spring-boot:run
```

- Server starts at: http://localhost:8080
- APIs:
  - GET `/api/menu` → list menu items
  - POST `/api/orders` → place an order
  - GET `/api/orders` → list all orders

Example request:
```bash
curl -X GET http://localhost:8080/api/menu
```

```bash
curl -X POST http://localhost:8080/api/orders \
  -H 'Content-Type: application/json' \
  -d '{
        "items": [
          {"menuItemId": 1, "quantity": 2},
          {"menuItemId": 3, "quantity": 1}
        ]
      }'
```

## Run Frontend
- Option 1: Open `frontend/index.html` in your browser.
- Option 2: Serve statically for CORS/local file restrictions, e.g. VS Code Live Server or Python http.server:

```bash
cd "frontend"
python3 -m http.server 5500
```
Then open http://localhost:5500 in your browser.

The frontend calls `GET http://localhost:8080/api/menu` to render items.

## Notes
- CORS is enabled globally via `WebConfig` so the frontend can call the backend from `file://` or any `http://localhost:*` origin.
- Data is in-memory for demo purposes. Restarting the backend resets data.
- The legacy `Java Project/` folder remains untouched; the new app lives in `frontend/` + `backend/`.

## Next Steps (optional)
- Add persistence (PostgreSQL/MySQL) via Spring Data JPA.
- Implement authentication (Spring Security + JWT).
- Add order status updates (PREPARING/READY/COMPLETED) and websocket notifications.
