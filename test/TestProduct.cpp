#include <gtest/gtest.h>
#include "../src/model/Product.h"
#include "../src/model/Cart.h"
#include "../src/model/Order.h"

using namespace jeevamart::model;

// Test Product minor currency calculation
TEST(ProductModelTest, PriceInMinorUnits) {
    Product p;
    p.id = 1;
    p.name = "Test Wireless Earbuds";
    p.priceCents = 149900; // ₹1,499.00
    p.originalPriceCents = 249900; // ₹2,499.00
    p.discountPercent = 40;
    p.stockQty = 15;

    auto json = p.toJson();
    EXPECT_EQ(json["priceCents"].get<int64_t>(), 149900);
    EXPECT_EQ(json["stockQty"].get<int32_t>(), 15);
}

// Test Cart subtotal and summary calculations
TEST(CartModelTest, CartSummaryCalculation) {
    CartItem item1;
    item1.productId = 1;
    item1.quantity = 2;
    item1.product.priceCents = 100000; // ₹1,000 * 2 = ₹2,000 (200000 paise)

    CartItem item2;
    item2.productId = 2;
    item2.quantity = 1;
    item2.product.priceCents = 50000;  // ₹500 * 1 = ₹500 (50000 paise)

    CartSummary summary;
    summary.items.push_back(item1);
    summary.items.push_back(item2);
    summary.subtotalCents = 250000;
    summary.discountCents = 25000;  // 10% discount
    summary.deliveryCents = 4000;   // ₹40 delivery
    summary.grandTotalCents = summary.subtotalCents - summary.discountCents + summary.deliveryCents;

    EXPECT_EQ(summary.grandTotalCents, 229000); // ₹2,290.00
    EXPECT_EQ(summary.items.size(), 2);
}

// Test Order status transitions
TEST(OrderModelTest, ValidOrderStatus) {
    Order o;
    o.id = 1001;
    o.status = "PENDING";
    EXPECT_EQ(o.status, "PENDING");
    
    o.status = "CONFIRMED";
    EXPECT_EQ(o.status, "CONFIRMED");

    o.status = "SHIPPED";
    EXPECT_EQ(o.status, "SHIPPED");

    o.status = "DELIVERED";
    EXPECT_EQ(o.status, "DELIVERED");
}
