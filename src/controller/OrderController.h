#pragma once
#include <drogon/HttpController.h>
#include "../service/OrderService.h"
#include "../service/ReviewService.h"
#include "../service/SellerService.h"
#include "../service/AdminService.h"

namespace jeevamart::controller {

class OrderController : public drogon::HttpController<OrderController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(OrderController::createOrder, "/api/orders", drogon::Post, "AuthFilter");
    ADD_METHOD_TO(OrderController::getOrders, "/api/orders", drogon::Get, "AuthFilter");
    ADD_METHOD_TO(OrderController::getOrderById, "/api/orders/{id}", drogon::Get, "AuthFilter");
    METHOD_LIST_END

    void createOrder(const drogon::HttpRequestPtr& req,
                     std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void getOrders(const drogon::HttpRequestPtr& req,
                   std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void getOrderById(const drogon::HttpRequestPtr& req,
                      std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                      int64_t id);
};

class ReviewController : public drogon::HttpController<ReviewController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(ReviewController::getProductReviews, "/api/products/{id}/reviews", drogon::Get);
    ADD_METHOD_TO(ReviewController::addReview, "/api/products/{id}/reviews", drogon::Post, "AuthFilter");
    METHOD_LIST_END

    void getProductReviews(const drogon::HttpRequestPtr& req,
                           std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                           int64_t id);

    void addReview(const drogon::HttpRequestPtr& req,
                   std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                   int64_t id);
};

class SellerController : public drogon::HttpController<SellerController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(SellerController::getProducts, "/api/seller/products", drogon::Get, "RoleFilter:SELLER");
    ADD_METHOD_TO(SellerController::getOrders, "/api/seller/orders", drogon::Get, "RoleFilter:SELLER");
    ADD_METHOD_TO(SellerController::getStats, "/api/seller/stats", drogon::Get, "RoleFilter:SELLER");
    METHOD_LIST_END

    void getProducts(const drogon::HttpRequestPtr& req,
                     std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void getOrders(const drogon::HttpRequestPtr& req,
                   std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void getStats(const drogon::HttpRequestPtr& req,
                  std::function<void(const drogon::HttpResponsePtr&)>&& callback);
};

class AdminController : public drogon::HttpController<AdminController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(AdminController::getUsers, "/api/admin/users", drogon::Get, "RoleFilter:ADMIN");
    ADD_METHOD_TO(AdminController::getProducts, "/api/admin/products", drogon::Get, "RoleFilter:ADMIN");
    ADD_METHOD_TO(AdminController::getOrders, "/api/admin/orders", drogon::Get, "RoleFilter:ADMIN");
    ADD_METHOD_TO(AdminController::getReviews, "/api/admin/reviews", drogon::Get, "RoleFilter:ADMIN");
    ADD_METHOD_TO(AdminController::deleteProduct, "/api/admin/products/{id}", drogon::Delete, "RoleFilter:ADMIN");
    ADD_METHOD_TO(AdminController::deleteReview, "/api/admin/reviews/{id}", drogon::Delete, "RoleFilter:ADMIN");
    ADD_METHOD_TO(AdminController::updateOrderStatus, "/api/admin/orders/{id}/status", drogon::Put, "RoleFilter:ADMIN");
    ADD_METHOD_TO(AdminController::getStats, "/api/admin/stats", drogon::Get, "RoleFilter:ADMIN");
    METHOD_LIST_END

    void getUsers(const drogon::HttpRequestPtr& req,
                  std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void getProducts(const drogon::HttpRequestPtr& req,
                     std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void getOrders(const drogon::HttpRequestPtr& req,
                   std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void getReviews(const drogon::HttpRequestPtr& req,
                    std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void deleteProduct(const drogon::HttpRequestPtr& req,
                       std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                       int64_t id);

    void deleteReview(const drogon::HttpRequestPtr& req,
                      std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                      int64_t id);

    void updateOrderStatus(const drogon::HttpRequestPtr& req,
                           std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                           int64_t id);

    void getStats(const drogon::HttpRequestPtr& req,
                  std::function<void(const drogon::HttpResponsePtr&)>&& callback);
};

} // namespace jeevamart::controller
