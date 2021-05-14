const { tenantSchema } = COMPILE_CONTEXT;

cube(`Question`, {
  sql: `SELECT * FROM ${tenantSchema}.question`,

  joins: {
    Item: {
      sql: `${CUBE}.item_id = ${Item}.id`,
      relationship: `hasOne`,
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

    options: {
      sql: `options`,
      type: `string`,
    },

    text: {
      sql: `text`,
      type: `string`,
    },

    correctAnswer: {
      sql: `correct_answer`,
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
