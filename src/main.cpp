#include <drogon/drogon.h>
#include <iostream>
#include <filesystem>

int main() {
    std::cout << "====================================================\n";
    std::cout << "   JEEVAMART C++20 REST API SERVER (DROGON)        \n";
    std::cout << "   Tagline: Smart Shopping. Simple. Secure.        \n";
    std::cout << "   College Major Project Demo - B.Tech IT          \n";
    std::cout << "====================================================\n";

    try {
        // Load configuration from config.json if available
        if (std::filesystem::exists("config.json")) {
            std::cout << "[INFO] Loading Drogon configuration from config.json...\n";
            drogon::app().loadConfigFile("config.json");
        } else {
            std::cout << "[INFO] config.json not found, using default settings (Port 8080)...\n";
            drogon::app()
                .addListener("0.0.0.0", 8080)
                .setDocumentRoot("./web")
                .setHomePage("login.html")
                .enableSession(86400);
        }

        // Global CORS and security headers middleware
        drogon::app().registerPreRoutingAdvice([](const drogon::HttpRequestPtr& req,
                                                  drogon::AdviceCallback&& acb,
                                                  drogon::AdviceChainCallback&& accb) {
            if (req->method() == drogon::HttpMethod::Options) {
                auto resp = drogon::HttpResponse::newHttpResponse();
                resp->addHeader("Access-Control-Allow-Origin", "*");
                resp->addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                resp->addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
                acb(resp);
                return;
            }
            accb();
        });

        std::cout << "[INFO] JeevaMart Server listening on http://0.0.0.0:8080\n";
        std::cout << "[INFO] Web Document Root served from: ./web\n";
        std::cout << "[INFO] Default page: login.html\n";

        drogon::app().run();
    } catch (const std::exception& e) {
        std::cerr << "[FATAL] Server terminated with exception: " << e.what() << "\n";
        return 1;
    }

    return 0;
}
