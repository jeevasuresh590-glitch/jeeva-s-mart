#pragma once
#include <vector>
#include <optional>
#include <drogon/drogon.h>
#include "../model/Cart.h"

namespace jeevamart::repository {

class CartRepository {
public:
    virtual ~CartRepository() = default;
    virtual std::vector<model::CartItem> findByUserId(int64_t userId) = 0;
    virtual bool upsertItem(int64_t userId, int64_t productId, int32_t quantity) = 0;
    virtual bool updateItemQuantity(int64_t userId, int64_t productId, int32_t quantity) = 0;
    virtual bool removeItem(int64_t userId, int64_t productId) = 0;
    virtual bool clearCart(int64_t userId) = 0;
};

class PgCartRepository : public CartRepository {
    drogon::orm::DbClientPtr dbClient_;
public:
    explicit PgCartRepository(drogon::orm::DbClientPtr dbClient);
    std::vector<model::CartItem> findByUserId(int64_t userId) override;
    bool upsertItem(int64_t userId, int64_t productId, int32_t quantity) override;
    bool updateItemQuantity(int64_t userId, int64_t productId, int32_t quantity) override;
    bool removeItem(int64_t userId, int64_t productId) override;
    bool clearCart(int64_t userId) override;
};

} // namespace jeevamart::repository
