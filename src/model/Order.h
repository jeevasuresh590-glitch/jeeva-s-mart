#pragma once
#include <string>
#include <vector>
#include <cstdint>
#include <nlohmann/json.hpp>
#include "Product.h"

namespace jeevamart::model {

struct OrderItem {
    int64_t id{0};
    int64_t orderId{0};
    int64_t productId{0};
    int32_t quantity{1};
    int64_t unitPriceCents{0};
    std::string productName;
    std::string productImageUrl;

    nlohmann::json toJson() const {
        return {
            {"id", id},
            {"orderId", orderId},
            {"productId", productId},
            {"quantity", quantity},
            {"unitPriceCents", unitPriceCents},
            {"productName", productName},
            {"productImageUrl", productImageUrl},
            {"subtotalCents", unitPriceCents * quantity}
        };
    }
};

struct Order {
    int64_t id{0};
    int64_t buyerId{0};
    std::string buyerName;
    std::string buyerEmail;
    std::string status{"PENDING"}; // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    int64_t totalAmountCents{0};
    std::string shippingName;
    std::string shippingPhone;
    std::string shippingAddress;
    std::string shippingCity;
    std::string shippingState;
    std::string shippingPincode;
    std::string paymentMethod{"Cash on Delivery"};
    std::string paymentStatus{"PAID"};
    std::string createdAt;
    std::vector<OrderItem> items;

    nlohmann::json toJson() const {
        nlohmann::json itemsJson = nlohmann::json::array();
        for (const auto& item : items) {
            itemsJson.push_back(item.toJson());
        }
        return {
            {"id", id},
            {"buyerId", buyerId},
            {"buyerName", buyerName},
            {"buyerEmail", buyerEmail},
            {"status", status},
            {"totalAmountCents", totalAmountCents},
            {"shippingName", shippingName},
            {"shippingPhone", shippingPhone},
            {"shippingAddress", shippingAddress},
            {"shippingCity", shippingCity},
            {"shippingState", shippingState},
            {"shippingPincode", shippingPincode},
            {"paymentMethod", paymentMethod},
            {"paymentStatus", paymentStatus},
            {"createdAt", createdAt},
            {"items", itemsJson}
        };
    }
};

} // namespace jeevamart::model
