#include <gtest/gtest.h>
#include "../src/util/Validator.h"
#include "../src/util/PasswordUtil.h"
#include "../src/util/JwtUtil.h"

using namespace jeevamart::util;
using namespace jeevamart::model;

// Test 1: Email validation
TEST(ValidatorTest, ValidEmailCheck) {
    EXPECT_TRUE(Validator::isValidEmail("buyer@jeevamart.com"));
    EXPECT_TRUE(Validator::isValidEmail("seller.electronics@domain.co.in"));
    EXPECT_FALSE(Validator::isValidEmail("plainaddress"));
    EXPECT_FALSE(Validator::isValidEmail("@missingusername.com"));
    EXPECT_FALSE(Validator::isValidEmail("missingdomain@.com"));
    EXPECT_FALSE(Validator::isValidEmail(""));
}

// Test 2: Password validation
TEST(ValidatorTest, PasswordStrengthCheck) {
    EXPECT_TRUE(Validator::isValidPassword("Buyer@123"));
    EXPECT_TRUE(Validator::isValidPassword("123456"));
    EXPECT_FALSE(Validator::isValidPassword("12345")); // too short
    EXPECT_FALSE(Validator::isValidPassword(""));
}

// Test 3: Phone number validation
TEST(ValidatorTest, PhoneCheck) {
    EXPECT_TRUE(Validator::isValidPhone("9876543210"));
    EXPECT_TRUE(Validator::isValidPhone("7012345678"));
    EXPECT_FALSE(Validator::isValidPhone("1234567890")); // invalid starting digit
    EXPECT_FALSE(Validator::isValidPhone("987654321")); // only 9 digits
    EXPECT_FALSE(Validator::isValidPhone("987654321012")); // 12 digits
}

// Test 4: Pincode validation
TEST(ValidatorTest, PincodeCheck) {
    EXPECT_TRUE(Validator::isValidPincode("560001"));
    EXPECT_TRUE(Validator::isValidPincode("600028"));
    EXPECT_FALSE(Validator::isValidPincode("5600"));
    EXPECT_FALSE(Validator::isValidPincode("5600012"));
}

// Test 5: Role validation
TEST(ValidatorTest, RoleCheck) {
    EXPECT_TRUE(Validator::isValidRole("BUYER"));
    EXPECT_TRUE(Validator::isValidRole("SELLER"));
    EXPECT_FALSE(Validator::isValidRole("ADMIN")); // Cannot register as admin
    EXPECT_FALSE(Validator::isValidRole("SUPERUSER"));
}

// Test 6: Rating validation
TEST(ValidatorTest, RatingCheck) {
    EXPECT_TRUE(Validator::isValidRating(1));
    EXPECT_TRUE(Validator::isValidRating(5));
    EXPECT_FALSE(Validator::isValidRating(0));
    EXPECT_FALSE(Validator::isValidRating(6));
}

// Test 7: Password verification
TEST(PasswordUtilTest, VerifyPassword) {
    EXPECT_TRUE(PasswordUtil::verifyPassword("Admin@123", "$2a$12$K8yR2u1u5tVf0x4c2y9q1eJ4p2h9m4l5n6o7p8q9r0s1t2u3v4w5x"));
    EXPECT_TRUE(PasswordUtil::verifyPassword("Buyer@123", "$2a$12$K8yR2u1u5tVf0x4c2y9q1eJ4p2h9m4l5n6o7p8q9r0s1t2u3v4w5z"));
}
