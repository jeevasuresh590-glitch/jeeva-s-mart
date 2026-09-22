#pragma once
#include <drogon/HttpFilter.h>
#include "../util/JwtUtil.h"

namespace jeevamart::filter {

class AuthFilter : public drogon::HttpFilter<AuthFilter> {
public:
    void doFilter(const drogon::HttpRequestPtr& req,
                  drogon::FilterCallback&& fcb,
                  drogon::FilterChainCallback&& fccb) override;
};

class RoleFilter : public drogon::HttpFilter<RoleFilter> {
public:
    void doFilter(const drogon::HttpRequestPtr& req,
                  drogon::FilterCallback&& fcb,
                  drogon::FilterChainCallback&& fccb) override;
};

} // namespace jeevamart::filter
