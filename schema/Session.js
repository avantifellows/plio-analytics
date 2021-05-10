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
    SELECT
        session.id,
        session.plio_id,
        session.user_id,
        session.watch_time,
        session.retention,
        ROW_NUMBER() OVER(PARTITION BY session.user_id, session.plio_id
                          ORDER BY session.watch_time DESC) AS rank
        FROM "public"."session"
     )
    SELECT *
        FROM summary
    WHERE rank = 1
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
    count: {
      sql: `id`,
      type: `count`,
    },
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

cube(`GroupedSessionRetention`, {
  sql: `
    SELECT
      ROW_NUMBER() OVER (ORDER BY user_id, plio_id) as id,
      plio_id,
      user_id,
      SUM(retention_array) as postOneMinuteRetentionSum
    FROM (
        SELECT
          ROW_NUMBER() OVER (PARTITION BY user_id, plio_id) AS index,
          *
        FROM (
          SELECT
            plio_id,
            user_id,
            UNNEST(string_to_array(retention, ','))::int AS retention_array
          FROM ${GroupedSession.sql()} AS session
          WHERE retention NOT LIKE '%NaN%'
          ) AS B
        ) AS C
    WHERE index >= 60
    GROUP BY plio_id, user_id
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
    count: {
      sql: `id`,
      type: `count`,
    },
    averageOneMinuteRetention: {
      sql: `100 * CASE WHEN postOneMinuteRetentionSum > 0 then 1 else 0 end`,
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
