const dbSchemas = require("./dbSchemas");

module.exports = {
    scheduledRefreshContexts: async () => {
        return dbSchemas;
    },
  contextToAppId: ({securityContext}) => `CUBEJS_APP_${securityContext.tenantSchema}`,
  preAggregationsSchema: ({securityContext}) => `pre_aggregations_${securityContext.tenantSchema}`,
  extendContext: (request) => {
    return {
        securityContext: {
            tenantSchema: request.headers.organization
        }
    };
  },
  http: {
    cors: {
      allowedHeaders: [
        "authorization",
        "organization",
        "x-request-id",
        "Referer",
      ],
    },
  },
};
