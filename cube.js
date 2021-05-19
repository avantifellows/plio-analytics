module.exports = {
    scheduledRefreshContexts: async () => {
        return [
            {
                securityContext: {
                    tenantSchema: 'public',
                }
            },
            {
                securityContext: {
                    tenantSchema: 'mwxieecktu',
                }
            },
            {
                securityContext: {
                    tenantSchema: 'itsafhkrjm',
                }
            },
        ]
    },
//   checkAuth: (req) => {
//     const tenantSchema = req.headers.organization;
//     req.securityContext = { tenantSchema };
//   },
  contextToAppId: ({securityContext}) => `CUBEJS_APP_${securityContext.tenantSchema}`,
//   contextToOrchestratorId: (context) => `CUBEJS_APP_${context.tenantSchema}`,
  preAggregationsSchema: ({securityContext}) => `pre_aggregations_${securityContext.tenantSchema}`,
  extendContext: (request) => {
    // request.securityContext.tenantSchema = request.headers.organization;
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
