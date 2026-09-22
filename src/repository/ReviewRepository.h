#pragma once
#include <vector>
#include <drogon/drogon.h>
#include "../model/Review.h"

namespace jeevamart::repository {

class ReviewRepository {
public:
    virtual ~ReviewRepository() = default;
    virtual std::vector<model::Review> findByProductId(int64_t productId) = 0;
    virtual std::vector<model::Review> findAll() = 0;
    virtual model::Review create(int64_t productId, int64_t userId, int32_t rating, const std::string& comment) = 0;
    virtual bool deleteById(int64_t id) = 0;
};

class PgReviewRepository : public ReviewRepository {
    drogon::orm::DbClientPtr dbClient_;
public:
    explicit PgReviewRepository(drogon::orm::DbClientPtr dbClient);
    std::vector<model::Review> findByProductId(int64_t productId) override;
    std::vector<model::Review> findAll() override;
    model::Review create(int64_t productId, int64_t userId, int32_t rating, const std::string& comment) override;
    bool deleteById(int64_t id) override;
};

} // namespace jeevamart::repository
