const { securityContext: { tenantSchema } } = COMPILE_CONTEXT;
// const { organizationTenantSchema } = COMPILE_CONTEXT;

cube(`Session`, {
  sql: `SELECT * FROM ${tenantSchema}.session`,

  joins: {
    Plio: {
      sql: `${CUBE}.plio_id = ${Plio}.id`,
      relationship: `belongsTo`,
    },

    User: {
      sql: `${CUBE}.user_id = ${User}.id`,
      relationship: `belongsTo`,
    },
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [id, hasVideoPlayed, createdAt, updatedAt],
    },
    uniqueUsers: {
      sql: `${userId}`,
      type: `countDistinct`,
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
    },

    userId: {
      sql: `${User}.id`,
      type: `number`,
    },

    retention: {
      sql: `retention`,
      type: `string`,
    },

    hasVideoPlayed: {
      sql: `has_video_played`,
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
