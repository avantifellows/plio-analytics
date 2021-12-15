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
    INNER JOIN ${SessionAnswer.sql()} AS sessionAnswer
    ON session.session_id=sessionAnswer.session_id
    INNER JOIN ${Item.sql()} AS item
    ON item.id=sessionAnswer.item_id
    INNER JOIN ${Question.sql()} AS question ON question.item_id = item.id`,

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
      ROW_NUMBER() OVER (ORDER BY plio_id, user_id) AS id,
      plio_id,
      user_id,
      COUNT(CASE WHEN question_type IN ('mcq', 'checkbox', 'subjective') AND answer IS NULL THEN NULL ELSE 1 END) AS num_answered,
      COUNT(
        CASE
          WHEN question_type IN ('mcq', 'checkbox') AND answer = question_correct_answer THEN 1
          WHEN question_type = 'subjective' AND answer IS NOT NULL THEN 1
          ELSE NULL
        END
      ) AS num_correct,
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
      sql: `100.0 * ${CUBE}.num_correct / NULLIF(${CUBE}.num_answered, 0)`,
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
