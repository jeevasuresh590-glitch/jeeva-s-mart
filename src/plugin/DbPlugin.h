#pragma once
#include <drogon/plugins/Plugin.h>
#include <drogon/orm/DbClient.h>

namespace jeevamart::plugin {

class DbPlugin : public drogon::Plugin<DbPlugin> {
public:
    void initAndStart(const Json::Value& config) override;
    void shutdown() override;
    drogon::orm::DbClientPtr getClient() const;
private:
    drogon::orm::DbClientPtr dbClient_;
};

} // namespace jeevamart::plugin
