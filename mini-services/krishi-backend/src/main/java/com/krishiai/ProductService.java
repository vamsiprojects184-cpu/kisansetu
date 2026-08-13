package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.sql.*;
import java.util.*;

public class ProductService implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            if (path.equals("/api/products") && method.equals("GET")) {
                handleGetProducts(exchange);
            } else if (path.equals("/api/products") && method.equals("POST")) {
                handleCreateProduct(exchange);
            } else if (path.startsWith("/api/products/") && method.equals("GET")) {
                String productId = ServiceUtils.extractIdFromPath(path, "/api/products/");
                handleGetProduct(exchange, productId);
            } else if (path.startsWith("/api/products/") && method.equals("PUT")) {
                String productId = ServiceUtils.extractIdFromPath(path, "/api/products/");
                handleUpdateProduct(exchange, productId);
            } else if (path.startsWith("/api/products/") && method.equals("DELETE")) {
                String productId = ServiceUtils.extractIdFromPath(path, "/api/products/");
                handleDeleteProduct(exchange, productId);
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Route not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Internal server error"));
        }
    }

    private void handleGetProducts(HttpExchange exchange) throws IOException {
        Map<String, String> queryParams = ServiceUtils.parseQueryParams(exchange.getRequestURI().getQuery());

        StringBuilder sql = new StringBuilder("SELECT * FROM products WHERE 1=1");
        List<String> params = new ArrayList<>();

        // Category filter
        if (queryParams.containsKey("category")) {
            sql.append(" AND category = ?");
            params.add(queryParams.get("category"));
        }

        // Search filter
        if (queryParams.containsKey("search")) {
            sql.append(" AND (name LIKE ? OR description LIKE ?)");
            String search = "%" + queryParams.get("search") + "%";
            params.add(search);
            params.add(search);
        }

        // In stock filter
        if (queryParams.containsKey("in_stock")) {
            sql.append(" AND in_stock = ?");
            params.add(queryParams.get("in_stock"));
        }

        // Certified filter
        if (queryParams.containsKey("certified")) {
            sql.append(" AND is_certified = ?");
            params.add(queryParams.get("certified"));
        }

        // Farmer filter
        if (queryParams.containsKey("farmer_id")) {
            sql.append(" AND farmer_id = ?");
            params.add(queryParams.get("farmer_id"));
        }

        // Sort
        String sortField = queryParams.getOrDefault("sort", "created_at");
        String sortDir = queryParams.getOrDefault("order", "DESC");
        if (sortField.equals("price") || sortField.equals("rating") || sortField.equals("review_count") || sortField.equals("created_at")) {
            sql.append(" ORDER BY ").append(sortField).append(" ").append(sortDir);
        } else {
            sql.append(" ORDER BY created_at DESC");
        }

        // Limit
        if (queryParams.containsKey("limit")) {
            sql.append(" LIMIT ?");
            params.add(queryParams.get("limit"));
        }

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setString(i + 1, params.get(i));
            }
            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> products = new ArrayList<>();
            while (rs.next()) {
                products.add(ServiceUtils.productFromResultSet(rs));
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(products));
        } catch (SQLException e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleGetProduct(HttpExchange exchange, String productId) throws IOException {
        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM products WHERE id = ?")) {
            ps.setString(1, productId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(ServiceUtils.productFromResultSet(rs)));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Product not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleCreateProduct(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        String productId = body.has("id") ? body.get("id").getAsString() : "prod" + UUID.randomUUID().toString().substring(0, 8);

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement(
                 "INSERT INTO products (id, name, category, price, unit, rating, review_count, farmer_id, farmer_name, farmer_location, quality_score, harvest_date, in_stock, is_certified, germination, description, image_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")) {
            ps.setString(1, productId);
            ps.setString(2, body.has("name") ? body.get("name").getAsString() : "");
            ps.setString(3, body.has("category") ? body.get("category").getAsString() : null);
            ps.setDouble(4, body.has("price") ? body.get("price").getAsDouble() : 0);
            ps.setString(5, body.has("unit") ? body.get("unit").getAsString() : null);
            ps.setDouble(6, body.has("rating") ? body.get("rating").getAsDouble() : 0);
            ps.setInt(7, body.has("reviewCount") ? body.get("reviewCount").getAsInt() : 0);
            ps.setString(8, body.has("farmerId") ? body.get("farmerId").getAsString() : null);
            ps.setString(9, body.has("farmer") || body.has("farmerName") ? (body.has("farmerName") ? body.get("farmerName").getAsString() : body.get("farmer").getAsString()) : null);
            ps.setString(10, body.has("farmerLocation") ? body.get("farmerLocation").getAsString() : null);
            ps.setInt(11, body.has("qualityScore") ? body.get("qualityScore").getAsInt() : 0);
            ps.setString(12, body.has("harvestDate") ? body.get("harvestDate").getAsString() : null);
            ps.setInt(13, body.has("inStock") ? (body.get("inStock").getAsBoolean() ? 1 : 0) : 1);
            ps.setInt(14, body.has("isCertified") ? (body.get("isCertified").getAsBoolean() ? 1 : 0) : 0);
            ps.setString(15, body.has("germination") ? body.get("germination").getAsString() : null);
            ps.setString(16, body.has("description") ? body.get("description").getAsString() : null);
            ps.setString(17, body.has("imageUrl") ? body.get("imageUrl").getAsString() : null);
            ps.executeUpdate();

            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM products WHERE id = ?")) {
                selPs.setString(1, productId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    ServiceUtils.sendJson(exchange, 201, ServiceUtils.success(ServiceUtils.productFromResultSet(rs)));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleUpdateProduct(HttpExchange exchange, String productId) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        try (Connection conn = DbManager.getInstance().getConnection()) {
            StringBuilder sql = new StringBuilder("UPDATE products SET ");
            List<Object> params = new ArrayList<>();

            if (body.has("name")) { sql.append("name = ?, "); params.add(body.get("name").getAsString()); }
            if (body.has("category")) { sql.append("category = ?, "); params.add(body.get("category").getAsString()); }
            if (body.has("price")) { sql.append("price = ?, "); params.add(body.get("price").getAsDouble()); }
            if (body.has("unit")) { sql.append("unit = ?, "); params.add(body.get("unit").getAsString()); }
            if (body.has("rating")) { sql.append("rating = ?, "); params.add(body.get("rating").getAsDouble()); }
            if (body.has("reviewCount")) { sql.append("review_count = ?, "); params.add(body.get("reviewCount").getAsInt()); }
            if (body.has("farmerName") || body.has("farmer")) { sql.append("farmer_name = ?, "); params.add(body.has("farmerName") ? body.get("farmerName").getAsString() : body.get("farmer").getAsString()); }
            if (body.has("farmerLocation")) { sql.append("farmer_location = ?, "); params.add(body.get("farmerLocation").getAsString()); }
            if (body.has("qualityScore")) { sql.append("quality_score = ?, "); params.add(body.get("qualityScore").getAsInt()); }
            if (body.has("harvestDate")) { sql.append("harvest_date = ?, "); params.add(body.get("harvestDate").getAsString()); }
            if (body.has("inStock")) { sql.append("in_stock = ?, "); params.add(body.get("inStock").getAsBoolean() ? 1 : 0); }
            if (body.has("isCertified")) { sql.append("is_certified = ?, "); params.add(body.get("isCertified").getAsBoolean() ? 1 : 0); }
            if (body.has("germination")) { sql.append("germination = ?, "); params.add(body.get("germination").getAsString()); }
            if (body.has("description")) { sql.append("description = ?, "); params.add(body.get("description").getAsString()); }
            if (body.has("imageUrl")) { sql.append("image_url = ?, "); params.add(body.get("imageUrl").getAsString()); }

            if (params.isEmpty()) {
                ServiceUtils.sendJson(exchange, 400, ServiceUtils.error("No fields to update"));
                return;
            }

            String sqlStr = sql.toString().replaceAll(", $", "") + " WHERE id = ?";
            params.add(productId);

            try (PreparedStatement ps = conn.prepareStatement(sqlStr)) {
                for (int i = 0; i < params.size(); i++) {
                    Object val = params.get(i);
                    if (val instanceof Double) ps.setDouble(i + 1, (Double) val);
                    else if (val instanceof Integer) ps.setInt(i + 1, (Integer) val);
                    else ps.setString(i + 1, val.toString());
                }
                ps.executeUpdate();
            }

            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM products WHERE id = ?")) {
                selPs.setString(1, productId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(ServiceUtils.productFromResultSet(rs)));
                } else {
                    ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Product not found"));
                }
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleDeleteProduct(HttpExchange exchange, String productId) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM products WHERE id = ?")) {
            ps.setString(1, productId);
            int rows = ps.executeUpdate();
            if (rows > 0) {
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success("Product deleted"));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Product not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }
}
