#pragma once
#include <optional>
#include <vector>
#include <memory>
#include <drogon/drogon.h>
#include "../model/Product.h"
#include "../dto/ProductDto.h"

namespace jeevamart::repository {

class ProductRepository {
public:
    virtual ~ProductRepository() = default;
    virtual std::optional<model::Product> findById(int64_t id) = 0;
    virtual std::vector<model::Product> findAll(const dto::ProductFilterParams& params) = 0;
    virtual std::vector<model::Product> findBySellerId(int64_t sellerId) = 0;
    virtual model::Product create(const model::Product& product) = 0;
    virtual bool update(const model::Product& product) = 0;
    virtual bool deleteById(int64_t id) = 0;
    virtual size_t countProducts() = 0;
};

class PgProductRepository : public ProductRepository {
    drogon::orm::DbClientPtr dbClient_;
public:
    explicit PgProductRepository(drogon::orm::DbClientPtr dbClient);
    std::optional<model::Product> findById(int64_t id) override;
    std::vector<model::Product> findAll(const dto::ProductFilterParams& params) override;
    std::vector<model::Product> findBySellerId(int64_t sellerId) override;
    model::Product create(const model::Product& product) override;
    bool update(const model::Product& product) override;
    bool deleteById(int64_t id) override;
    size_t countProducts() override;
};

} // namespace jeevamart::repository
