cube(`Organization`, {
  sql: `SELECT * FROM public.organization`,

  joins: {},

  measures: {
    count: {
      type: `count`,
      drillMembers: [id, schemaName, name, shortcode, createdAt, updatedAt],
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
    },

    schemaName: {
      sql: `schema_name`,
      type: `string`,
    },

    name: {
      sql: `name`,
      type: `string`,
    },

    shortcode: {
      sql: `shortcode`,
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

    lastLogin: {
      sql: `last_login`,
      type: `time`,
    },

    dateJoined: {
      sql: `date_joined`,
      type: `time`,
    },

    deleted: {
      sql: `deleted`,
      type: `time`,
    },
  },

  dataSource: `default`,
});
