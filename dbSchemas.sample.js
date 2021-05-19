let schemas = [
    'public',
    'schema1',
    'schema2',
]

let dbSchemas = [];
schemas.forEach(schemaName => {
    dbSchemas.push({
        securityContext: {
            tenantSchema: schemaName
        }
    });
});

module.exports = dbSchemas;
