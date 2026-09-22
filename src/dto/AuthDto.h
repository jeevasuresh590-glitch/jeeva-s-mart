#pragma once
#include <string>
#include <nlohmann/json.hpp>
#include "../model/User.h"

namespace jeevamart::dto {

struct RegisterRequest {
    std::string name;
    std::string email;
    std::string password;
    std::string confirmPassword;
    std::string role; // BUYER or SELLER only

    static RegisterRequest fromJson(const nlohmann::json& j) {
        RegisterRequest req;
        if (j.contains("name")) req.name = j["name"].get<std::string>();
        if (j.contains("email")) req.email = j["email"].get<std::string>();
        if (j.contains("password")) req.password = j["password"].get<std::string>();
        if (j.contains("confirmPassword")) req.confirmPassword = j["confirmPassword"].get<std::string>();
        if (j.contains("role")) req.role = j["role"].get<std::string>();
        return req;
    }
};

struct LoginRequest {
    std::string email;
    std::string password;

    static LoginRequest fromJson(const nlohmann::json& j) {
        LoginRequest req;
        if (j.contains("email")) req.email = j["email"].get<std::string>();
        if (j.contains("password")) req.password = j["password"].get<std::string>();
        return req;
    }
};

struct AuthResponse {
    std::string token;
    model::User user;

    nlohmann::json toJson() const {
        return {
            {"token", token},
            {"user", user.toJson(false)}
        };
    }
};

struct UpdateProfileRequest {
    std::string name;
    std::string oldPassword;
    std::string newPassword;

    static UpdateProfileRequest fromJson(const nlohmann::json& j) {
        UpdateProfileRequest req;
        if (j.contains("name")) req.name = j["name"].get<std::string>();
        if (j.contains("oldPassword")) req.oldPassword = j["oldPassword"].get<std::string>();
        if (j.contains("newPassword")) req.newPassword = j["newPassword"].get<std::string>();
        return req;
    }
};

} // namespace jeevamart::dto
