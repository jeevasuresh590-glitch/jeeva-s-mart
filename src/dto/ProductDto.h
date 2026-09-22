#pragma once
#include <string>
#include <cstdint>
#include <nlohmann/json.hpp>

namespace jeevamart::dto {

struct CreateProductRequest {
    std::string name;
    std::string description;
    int64_t priceCents{0};
    int64_t originalPriceCents{0};
    int32_t discountPercent{0};
    int32_t stockQty{0};
    std::string category;
    std::string imageUrl;

    static CreateProductRequest fromJson(const nlohmann::json& j) {
        CreateProductRequest req;
        if (j.contains("name")) req.name = j["name"].get<std::string>();
        if (j.contains("description")) req.description = j["description"].get<std::string>();
        if (j.contains("priceCents")) req.priceCents = j["priceCents"].get<int64_t>();
        if (j.contains("originalPriceCents")) req.originalPriceCents = j["originalPriceCents"].get<int64_t>();
        if (j.contains("discountPercent")) req.discountPercent = j["discountPercent"].get<int32_t>();
        if (j.contains("stockQty")) req.stockQty = j["stockQty"].get<int32_t>();
        if (j.contains("category")) req.category = j["category"].get<std::string>();
        if (j.contains("imageUrl")) req.imageUrl = j["imageUrl"].get<std::string>();
        return req;
    }
};

struct ProductFilterParams {
    std::string query;
    std::string category;
    int64_t minPriceCents{0};
    int64_t maxPriceCents{0};
    int32_t minRating{0};
    bool inStockOnly{false};
    std::string sortBy{"newest"}; // price_asc, price_desc, rating, newest
};

} // namespace jeevamart::dto
