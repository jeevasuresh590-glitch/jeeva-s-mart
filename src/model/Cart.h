#pragma once
#include <string>
#include <vector>
#include <cstdint>
#include <nlohmann/json.hpp>
#include "Product.h"

namespace jeevamart::model {

struct CartItem {
    int64_t id{0};
    int64_t userId{0};
    int64_t productId{0};
    int32_t quantity{1};
    Product product;

    nlohmann::json toJson() const {
        return {
            {"id", id},
            {"userId", userId},
            {"productId", productId},
            {"quantity", quantity},
            {"product", product.toJson()},
            {"subtotalCents", product.priceCents * quantity}
        };
    }
};

struct CartSummary {
    std::vector<CartItem> items;
    int64_t subtotalCents{0};
    int64_t discountCents{0};
    int64_t deliveryCents{0};
    int64_t grandTotalCents{0};

    nlohmann::json toJson() const {
        nlohmann::json itemsJson = nlohmann::json::array();
        for (const auto& item : items) {
            itemsJson.push_back(item.toJson());
        }
        return {
            {"items", itemsJson},
            {"subtotalCents", subtotalCents},
            {"discountCents", discountCents},
            {"deliveryCents", deliveryCents},
            {"grandTotalCents", grandTotalCents},
            {"itemCount", items.size()}
        };
    }
};

} // namespace jeevamart::model
