#pragma once
#include <string>

namespace jeevamart::util {

class Validator {
public:
    static bool isValidEmail(const std::string& email);
    static bool isValidPassword(const std::string& password);
    static bool isValidPhone(const std::string& phone);
    static bool isValidPincode(const std::string& pincode);
    static bool isValidRole(const std::string& role);
    static bool isValidRating(int rating);
};

} // namespace jeevamart::util
