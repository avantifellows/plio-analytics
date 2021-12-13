const {
  securityContext: { tenantSchema },
} = COMPILE_CONTEXT;

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

cube(`GroupedSession`, {
  sql: `
    WITH summary AS (
    SELECT
        session.id AS session_id,
        session.plio_id,
        session.user_id,
        session.watch_time,
        session.retention,
        ROW_NUMBER() OVER(PARTITION BY session.user_id, session.plio_id
                          ORDER BY session.id DESC) AS rank
        FROM ${tenantSchema}.session
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

    Session: {
      sql: `${CUBE}.session_id = ${Session}.id`,
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
      sql: `session_id`,
      type: `number`,
      primaryKey: true,
    },
  },
});

cube(`GroupedSessionRetention`, {
  sql: `
    SELECT
      ROW_NUMBER() OVER (ORDER BY user_id, plio_id) AS id,
      session_id,
      plio_id,
      user_id,
      SUM(retention_array) AS postOneMinuteRetentionSum
    FROM (
        SELECT
        ROW_NUMBER() OVER (PARTITION BY user_id, plio_id) AS index,
        *
        FROM (
            SELECT
            session_id,
            plio_id,
            user_id,
            CAST(retention_array AS INT64) AS retention_array
            FROM ${GroupedSession.sql()} AS session, UNNEST(SPLIT(retention, ',')) AS retention_array
            WHERE retention NOT LIKE '%NaN%'
        ) AS B
    ) AS C
    WHERE index >= 60
    GROUP BY plio_id, user_id, session_id
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

    Session: {
      sql: `${CUBE}.session_id = ${Session}.id`,
      relationship: `belongsTo`,
    },

    GroupedSession: {
      sql: `${CUBE}.session_id = ${GroupedSession}.session_id`,
      relationship: `belongsTo`,
    },
  },

  measures: {
    count: {
      sql: `id`,
      type: `count`,
    },
    averageOneMinuteRetention: {
      sql: `100 * CASE WHEN postOneMinuteRetentionSum > 0 THEN 1 ELSE 0 END`,
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
