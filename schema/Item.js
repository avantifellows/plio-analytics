const {
  securityContext: { tenantSchema },
} = COMPILE_CONTEXT;

cube(`Item`, {
  sql: `SELECT * FROM ${tenantSchema}.item`,

  joins: {
    Plio: {
      sql: `${CUBE}.plio_id = ${Plio}.id`,
      relationship: `belongsTo`,
    },
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [id, createdAt, updatedAt],
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
    },

    type: {
      sql: `type`,
      type: `string`,
    },

    meta: {
      sql: `meta`,
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
});
