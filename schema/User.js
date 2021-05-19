cube(`User`, {
  sql: `SELECT * FROM public.user`,

  joins: {},

  measures: {
    count: {
      type: `count`,
      drillMembers: [id, firstName, lastName, createdAt, updatedAt, dateJoined],
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
    },

    password: {
      sql: `password`,
      type: `string`,
    },

    isSuperuser: {
      sql: `is_superuser`,
      type: `string`,
    },

    firstName: {
      sql: `first_name`,
      type: `string`,
    },

    lastName: {
      sql: `last_name`,
      type: `string`,
    },

    isStaff: {
      sql: `is_staff`,
      type: `string`,
    },

    isActive: {
      sql: `is_active`,
      type: `string`,
    },

    email: {
      sql: `email`,
      type: `string`,
    },

    mobile: {
      sql: `mobile`,
      type: `string`,
    },

    avatarUrl: {
      sql: `avatar_url`,
      type: `string`,
    },

    config: {
      sql: `config`,
      type: `string`,
    },

    status: {
      sql: `status`,
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

  preAggregations: {
    userStatuses: {
      type: `rollup`,
      dimensionReferences: [status],
      scheduledRefresh: true,
    },
  },

  dataSource: `default`,
});
