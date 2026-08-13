package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.sql.*;
import java.util.*;

public class UserService implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            if (path.equals("/api/users") && method.equals("GET")) {
                handleGetAllUsers(exchange);
            } else if (path.startsWith("/api/users/") && method.equals("GET")) {
                String userId = ServiceUtils.extractIdFromPath(path, "/api/users/");
                handleGetUser(exchange, userId);
            } else if (path.startsWith("/api/users/") && method.equals("PUT")) {
                String userId = ServiceUtils.extractIdFromPath(path, "/api/users/");
                handleUpdateUser(exchange, userId);
            } else if (path.equals("/api/farmers") && method.equals("GET")) {
                handleGetFarmers(exchange);
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Route not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Internal server error"));
        }
    }

    private void handleGetAllUsers(HttpExchange exchange) throws IOException {
        try (Connection conn = DbManager.getInstance().getConnection();
             Statement stmt = conn.createStatement()) {
            ResultSet rs = stmt.executeQuery("SELECT * FROM users ORDER BY created_at DESC");
            List<Map<String, Object>> users = new ArrayList<>();
            while (rs.next()) {
                users.add(ServiceUtils.userFromResultSet(rs));
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(users));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleGetUser(HttpExchange exchange, String userId) throws IOException {
        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?")) {
            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(ServiceUtils.userFromResultSet(rs)));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("User not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleUpdateUser(HttpExchange exchange, String userId) throws IOException {
        JsonObject body = ServiceUtils.readBody(exchange);
        try (Connection conn = DbManager.getInstance().getConnection()) {
            StringBuilder sql = new StringBuilder("UPDATE users SET ");
            List<Object> params = new ArrayList<>();

            String[] fields = {"name", "email", "phone", "language", "state", "district", "village", "location"};
            List<String> setClauses = new ArrayList<>();
            for (String field : fields) {
                if (body.has(field) && !body.get(field).isJsonNull()) {
                    String dbField = field.equals("language") ? "language" : field;
                    setClauses.add(dbField + " = ?");
                    params.add(body.get(field).getAsString());
                }
            }
            if (body.has("isOnboarded")) {
                setClauses.add("is_onboarded = ?");
                params.add(body.get("isOnboarded").getAsBoolean() ? 1 : 0);
            }

            if (setClauses.isEmpty()) {
                ServiceUtils.sendJson(exchange, 400, ServiceUtils.error("No fields to update"));
                return;
            }

            sql.append(String.join(", ", setClauses)).append(" WHERE id = ?");
            params.add(userId);

            try (PreparedStatement ps = conn.prepareStatement(sql.toString())) {
                for (int i = 0; i < params.size(); i++) {
                    Object val = params.get(i);
                    if (val instanceof Integer) {
                        ps.setInt(i + 1, (Integer) val);
                    } else {
                        ps.setString(i + 1, val.toString());
                    }
                }
                int rows = ps.executeUpdate();
                if (rows > 0) {
                    // Return updated user
                    try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM users WHERE id = ?")) {
                        selPs.setString(1, userId);
                        ResultSet rs = selPs.executeQuery();
                        if (rs.next()) {
                            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(ServiceUtils.userFromResultSet(rs)));
                        } else {
                            ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("User not found"));
                        }
                    }
                } else {
                    ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("User not found"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleGetFarmers(HttpExchange exchange) throws IOException {
        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE role = 'farmer' ORDER BY created_at DESC")) {
            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> farmers = new ArrayList<>();
            while (rs.next()) {
                farmers.add(ServiceUtils.userFromResultSet(rs));
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(farmers));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }
}
