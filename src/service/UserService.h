#pragma once
#include <memory>
#include <string>
#include "../repository/UserRepository.h"
#include "../dto/AuthDto.h"

namespace jeevamart::service {

class UserService {
    std::shared_ptr<repository::UserRepository> userRepo_;
public:
    explicit UserService(std::shared_ptr<repository::UserRepository> userRepo)
        : userRepo_(std::move(userRepo)) {}

    model::User registerUser(const dto::RegisterRequest& req);
    model::User getProfile(int64_t userId);
    bool updateProfile(int64_t userId, const dto::UpdateProfileRequest& req);
};

class LoginService {
    std::shared_ptr<repository::UserRepository> userRepo_;
    std::string jwtSecret_;
public:
    LoginService(std::shared_ptr<repository::UserRepository> userRepo, std::string jwtSecret)
        : userRepo_(std::move(userRepo)), jwtSecret_(std::move(jwtSecret)) {}

    dto::AuthResponse authenticate(const dto::LoginRequest& req);
};

} // namespace jeevamart::service
