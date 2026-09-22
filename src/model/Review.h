#pragma once
#include <string>
#include <cstdint>
#include <nlohmann/json.hpp>

namespace jeevamart::model {

struct Review {
    int64_t id{0};
    int64_t productId{0};
    int64_t userId{0};
    std::string userName;
    int32_t rating{5};
    std::string comment;
    std::string createdAt;

    nlohmann::json toJson() const {
        return {
            {"id", id},
            {"productId", productId},
            {"userId", userId},
            {"userName", userName},
            {"rating", rating},
            {"comment", comment},
            {"createdAt", createdAt}
        };
    }
};

} // namespace jeevamart::model
