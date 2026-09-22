#pragma once
#include <string>
#include <cstdint>
#include <nlohmann/json.hpp>

namespace jeevamart::dto {

struct AddToCartRequest {
    int64_t productId{0};
    int32_t quantity{1};

    static AddToCartRequest fromJson(const nlohmann::json& j) {
        AddToCartRequest req;
        if (j.contains("productId")) req.productId = j["productId"].get<int64_t>();
        if (j.contains("quantity")) req.quantity = j["quantity"].get<int32_t>();
        return req;
    }
};

struct UpdateCartRequest {
    int32_t quantity{1};

    static UpdateCartRequest fromJson(const nlohmann::json& j) {
        UpdateCartRequest req;
        if (j.contains("quantity")) req.quantity = j["quantity"].get<int32_t>();
        return req;
    }
};

struct CheckoutRequest {
    std::string shippingName;
    std::string shippingPhone;
    std::string shippingAddress;
    std::string shippingCity;
    std::string shippingState;
    std::string shippingPincode;
    std::string paymentMethod; // "Cash on Delivery", "Mock UPI", "Mock Card Payment"

    static CheckoutRequest fromJson(const nlohmann::json& j) {
        CheckoutRequest req;
        if (j.contains("shippingName")) req.shippingName = j["shippingName"].get<std::string>();
        if (j.contains("shippingPhone")) req.shippingPhone = j["shippingPhone"].get<std::string>();
        if (j.contains("shippingAddress")) req.shippingAddress = j["shippingAddress"].get<std::string>();
        if (j.contains("shippingCity")) req.shippingCity = j["shippingCity"].get<std::string>();
        if (j.contains("shippingState")) req.shippingState = j["shippingState"].get<std::string>();
        if (j.contains("shippingPincode")) req.shippingPincode = j["shippingPincode"].get<std::string>();
        if (j.contains("paymentMethod")) req.paymentMethod = j["paymentMethod"].get<std::string>();
        return req;
    }
};

struct AddReviewRequest {
    int32_t rating{5};
    std::string comment;

    static AddReviewRequest fromJson(const nlohmann::json& j) {
        AddReviewRequest req;
        if (j.contains("rating")) req.rating = j["rating"].get<int32_t>();
        if (j.contains("comment")) req.comment = j["comment"].get<std::string>();
        return req;
    }
};

} // namespace jeevamart::dto
