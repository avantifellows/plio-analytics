// To get all the schemas, run the following command in your DB console:
// SELECT schema_name from public.organization;
let schemas = process.env.PLIO_ORGANIZATIONS_SCHEMAS.split(",");

let dbSchemas = [];
schemas.forEach((schemaName) => {
  dbSchemas.push({
    securityContext: {
      tenantSchema: schemaName,
    },
  });
});

module.exports = dbSchemas;
