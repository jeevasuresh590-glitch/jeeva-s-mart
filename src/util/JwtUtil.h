#pragma once
#include <string>
#include <cstdint>
#include "../model/User.h"

namespace jeevamart::util {

struct TokenPayload {
    int64_t userId{0};
    std::string email;
    model::UserRole role{model::UserRole::BUYER};
    bool valid{false};
};

class JwtUtil {
public:
    static std::string generateToken(const model::User& user, const std::string& secret, int64_t expirySeconds = 86400);
    static TokenPayload verifyToken(const std::string& token, const std::string& secret);
};

} // namespace jeevamart::util
