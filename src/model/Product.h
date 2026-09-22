#pragma once
#include <string>
#include <cstdint>
#include <nlohmann/json.hpp>

namespace jeevamart::model {

struct Product {
    int64_t id{0};
    int64_t sellerId{0};
    std::string name;
    std::string description;
    int64_t priceCents{0};        // Minor currency units (paise)
    int64_t originalPriceCents{0};
    int32_t discountPercent{0};
    int32_t stockQty{0};
    std::string category;
    std::string imageUrl;
    std::string createdAt;
    
    // Virtual attributes calculated from reviews
    double averageRating{4.5};
    int32_t reviewCount{0};
    std::string sellerName;

    nlohmann::json toJson() const {
        return {
            {"id", id},
            {"sellerId", sellerId},
            {"sellerName", sellerName},
            {"name", name},
            {"description", description},
            {"priceCents", priceCents},
            {"originalPriceCents", originalPriceCents},
            {"discountPercent", discountPercent},
            {"stockQty", stockQty},
            {"category", category},
            {"imageUrl", imageUrl},
            {"createdAt", createdAt},
            {"averageRating", averageRating},
            {"reviewCount", reviewCount}
        };
    }
};

} // namespace jeevamart::model
