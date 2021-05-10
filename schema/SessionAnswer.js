cube(`SessionAnswer`, {
  sql: `SELECT * FROM public.session_answer`,

  joins: {
    Session: {
      sql: `${CUBE}.session_id = ${Session}.id`,
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

    answer: {
      sql: `answer`,
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

cube(`GroupedSessionAnswer`, {
  sql: `
    SELECT
      session.id AS session_id,
      session.plio_id,
      session.user_id,
      sessionAnswer.id,
      sessionAnswer.answer
    FROM ${GroupedSession.sql()} AS session
    INNER JOIN ${SessionAnswer.sql()} as sessionAnswer
    ON session.id=sessionAnswer.session_id`,

  joins: {
    Session: {
      sql: `${CUBE}.session_id = ${Session}.id`,
      relationship: `belongsTo`,
    },
    User: {
      sql: `${CUBE}.user_id = ${User}.id`,
      relationship: `belongsTo`,
    },
    Plio: {
      sql: `${CUBE}.plio_id = ${Plio}.id`,
      relationship: `belongsTo`,
    },
  },

  measures: {
    count: {
      sql: `id`,
      type: `count`,
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

cube(`AggregateSessionMetrics`, {
  sql: `
    SELECT
      ROW_NUMBER() OVER (ORDER BY plio_id, user_id) as id,
      plio_id, user_id, COUNT(*) as num_answered
    FROM ${GroupedSessionAnswer.sql()} AS sessionAnswer
    WHERE sessionAnswer.answer::int IS NOT NULL
    GROUP BY user_id, plio_id`,

  joins: {
    User: {
      sql: `${CUBE}.user_id = ${User}.id`,
      relationship: `belongsTo`,
    },
    Plio: {
      sql: `${CUBE}.plio_id = ${Plio}.id`,
      relationship: `belongsTo`,
    },
  },

  measures: {
    count: {
      sql: `id`,
      type: `count`,
    },
    numQuestionsAnswered: {
      sql: `num_answered`,
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
