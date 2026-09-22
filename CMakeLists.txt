cmake_minimum_required(VERSION 3.20)
project(JeevaMart VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Enable compiler warnings
if(MSVC)
    add_compile_options(/W4 /WX- /permissive-)
else()
    add_compile_options(-Wall -Wextra -Wpedantic)
endif()

# Find dependencies
find_package(Drogon CONFIG REQUIRED)
find_package(libpqxx CONFIG REQUIRED)
find_package(libsodium CONFIG REQUIRED)
find_package(nlohmann_json CONFIG REQUIRED)
find_package(jwt-cpp CONFIG REQUIRED)

# Project Include Directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/src
    ${CMAKE_CURRENT_SOURCE_DIR}/src/controller
    ${CMAKE_CURRENT_SOURCE_DIR}/src/service
    ${CMAKE_CURRENT_SOURCE_DIR}/src/repository
    ${CMAKE_CURRENT_SOURCE_DIR}/src/model
    ${CMAKE_CURRENT_SOURCE_DIR}/src/dto
    ${CMAKE_CURRENT_SOURCE_DIR}/src/filter
    ${CMAKE_CURRENT_SOURCE_DIR}/src/plugin
    ${CMAKE_CURRENT_SOURCE_DIR}/src/util
    ${CMAKE_CURRENT_SOURCE_DIR}/src/exception
)

# Source files
file(GLOB_RECURSE SOURCES
    "src/*.cpp"
    "src/*.h"
)

# Main Executable
add_executable(JeevaMart ${SOURCES})

target_link_libraries(JeevaMart PRIVATE
    Drogon::Drogon
    libpqxx::pqxx
    libsodium::libsodium
    nlohmann_json::nlohmann_json
    jwt-cpp::jwt-cpp
)

# Copy web static assets and database configuration to build directory
add_custom_command(TARGET JeevaMart POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${CMAKE_CURRENT_SOURCE_DIR}/web
    $<TARGET_FILE_DIR:JeevaMart>/web
)

if(EXISTS "${CMAKE_CURRENT_SOURCE_DIR}/config.json")
    add_custom_command(TARGET JeevaMart POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
        ${CMAKE_CURRENT_SOURCE_DIR}/config.json
        $<TARGET_FILE_DIR:JeevaMart>/config.json
    )
endif()

# Testing Support
enable_testing()
find_package(GTest CONFIG)
if(GTest_FOUND)
    file(GLOB_RECURSE TEST_SOURCES "test/*.cpp")
    if(TEST_SOURCES)
        add_executable(JeevaMartTests ${TEST_SOURCES}
            src/util/PasswordUtil.cpp
            src/util/Validator.cpp
            src/util/JwtUtil.cpp
        )
        target_link_libraries(JeevaMartTests PRIVATE
            GTest::gtest
            GTest::gtest_main
            libsodium::libsodium
            jwt-cpp::jwt-cpp
            nlohmann_json::nlohmann_json
        )
        add_test(NAME AllTests COMMAND JeevaMartTests)
    endif()
endif()
