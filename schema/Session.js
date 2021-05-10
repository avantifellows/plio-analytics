cube(`Session`, {
  sql: `SELECT * FROM public.session`,

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

cube(`GroupedSession`, {
  sql: `
    WITH summary AS (
    SELECT session.plio_id,
         session.user_id,
         session.watch_time,
         ROW_NUMBER() OVER(PARTITION BY session.user_id, session.plio_id
                           ORDER BY session.watch_time DESC) AS id
         FROM "public"."session"
     )
    SELECT *
        FROM summary
    WHERE id = 1
    `,

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
    averageWatchTime: {
      sql: `watch_time`,
      type: `avg`,
    },
  },
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
    },
  },
});
