#include "JwtUtil.h"
#include <jwt-cpp/jwt.h>
#include <chrono>

namespace jeevamart::util {

std::string JwtUtil::generateToken(const model::User& user, const std::string& secret, int64_t expirySeconds) {
    auto now = std::chrono::system_clock::now();
    auto expiresAt = now + std::chrono::seconds(expirySeconds);

    auto token = jwt::create()
        .set_issuer("jeevamart")
        .set_issued_at(now)
        .set_expires_at(expiresAt)
        .set_payload_claim("userId", jwt::claim(std::to_string(user.id)))
        .set_payload_claim("email", jwt::claim(user.email))
        .set_payload_claim("role", jwt::claim(model::roleToString(user.role)))
        .sign(jwt::algorithm::hs256{secret});

    return token;
}

TokenPayload JwtUtil::verifyToken(const std::string& token, const std::string& secret) {
    TokenPayload payload;
    try {
        auto verifier = jwt::verify()
            .allow_algorithm(jwt::algorithm::hs256{secret})
            .with_issuer("jeevamart");

        auto decoded = jwt::decode(token);
        verifier.verify(decoded);

        if (decoded.has_payload_claim("userId")) {
            payload.userId = std::stoll(decoded.get_payload_claim("userId").as_string());
        }
        if (decoded.has_payload_claim("email")) {
            payload.email = decoded.get_payload_claim("email").as_string();
        }
        if (decoded.has_payload_claim("role")) {
            payload.role = model::stringToRole(decoded.get_payload_claim("role").as_string());
        }
        payload.valid = true;
    } catch (...) {
        payload.valid = false;
    }
    return payload;
}

} // namespace jeevamart::util
