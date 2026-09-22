#pragma once
#include <drogon/HttpController.h>
#include "../service/UserService.h"
#include "../service/LoginService.h"

namespace jeevamart::controller {

class AuthController : public drogon::HttpController<AuthController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(AuthController::registerUser, "/api/register", drogon::Post);
    ADD_METHOD_TO(AuthController::login, "/api/login", drogon::Post);
    ADD_METHOD_TO(AuthController::logout, "/api/logout", drogon::Post);
    ADD_METHOD_TO(AuthController::getProfile, "/api/profile", drogon::Get, "AuthFilter");
    ADD_METHOD_TO(AuthController::updateProfile, "/api/profile", drogon::Put, "AuthFilter");
    METHOD_LIST_END

    void registerUser(const drogon::HttpRequestPtr& req,
                      std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void login(const drogon::HttpRequestPtr& req,
               std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void logout(const drogon::HttpRequestPtr& req,
                std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void getProfile(const drogon::HttpRequestPtr& req,
                    std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void updateProfile(const drogon::HttpRequestPtr& req,
                       std::function<void(const drogon::HttpResponsePtr&)>&& callback);
};

} // namespace jeevamart::controller
