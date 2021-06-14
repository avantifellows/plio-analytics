const {
  securityContext: { tenantSchema },
} = COMPILE_CONTEXT;

cube(`SessionAnswer`, {
  sql: `SELECT * FROM ${tenantSchema}.session_answer`,

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
      session.session_id,
      session.plio_id,
      session.user_id,
      sessionAnswer.id,
      sessionAnswer.answer,
      item.type AS item_type,
      question.type AS question_type,
		  question.correct_answer AS question_correct_answer
    FROM ${GroupedSession.sql()} AS session
    INNER JOIN ${SessionAnswer.sql()} as sessionAnswer
    ON session.session_id=sessionAnswer.session_id
    INNER JOIN ${Item.sql()} as item
    ON item.id=sessionAnswer.item_id
    INNER JOIN ${Question.sql()} as question ON question.item_id = item.id`,

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
      plio_id,
      user_id,
      COUNT(case when question_type = 'mcq' AND answer IS NULL THEN NULL when question_type = 'subjective' AND answer IS NULL then NULL else 1 end) AS num_answered,
      COUNT(case when question_type = 'mcq' AND answer IS NOT NULL THEN 1 else NULL end) AS num_answered_evaluation,
      COUNT(case when question_type = 'mcq' AND answer = question_correct_answer then 1 else NULL end) AS num_correct,
      COUNT(*) AS num_questions
    FROM ${GroupedSessionAnswer.sql()} AS sessionAnswer
    WHERE sessionAnswer.item_type = 'question'
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
    completionPercentage: {
      sql: `100.0 * ${CUBE}.num_answered / ${CUBE}.num_questions`,
      type: `avg`,
    },
    accuracy: {
      sql: `100.0 * ${CUBE}.num_correct / NULLIF(${CUBE}.num_answered_evaluation, 0)`,
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
