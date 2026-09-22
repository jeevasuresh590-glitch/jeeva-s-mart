#include "Validator.h"
#include <regex>

namespace jeevamart::util {

bool Validator::isValidEmail(const std::string& email) {
    if (email.empty() || email.length() > 150) return false;
    const std::regex pattern(R"(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)");
    return std::regex_match(email, pattern);
}

bool Validator::isValidPassword(const std::string& password) {
    // Minimum 6 characters
    return password.length() >= 6;
}

bool Validator::isValidPhone(const std::string& phone) {
    // 10 digits for Indian mobile numbers
    const std::regex pattern(R"(^[6-9]\d{9}$)");
    return std::regex_match(phone, pattern);
}

bool Validator::isValidPincode(const std::string& pincode) {
    // 6 digits
    const std::regex pattern(R"(^\d{6}$)");
    return std::regex_match(pincode, pattern);
}

bool Validator::isValidRole(const std::string& role) {
    return role == "BUYER" || role == "SELLER";
}

bool Validator::isValidRating(int rating) {
    return rating >= 1 && rating <= 5;
}

} // namespace jeevamart::util
