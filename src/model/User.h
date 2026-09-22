#pragma once
#include <string>
#include <cstdint>
#include <nlohmann/json.hpp>

namespace jeevamart::model {

enum class UserRole {
    BUYER,
    SELLER,
    ADMIN
};

inline std::string roleToString(UserRole role) {
    switch (role) {
        case UserRole::BUYER: return "BUYER";
        case UserRole::SELLER: return "SELLER";
        case UserRole::ADMIN: return "ADMIN";
        default: return "BUYER";
    }
}

inline UserRole stringToRole(const std::string& str) {
    if (str == "ADMIN") return UserRole::ADMIN;
    if (str == "SELLER") return UserRole::SELLER;
    return UserRole::BUYER;
}

struct User {
    int64_t id{0};
    std::string name;
    std::string email;
    std::string passwordHash;
    UserRole role{UserRole::BUYER};
    std::string createdAt;

    nlohmann::json toJson(bool includeHash = false) const {
        nlohmann::json j = {
            {"id", id},
            {"name", name},
            {"email", email},
            {"role", roleToString(role)},
            {"createdAt", createdAt}
        };
        if (includeHash) {
            j["passwordHash"] = passwordHash;
        }
        return j;
    }
};

} // namespace jeevamart::model
