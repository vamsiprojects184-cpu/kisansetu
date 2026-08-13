package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.sql.*;
import java.util.*;

public class MarketService implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            if (path.equals("/api/market-prices") && method.equals("GET")) {
                handleGetMarketPrices(exchange);
            } else if (path.equals("/api/market-predictions") && method.equals("GET")) {
                handleGetMarketPredictions(exchange);
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Route not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Internal server error"));
        }
    }

    private void handleGetMarketPrices(HttpExchange exchange) throws IOException {
        Map<String, String> queryParams = ServiceUtils.parseQueryParams(exchange.getRequestURI().getQuery());
        try (Connection conn = DbManager.getInstance().getConnection()) {
            String sql = "SELECT * FROM market_prices ORDER BY crop ASC";
            PreparedStatement ps = conn.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> prices = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> price = new LinkedHashMap<>();
                price.put("crop", rs.getString("crop"));
                price.put("price", rs.getDouble("price"));
                price.put("unit", rs.getString("unit"));
                price.put("change", rs.getDouble("change"));
                price.put("changePercent", rs.getDouble("change_percent"));
                price.put("market", rs.getString("market"));
                price.put("date", rs.getString("date"));
                prices.add(price);
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(prices));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleGetMarketPredictions(HttpExchange exchange) throws IOException {
        Map<String, String> queryParams = ServiceUtils.parseQueryParams(exchange.getRequestURI().getQuery());
        String crop = queryParams.getOrDefault("crop", "Tomato");

        // Generate predictions based on current data
        Map<String, Object> prediction = new LinkedHashMap<>();
        prediction.put("crop", crop);

        if (crop.equalsIgnoreCase("Tomato")) {
            prediction.put("outlook", "Tomato prices may increase over the next 7-14 days due to reduced supply from Maharashtra and Karnataka regions. Cold wave conditions in northern markets are driving demand up.");
            prediction.put("direction", "up");
            prediction.put("confidence", "high");
            prediction.put("timeframe", "7-14 days");
            prediction.put("factors", Arrays.asList("Reduced supply from Maharashtra", "Cold wave increasing demand", "Transport disruptions in Karnataka", "Festival season demand pickup"));
        } else if (crop.equalsIgnoreCase("Chilli")) {
            prediction.put("outlook", "Chilli prices are trending upward. Guntur market reports strong export demand. Expect prices to remain firm for next 2-3 weeks.");
            prediction.put("direction", "up");
            prediction.put("confidence", "medium");
            prediction.put("timeframe", "2-3 weeks");
            prediction.put("factors", Arrays.asList("Strong export demand", "Reduced production in key areas", "Festival season demand", "Stock depletion in mandis"));
        } else if (crop.equalsIgnoreCase("Onion")) {
            prediction.put("outlook", "Onion prices are declining due to increased supply from new harvest. Prices may stabilize in 2-3 weeks once market adjusts.");
            prediction.put("direction", "down");
            prediction.put("confidence", "high");
            prediction.put("timeframe", "2-3 weeks");
            prediction.put("factors", Arrays.asList("New harvest arrivals", "Good production in Rajasthan", "Government stock release", "Seasonal abundance"));
        } else {
            prediction.put("outlook", "Market conditions are currently stable for " + crop + ". Monitor weather and supply conditions for changes.");
            prediction.put("direction", "stable");
            prediction.put("confidence", "medium");
            prediction.put("timeframe", "1-2 weeks");
            prediction.put("factors", Arrays.asList("Normal market conditions", "Seasonal supply patterns", "Local demand stable", "Weather conditions favorable"));
        }

        ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(prediction));
    }
}
