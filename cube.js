module.exports = {
  contextToAppId: ({ securityContext }) =>
    `CUBEJS_APP_${securityContext.tenantSchema}`,
  checkAuth: (req, token) => {
    const tenantSchema = req.headers["organization"];
    req.securityContext = { tenantSchema };
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
