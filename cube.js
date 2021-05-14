module.exports = {
  contextToAppId: (context) => `CUBEJS_APP_${context.tenantSchema}`,
  extendContext: (request) => {
    return { tenantSchema: request.headers.organization };
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
