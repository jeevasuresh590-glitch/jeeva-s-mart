#pragma once
#include <optional>
#include <vector>
#include <memory>
#include <drogon/drogon.h>
#include "../model/User.h"

namespace jeevamart::repository {

class UserRepository {
public:
    virtual ~UserRepository() = default;
    virtual std::optional<model::User> findById(int64_t id) = 0;
    virtual std::optional<model::User> findByEmail(const std::string& email) = 0;
    virtual model::User create(const model::User& user) = 0;
    virtual bool updateProfile(int64_t id, const std::string& name, const std::string& passwordHash = "") = 0;
    virtual std::vector<model::User> findAll() = 0;
    virtual size_t countUsers() = 0;
    virtual size_t countByRole(model::UserRole role) = 0;
};

class PgUserRepository : public UserRepository {
    drogon::orm::DbClientPtr dbClient_;
public:
    explicit PgUserRepository(drogon::orm::DbClientPtr dbClient);
    std::optional<model::User> findById(int64_t id) override;
    std::optional<model::User> findByEmail(const std::string& email) override;
    model::User create(const model::User& user) override;
    bool updateProfile(int64_t id, const std::string& name, const std::string& passwordHash = "") override;
    std::vector<model::User> findAll() override;
    size_t countUsers() override;
    size_t countByRole(model::UserRole role) override;
};

} // namespace jeevamart::repository
