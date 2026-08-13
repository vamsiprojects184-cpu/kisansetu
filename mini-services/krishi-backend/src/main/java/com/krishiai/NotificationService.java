package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.sql.*;
import java.util.*;

public class NotificationService implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            if (path.equals("/api/notifications") && method.equals("GET")) {
                handleGetNotifications(exchange);
            } else if (path.equals("/api/notifications") && method.equals("POST")) {
                handleCreateNotification(exchange);
            } else if (path.startsWith("/api/notifications/") && method.equals("PUT")) {
                String notifId = ServiceUtils.extractIdFromPath(path, "/api/notifications/");
                handleMarkRead(exchange, notifId);
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Route not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Internal server error"));
        }
    }

    private void handleGetNotifications(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        Map<String, String> queryParams = ServiceUtils.parseQueryParams(exchange.getRequestURI().getQuery());
        try (Connection conn = DbManager.getInstance().getConnection()) {
            String sql;
            PreparedStatement ps;
            if (queryParams.containsKey("user_id")) {
                sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
                ps = conn.prepareStatement(sql);
                ps.setString(1, queryParams.get("user_id"));
            } else {
                sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
                ps = conn.prepareStatement(sql);
                ps.setString(1, userId);
            }

            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> notifications = new ArrayList<>();
            while (rs.next()) {
                notifications.add(notificationFromResultSet(rs));
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(notifications));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleCreateNotification(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        String notifId = body.has("id") ? body.get("id").getAsString() : "n" + UUID.randomUUID().toString().substring(0, 8);

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement(
                 "INSERT INTO notifications (id, user_id, title, message, type, is_read, icon) VALUES (?,?,?,?,?,?,?)")) {
            ps.setString(1, notifId);
            ps.setString(2, body.has("userId") ? body.get("userId").getAsString() : userId);
            ps.setString(3, body.has("title") ? body.get("title").getAsString() : null);
            ps.setString(4, body.has("message") ? body.get("message").getAsString() : null);
            ps.setString(5, body.has("type") ? body.get("type").getAsString() : "info");
            ps.setInt(6, body.has("read") ? (body.get("read").getAsBoolean() ? 1 : 0) : 0);
            ps.setString(7, body.has("icon") ? body.get("icon").getAsString() : null);
            ps.executeUpdate();

            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM notifications WHERE id = ?")) {
                selPs.setString(1, notifId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    ServiceUtils.sendJson(exchange, 201, ServiceUtils.success(notificationFromResultSet(rs)));
                }
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleMarkRead(HttpExchange exchange, String notifId) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?")) {
            ps.setString(1, notifId);
            ps.setString(2, userId);
            int rows = ps.executeUpdate();
            if (rows > 0) {
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success("Notification marked as read"));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Notification not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private Map<String, Object> notificationFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", rs.getString("id"));
        map.put("userId", rs.getString("user_id"));
        map.put("title", rs.getString("title"));
        map.put("message", rs.getString("message"));
        map.put("type", rs.getString("type"));
        map.put("read", rs.getInt("is_read") == 1);
        map.put("createdAt", rs.getString("created_at"));
        map.put("icon", rs.getString("icon"));
        return map;
    }
}
