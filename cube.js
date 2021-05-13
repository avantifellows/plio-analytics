module.exports = {
  contextToAppId: (context) => `CUBEJS_APP_${context.tenantSchema}`,
  extendContext: (req) => {
    return { tenantSchema: req.headers.organization };
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
