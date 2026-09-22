#pragma once
#include <memory>
#include <vector>
#include <optional>
#include "../repository/ProductRepository.h"
#include "../repository/CartRepository.h"
#include "../repository/OrderRepository.h"
#include "../repository/ReviewRepository.h"
#include "../repository/UserRepository.h"
#include "../dto/ProductDto.h"
#include "../dto/CartDto.h"

namespace jeevamart::service {

class ProductService {
    std::shared_ptr<repository::ProductRepository> productRepo_;
public:
    explicit ProductService(std::shared_ptr<repository::ProductRepository> productRepo)
        : productRepo_(std::move(productRepo)) {}

    std::vector<model::Product> getProducts(const dto::ProductFilterParams& params);
    model::Product getProductById(int64_t id);
};

class CartService {
    std::shared_ptr<repository::CartRepository> cartRepo_;
    std::shared_ptr<repository::ProductRepository> productRepo_;
public:
    CartService(std::shared_ptr<repository::CartRepository> cartRepo,
                std::shared_ptr<repository::ProductRepository> productRepo)
        : cartRepo_(std::move(cartRepo)), productRepo_(std::move(productRepo)) {}

    model::CartSummary getCart(int64_t userId);
    void addToCart(int64_t userId, const dto::AddToCartRequest& req);
    void updateQuantity(int64_t userId, int64_t productId, int32_t quantity);
    void removeFromCart(int64_t userId, int64_t productId);
    void clearCart(int64_t userId);
};

class OrderService {
    std::shared_ptr<repository::OrderRepository> orderRepo_;
    std::shared_ptr<repository::CartRepository> cartRepo_;
    std::shared_ptr<repository::ProductRepository> productRepo_;
public:
    OrderService(std::shared_ptr<repository::OrderRepository> orderRepo,
                 std::shared_ptr<repository::CartRepository> cartRepo,
                 std::shared_ptr<repository::ProductRepository> productRepo)
        : orderRepo_(std::move(orderRepo)), cartRepo_(std::move(cartRepo)), productRepo_(std::move(productRepo)) {}

    model::Order createOrder(int64_t buyerId, const dto::CheckoutRequest& req);
    std::vector<model::Order> getBuyerOrders(int64_t buyerId);
    model::Order getOrderById(int64_t orderId, int64_t userId, const std::string& role);
};

class ReviewService {
    std::shared_ptr<repository::ReviewRepository> reviewRepo_;
public:
    explicit ReviewService(std::shared_ptr<repository::ReviewRepository> reviewRepo)
        : reviewRepo_(std::move(reviewRepo)) {}

    std::vector<model::Review> getReviews(int64_t productId);
    model::Review addReview(int64_t productId, int64_t userId, const dto::AddReviewRequest& req);
};

class SellerService {
    std::shared_ptr<repository::ProductRepository> productRepo_;
    std::shared_ptr<repository::OrderRepository> orderRepo_;
public:
    SellerService(std::shared_ptr<repository::ProductRepository> productRepo,
                  std::shared_ptr<repository::OrderRepository> orderRepo)
        : productRepo_(std::move(productRepo)), orderRepo_(std::move(orderRepo)) {}

    std::vector<model::Product> getSellerProducts(int64_t sellerId);
    model::Product createProduct(int64_t sellerId, const dto::CreateProductRequest& req);
    model::Product updateProduct(int64_t sellerId, int64_t productId, const dto::CreateProductRequest& req);
    bool deleteProduct(int64_t sellerId, int64_t productId);
    std::vector<model::Order> getSellerOrders(int64_t sellerId);
    nlohmann::json getSellerStats(int64_t sellerId);
};

class AdminService {
    std::shared_ptr<repository::UserRepository> userRepo_;
    std::shared_ptr<repository::ProductRepository> productRepo_;
    std::shared_ptr<repository::OrderRepository> orderRepo_;
    std::shared_ptr<repository::ReviewRepository> reviewRepo_;
public:
    AdminService(std::shared_ptr<repository::UserRepository> userRepo,
                 std::shared_ptr<repository::ProductRepository> productRepo,
                 std::shared_ptr<repository::OrderRepository> orderRepo,
                 std::shared_ptr<repository::ReviewRepository> reviewRepo)
        : userRepo_(std::move(userRepo)), productRepo_(std::move(productRepo)),
          orderRepo_(std::move(orderRepo)), reviewRepo_(std::move(reviewRepo)) {}

    std::vector<model::User> getAllUsers();
    std::vector<model::Product> getAllProducts();
    std::vector<model::Order> getAllOrders();
    std::vector<model::Review> getAllReviews();
    bool deleteProduct(int64_t productId);
    bool deleteReview(int64_t reviewId);
    bool updateOrderStatus(int64_t orderId, const std::string& status);
    nlohmann::json getDashboardStats();
};

} // namespace jeevamart::service
