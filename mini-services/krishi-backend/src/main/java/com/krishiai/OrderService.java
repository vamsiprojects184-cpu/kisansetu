package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.sql.*;
import java.util.*;

public class OrderService implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            if (path.equals("/api/orders") && method.equals("GET")) {
                handleGetOrders(exchange);
            } else if (path.equals("/api/orders") && method.equals("POST")) {
                handleCreateOrder(exchange);
            } else if (path.startsWith("/api/orders/") && method.equals("GET")) {
                String orderId = ServiceUtils.extractIdFromPath(path, "/api/orders/");
                handleGetOrder(exchange, orderId);
            } else if (path.equals("/api/cart") && method.equals("GET")) {
                handleGetCart(exchange);
            } else if (path.equals("/api/cart") && method.equals("POST")) {
                handleAddToCart(exchange);
            } else if (path.equals("/api/cart") && method.equals("DELETE")) {
                handleClearCart(exchange);
            } else if (path.startsWith("/api/cart/") && method.equals("DELETE")) {
                String cartItemId = ServiceUtils.extractIdFromPath(path, "/api/cart/");
                handleRemoveFromCart(exchange, cartItemId);
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Route not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Internal server error"));
        }
    }

    // ==================== ORDERS ====================

    private void handleGetOrders(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        Map<String, String> queryParams = ServiceUtils.parseQueryParams(exchange.getRequestURI().getQuery());
        try (Connection conn = DbManager.getInstance().getConnection()) {
            String sql;
            PreparedStatement ps;
            if (queryParams.containsKey("user_id")) {
                sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
                ps = conn.prepareStatement(sql);
                ps.setString(1, queryParams.get("user_id"));
            } else if (queryParams.containsKey("status")) {
                sql = "SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC";
                ps = conn.prepareStatement(sql);
                ps.setString(1, queryParams.get("status"));
            } else {
                sql = "SELECT * FROM orders ORDER BY created_at DESC";
                ps = conn.prepareStatement(sql);
            }

            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> orders = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> order = ServiceUtils.orderFromResultSet(rs);
                // Parse items JSON and enrich with product data
                order.put("items", enrichOrderItems(conn, order.get("itemsJson").toString()));
                orders.add(order);
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(orders));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private List<Map<String, Object>> enrichOrderItems(Connection conn, String itemsJson) throws SQLException {
        List<Map<String, Object>> enriched = new ArrayList<>();
        try {
            JsonArray items = JsonParser.parseString(itemsJson).getAsJsonArray();
            for (JsonElement item : items) {
                JsonObject obj = item.getAsJsonObject();
                Map<String, Object> itemMap = new LinkedHashMap<>();
                itemMap.put("productId", obj.has("productId") ? obj.get("productId").getAsString() : "");
                itemMap.put("quantity", obj.has("quantity") ? obj.get("quantity").getAsInt() : 1);

                // Fetch product data
                try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM products WHERE id = ?")) {
                    ps.setString(1, itemMap.get("productId").toString());
                    ResultSet rs = ps.executeQuery();
                    if (rs.next()) {
                        itemMap.put("product", ServiceUtils.productFromResultSet(rs));
                    }
                }
                enriched.add(itemMap);
            }
        } catch (Exception e) {
            // JSON parse error, return raw
        }
        return enriched;
    }

    private void handleGetOrder(HttpExchange exchange, String orderId) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM orders WHERE id = ?")) {
            ps.setString(1, orderId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Map<String, Object> order = ServiceUtils.orderFromResultSet(rs);
                order.put("items", enrichOrderItems(conn, order.get("itemsJson").toString()));
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(order));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Order not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleCreateOrder(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        String orderId = body.has("id") ? body.get("id").getAsString() : "ORD-" + UUID.randomUUID().toString().substring(0, 8);
        JsonArray items = body.has("items") ? body.get("items").getAsJsonArray() : new JsonArray();
        double total = body.has("total") ? body.get("total").getAsDouble() : 0;

        try (Connection conn = DbManager.getInstance().getConnection()) {
            // Create order
            try (PreparedStatement ps = conn.prepareStatement(
                 "INSERT INTO orders (id, user_id, items_json, total, status, delivery_address, delivery_method, payment_method, estimated_delivery) VALUES (?,?,?,?,?,?,?,?,?)")) {
                ps.setString(1, orderId);
                ps.setString(2, body.has("userId") ? body.get("userId").getAsString() : userId);
                ps.setString(3, items.toString());
                ps.setDouble(4, total);
                ps.setString(5, body.has("status") ? body.get("status").getAsString() : "placed");
                ps.setString(6, body.has("deliveryAddress") ? body.get("deliveryAddress").getAsString() : null);
                ps.setString(7, body.has("deliveryMethod") ? body.get("deliveryMethod").getAsString() : null);
                ps.setString(8, body.has("paymentMethod") ? body.get("paymentMethod").getAsString() : null);
                ps.setString(9, body.has("estimatedDelivery") ? body.get("estimatedDelivery").getAsString() : null);
                ps.executeUpdate();
            }

            // Clear user's cart
            try (PreparedStatement ps = conn.prepareStatement("DELETE FROM cart_items WHERE user_id = ?")) {
                ps.setString(1, userId);
                ps.executeUpdate();
            }

            // Return created order
            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM orders WHERE id = ?")) {
                selPs.setString(1, orderId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    Map<String, Object> order = ServiceUtils.orderFromResultSet(rs);
                    order.put("items", enrichOrderItems(conn, order.get("itemsJson").toString()));
                    ServiceUtils.sendJson(exchange, 201, ServiceUtils.success(order));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    // ==================== CART ====================

    private void handleGetCart(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement(
                 "SELECT ci.*, p.name, p.category, p.price, p.unit, p.rating, p.review_count, p.farmer_name, p.farmer_location, p.quality_score, p.harvest_date, p.in_stock, p.is_certified, p.germination, p.description, p.image_url FROM cart_items ci LEFT JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ?")) {
            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> cart = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("id", rs.getString("id"));
                item.put("userId", rs.getString("user_id"));
                item.put("productId", rs.getString("product_id"));
                item.put("quantity", rs.getInt("quantity"));

                Map<String, Object> product = new LinkedHashMap<>();
                product.put("id", rs.getString("product_id"));
                product.put("name", rs.getString("name"));
                product.put("category", rs.getString("category"));
                product.put("price", rs.getDouble("price"));
                product.put("unit", rs.getString("unit"));
                product.put("rating", rs.getDouble("rating"));
                product.put("reviewCount", rs.getInt("review_count"));
                product.put("farmer", rs.getString("farmer_name"));
                product.put("farmerLocation", rs.getString("farmer_location"));
                product.put("qualityScore", rs.getInt("quality_score"));
                product.put("harvestDate", rs.getString("harvest_date"));
                product.put("inStock", rs.getInt("in_stock") == 1);
                product.put("isCertified", rs.getInt("is_certified") == 1);
                product.put("germination", rs.getString("germination"));
                product.put("description", rs.getString("description"));
                product.put("imageUrl", rs.getString("image_url"));
                item.put("product", product);
                cart.add(item);
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(cart));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleAddToCart(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        String productId = body.has("productId") ? body.get("productId").getAsString() : body.has("product_id") ? body.get("product_id").getAsString() : "";
        int quantity = body.has("quantity") ? body.get("quantity").getAsInt() : 1;

        if (productId.isEmpty()) {
            ServiceUtils.sendJson(exchange, 400, ServiceUtils.error("Product ID is required"));
            return;
        }

        try (Connection conn = DbManager.getInstance().getConnection()) {
            // Check if product exists
            try (PreparedStatement checkPs = conn.prepareStatement("SELECT id FROM products WHERE id = ?")) {
                checkPs.setString(1, productId);
                ResultSet checkRs = checkPs.executeQuery();
                if (!checkRs.next()) {
                    ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Product not found"));
                    return;
                }
            }

            // Check if already in cart
            try (PreparedStatement checkCart = conn.prepareStatement("SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?")) {
                checkCart.setString(1, userId);
                checkCart.setString(2, productId);
                ResultSet cartRs = checkCart.executeQuery();
                if (cartRs.next()) {
                    // Update quantity
                    int existingQty = cartRs.getInt("quantity");
                    String cartItemId = cartRs.getString("id");
                    try (PreparedStatement updatePs = conn.prepareStatement("UPDATE cart_items SET quantity = ? WHERE id = ?")) {
                        updatePs.setInt(1, existingQty + quantity);
                        updatePs.setString(2, cartItemId);
                        updatePs.executeUpdate();
                    }
                } else {
                    // Insert new cart item
                    String cartItemId = "ci" + UUID.randomUUID().toString().substring(0, 8);
                    try (PreparedStatement insertPs = conn.prepareStatement("INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?,?,?,?)")) {
                        insertPs.setString(1, cartItemId);
                        insertPs.setString(2, userId);
                        insertPs.setString(3, productId);
                        insertPs.setInt(4, quantity);
                        insertPs.executeUpdate();
                    }
                }
            }

            // Return updated cart
            handleGetCart(exchange);
        } catch (SQLException e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleRemoveFromCart(HttpExchange exchange, String cartItemId) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM cart_items WHERE id = ? AND user_id = ?")) {
            ps.setString(1, cartItemId);
            ps.setString(2, userId);
            int rows = ps.executeUpdate();
            if (rows > 0) {
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success("Item removed from cart"));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Cart item not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleClearCart(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM cart_items WHERE user_id = ?")) {
            ps.setString(1, userId);
            ps.executeUpdate();
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success("Cart cleared"));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }
}
