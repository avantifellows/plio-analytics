const { tenantSchema } = COMPILE_CONTEXT;

cube(`Plio`, {
  sql: `SELECT * FROM ${tenantSchema}.plio`,

  joins: {},

  measures: {
    count: {
      type: `count`,
      drillMembers: [id, name, uuid, createdAt, updatedAt],
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
    },

    name: {
      sql: `name`,
      type: `string`,
    },

    uuid: {
      sql: `uuid`,
      type: `string`,
    },

    failsafeUrl: {
      sql: `failsafe_url`,
      type: `string`,
    },

    status: {
      sql: `status`,
      type: `string`,
    },

    isPublic: {
      sql: `is_public`,
      type: `string`,
    },

    config: {
      sql: `config`,
      type: `string`,
    },

    createdAt: {
      sql: `created_at`,
      type: `time`,
    },

    updatedAt: {
      sql: `updated_at`,
      type: `time`,
    },

    deleted: {
      sql: `deleted`,
      type: `time`,
    },
  },

  dataSource: `default`,
});
