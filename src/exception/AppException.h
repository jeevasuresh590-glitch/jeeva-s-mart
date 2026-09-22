#pragma once
#include <stdexcept>
#include <string>

namespace jeevamart::exception {

class AppException : public std::runtime_error {
    int statusCode_{400};
public:
    AppException(const std::string& message, int statusCode = 400)
        : std::runtime_error(message), statusCode_(statusCode) {}

    int getStatusCode() const noexcept { return statusCode_; }
};

class NotFoundException : public AppException {
public:
    explicit NotFoundException(const std::string& message = "Resource not found")
        : AppException(message, 404) {}
};

class UnauthorizedException : public AppException {
public:
    explicit NotFoundException(const std::string& message = "Unauthorized access")
        : AppException(message, 401) {}
};

class ForbiddenException : public AppException {
public:
    explicit ForbiddenException(const std::string& message = "Access forbidden")
        : AppException(message, 403) {}
};

class BadRequestException : public AppException {
public:
    explicit BadRequestException(const std::string& message = "Bad request")
        : AppException(message, 400) {}
};

class InsufficientStockException : public AppException {
public:
    explicit InsufficientStockException(const std::string& message = "Insufficient stock for requested item")
        : AppException(message, 409) {}
};

} // namespace jeevamart::exception
