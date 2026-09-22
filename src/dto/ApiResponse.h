#pragma once
#include <string>
#include <nlohmann/json.hpp>

namespace jeevamart::dto {

struct ApiResponse {
    bool success{true};
    std::string message;
    nlohmann::json data{nullptr};

    nlohmann::json toJson() const {
        nlohmann::json j = {
            {"success", success},
            {"message", message}
        };
        if (!data.is_null()) {
            j["data"] = data;
        }
        return j;
    }

    static ApiResponse ok(const std::string& msg, const nlohmann::json& payload = nullptr) {
        ApiResponse r;
        r.success = true;
        r.message = msg;
        r.data = payload;
        return r;
    }

    static ApiResponse error(const std::string& msg) {
        ApiResponse r;
        r.success = false;
        r.message = msg;
        r.data = nullptr;
        return r;
    }
};

} // namespace jeevamart::dto
