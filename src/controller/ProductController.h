#pragma once
#include <drogon/HttpController.h>
#include "../service/ProductService.h"

namespace jeevamart::controller {

class ProductController : public drogon::HttpController<ProductController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(ProductController::getProducts, "/api/products", drogon::Get);
    ADD_METHOD_TO(ProductController::getProductById, "/api/products/{id}", drogon::Get);
    ADD_METHOD_TO(ProductController::createProduct, "/api/products", drogon::Post, "RoleFilter:SELLER");
    ADD_METHOD_TO(ProductController::updateProduct, "/api/products/{id}", drogon::Put, "RoleFilter:SELLER");
    ADD_METHOD_TO(ProductController::deleteProduct, "/api/products/{id}", drogon::Delete, "RoleFilter:SELLER");
    METHOD_LIST_END

    void getProducts(const drogon::HttpRequestPtr& req,
                     std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void getProductById(const drogon::HttpRequestPtr& req,
                        std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                        int64_t id);

    void createProduct(const drogon::HttpRequestPtr& req,
                       std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void updateProduct(const drogon::HttpRequestPtr& req,
                       std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                       int64_t id);

    void deleteProduct(const drogon::HttpRequestPtr& req,
                       std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                       int64_t id);
};

class CartController : public drogon::HttpController<CartController> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(CartController::getCart, "/api/cart", drogon::Get, "AuthFilter");
    ADD_METHOD_TO(CartController::addToCart, "/api/cart", drogon::Post, "AuthFilter");
    ADD_METHOD_TO(CartController::updateCartItem, "/api/cart/{productId}", drogon::Put, "AuthFilter");
    ADD_METHOD_TO(CartController::removeFromCart, "/api/cart/{productId}", drogon::Delete, "AuthFilter");
    ADD_METHOD_TO(CartController::clearCart, "/api/cart", drogon::Delete, "AuthFilter");
    METHOD_LIST_END

    void getCart(const drogon::HttpRequestPtr& req,
                 std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void addToCart(const drogon::HttpRequestPtr& req,
                   std::function<void(const drogon::HttpResponsePtr&)>&& callback);

    void updateCartItem(const drogon::HttpRequestPtr& req,
                        std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                        int64_t productId);

    void removeFromCart(const drogon::HttpRequestPtr& req,
                        std::function<void(const drogon::HttpResponsePtr&)>&& callback,
                        int64_t productId);

    void clearCart(const drogon::HttpRequestPtr& req,
                   std::function<void(const drogon::HttpResponsePtr&)>&& callback);
};

} // namespace jeevamart::controller
