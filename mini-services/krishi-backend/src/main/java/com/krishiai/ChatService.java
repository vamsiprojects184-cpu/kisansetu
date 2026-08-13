package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.sql.*;
import java.util.*;

public class ChatService implements HttpHandler {

    // Simple AI-like responses for common queries
    private static final Map<String, String> AI_RESPONSES = new HashMap<>();
    static {
        AI_RESPONSES.put("what should i grow", "Based on your soil health score and current season, I recommend **Tomato** (92% suitability) or **Brinjal** (88% suitability). Both match your soil type well and have strong market demand. Would you like detailed crop plans?");
        AI_RESPONSES.put("is irrigation needed", "Yes, irrigation is recommended today. Your tomato crop is in the flowering stage and soil moisture is at 32% (below optimal). I recommend **1,200 liters** of water between **6:00 AM - 8:00 AM** using drip irrigation.");
        AI_RESPONSES.put("why are my leaves yellow", "Yellowing leaves (chlorosis) can be caused by: 1) **Nitrogen deficiency** - your soil test showed low nitrogen, 2) **Overwatering** - check soil drainage, 3) **Pest infestation** - inspect for mites or aphids. I recommend checking the leaves closely.");
        AI_RESPONSES.put("market prices", "Here are today's prices: 🍅 Tomato ₹28/kg (↑8%), 🌶️ Chilli ₹180/kg (↑7%), 🧅 Onion ₹35/kg (↓18%), 🍆 Brinjal ₹25/kg (↑12%). AI predicts tomato prices may increase further in the next 7-14 days.");
        AI_RESPONSES.put("hello", "Hello! 👋 How can I help with your farm today? You can ask me about crop recommendations, weather, market prices, disease detection, or any farming question.");
        AI_RESPONSES.put("hi", "Hi there! 👋 Welcome to KrishiAI Assistant. How can I help you today?");
        AI_RESPONSES.put("fertilizer", "For your tomato crop in flowering stage, I recommend **NPK 10:26:26** at 30 kg/acre as side dressing. Apply along the rows and irrigate immediately after. Excess nitrogen can reduce fruit set.");
        AI_RESPONSES.put("weather", "Current conditions: ⛅ Partly Cloudy, 28°C, humidity 65%. Tomorrow: 🌧️ Light Rain expected (75% probability). Farming alert: Avoid fertilizer application before rain.");
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            if (path.equals("/api/chat") && method.equals("GET")) {
                handleGetChatHistory(exchange);
            } else if (path.equals("/api/chat") && method.equals("POST")) {
                handleSendMessage(exchange);
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Route not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Internal server error"));
        }
    }

    private void handleGetChatHistory(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        Map<String, String> queryParams = ServiceUtils.parseQueryParams(exchange.getRequestURI().getQuery());
        String targetUserId = queryParams.containsKey("user_id") ? queryParams.get("user_id") : userId;

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM chat_messages WHERE user_id = ? ORDER BY timestamp ASC")) {
            ps.setString(1, targetUserId);
            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> messages = new ArrayList<>();
            while (rs.next()) {
                messages.add(chatMessageFromResultSet(rs));
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(messages));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleSendMessage(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        String content = body.has("content") ? body.get("content").getAsString() : "";
        String role = body.has("role") ? body.get("role").getAsString() : "user";

        if (content.isEmpty()) {
            ServiceUtils.sendJson(exchange, 400, ServiceUtils.error("Message content is required"));
            return;
        }

        try (Connection conn = DbManager.getInstance().getConnection()) {
            // Save user message
            String userMsgId = "m" + UUID.randomUUID().toString().substring(0, 8);
            try (PreparedStatement ps = conn.prepareStatement(
                 "INSERT INTO chat_messages (id, user_id, role, content) VALUES (?,?,?,?)")) {
                ps.setString(1, userMsgId);
                ps.setString(2, userId);
                ps.setString(3, "user");
                ps.setString(4, content);
                ps.executeUpdate();
            }

            // Generate AI response
            String aiResponse = generateAIResponse(content);

            // Save AI response
            String aiMsgId = "m" + UUID.randomUUID().toString().substring(0, 8);
            try (PreparedStatement ps = conn.prepareStatement(
                 "INSERT INTO chat_messages (id, user_id, role, content) VALUES (?,?,?,?)")) {
                ps.setString(1, aiMsgId);
                ps.setString(2, userId);
                ps.setString(3, "assistant");
                ps.setString(4, aiResponse);
                ps.executeUpdate();
            }

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("userMessage", Map.of("id", userMsgId, "role", "user", "content", content));
            response.put("assistantMessage", Map.of("id", aiMsgId, "role", "assistant", "content", aiResponse));

            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(response));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private String generateAIResponse(String userMessage) {
        String lowerMsg = userMessage.toLowerCase().trim();

        for (Map.Entry<String, String> entry : AI_RESPONSES.entrySet()) {
            if (lowerMsg.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        // Check for specific keywords
        if (lowerMsg.contains("crop") || lowerMsg.contains("grow") || lowerMsg.contains("plant")) {
            return "For crop recommendations, I'd suggest considering Tomato, Brinjal, or Okra based on the current rabi season and your soil conditions. Each has good market demand and suits your region well. Would you like specific details for any of these?";
        }
        if (lowerMsg.contains("disease") || lowerMsg.contains("pest") || lowerMsg.contains("leaf")) {
            return "I can help with disease detection! Please describe the symptoms you're seeing on your plants - color changes, spots, wilting, etc. For best results, you can also use our disease scan feature to upload a photo of the affected plant.";
        }
        if (lowerMsg.contains("water") || lowerMsg.contains("irrigat")) {
            return "For irrigation guidance, your soil moisture is currently at 32%. Based on your crop stage and weather conditions, I recommend drip irrigation at 1,200 liters per acre. Best time is early morning (6-8 AM) to minimize evaporation.";
        }
        if (lowerMsg.contains("sell") || lowerMsg.contains("market") || lowerMsg.contains("price")) {
            return "Current market prices are favorable! Tomato at ₹28/kg (+8%), Chilli at ₹180/kg (+7%). For selling, I recommend checking with nearby collection centers. GreenAgri Center (4.2km) is currently open and accepting vegetables.";
        }
        if (lowerMsg.contains("soil") || lowerMsg.contains("fertili")) {
            return "Your latest soil test (Dec 15) showed a score of 82 (Good grade). Nitrogen is LOW - I recommend adding organic compost and vermicompost at 2 tonnes/acre. Phosphorus and potassium levels are optimal. Retest after 45 days of treatment.";
        }

        return "I'd be happy to help with your farm! You can ask me about:\n🌱 **Crop Recommendations** - Best crops for your soil and season\n💧 **Irrigation** - Water requirements and schedules\n📈 **Market Prices** - Current prices and predictions\n🐛 **Disease Detection** - Identify and treat plant diseases\n🧪 **Soil Health** - Soil testing and fertilizer advice\n\nWhat would you like to know more about?";
    }

    private Map<String, Object> chatMessageFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", rs.getString("id"));
        map.put("userId", rs.getString("user_id"));
        map.put("role", rs.getString("role"));
        map.put("content", rs.getString("content"));
        map.put("timestamp", rs.getString("timestamp"));
        return map;
    }
}
