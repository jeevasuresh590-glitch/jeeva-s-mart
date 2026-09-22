#pragma once
#include <vector>
#include <optional>
#include <drogon/drogon.h>
#include "../model/Order.h"
#include "../dto/CartDto.h"

namespace jeevamart::repository {

class OrderRepository {
public:
    virtual ~OrderRepository() = default;
    virtual std::optional<model::Order> findById(int64_t id) = 0;
    virtual std::vector<model::Order> findByBuyerId(int64_t buyerId) = 0;
    virtual std::vector<model::Order> findAll() = 0;
    virtual std::vector<model::Order> findBySellerId(int64_t sellerId) = 0;
    virtual model::Order createOrderWithItems(
        int64_t buyerId,
        const dto::CheckoutRequest& req,
        const std::vector<model::CartItem>& cartItems,
        int64_t totalAmountCents) = 0;
    virtual bool updateStatus(int64_t orderId, const std::string& status) = 0;
    virtual size_t countOrders() = 0;
    virtual int64_t sumTotalRevenueCents() = 0;
};

class PgOrderRepository : public OrderRepository {
    drogon::orm::DbClientPtr dbClient_;
public:
    explicit PgOrderRepository(drogon::orm::DbClientPtr dbClient);
    std::optional<model::Order> findById(int64_t id) override;
    std::vector<model::Order> findByBuyerId(int64_t buyerId) override;
    std::vector<model::Order> findAll() override;
    std::vector<model::Order> findBySellerId(int64_t sellerId) override;
    model::Order createOrderWithItems(
        int64_t buyerId,
        const dto::CheckoutRequest& req,
        const std::vector<model::CartItem>& cartItems,
        int64_t totalAmountCents) override;
    bool updateStatus(int64_t orderId, const std::string& status) override;
    size_t countOrders() override;
    int64_t sumTotalRevenueCents() override;
};

} // namespace jeevamart::repository
