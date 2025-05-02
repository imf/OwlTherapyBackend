import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('question_types', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name').notNullable().unique()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })

  await knex.schema.createTable('surveys', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('title').notNullable()
    table.text('description').nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
    table.jsonb('metadata').defaultTo('{}')
  })

  await knex.schema.createTable('questions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('survey_id').notNullable()
    table.string('text').notNullable()
    table.string('question_type').notNullable()
    table.integer('order').notNullable()
    table.jsonb('components').notNullable().defaultTo('{}')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
    table.jsonb('metadata').defaultTo('{}')

    table
      .foreign('survey_id')
      .references('id')
      .inTable('surveys')
      .onDelete('CASCADE')

    table
      .foreign('question_type')
      .references('name')
      .inTable('question_types')
      .onDelete('RESTRICT')
  })

  await knex.schema.createTable('survey_responses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('survey_id').notNullable()
    table.uuid('user_id').notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
    table.jsonb('metadata').defaultTo('{}')

    table
      .foreign('survey_id')
      .references('id')
      .inTable('surveys')
      .onDelete('CASCADE')

    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
  })

  await knex.schema.createTable('answers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('response_id').notNullable()
    table.uuid('question_id').notNullable()
    table.jsonb('value').notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
    table.jsonb('metadata').defaultTo('{}')

    table
      .foreign('response_id')
      .references('id')
      .inTable('survey_responses')
      .onDelete('CASCADE')

    table
      .foreign('question_id')
      .references('id')
      .inTable('questions')
      .onDelete('CASCADE')
  })

  // Seed the question types
  await knex('question_types').insert([
    { name: 'likert' },
    { name: 'true_false' },
    { name: 'select_one' },
    { name: 'select_many' },
    { name: 'text' },
  ])
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('answers')
  await knex.schema.dropTableIfExists('survey_responses')
  await knex.schema.dropTableIfExists('questions')
  await knex.schema.dropTableIfExists('surveys')
  await knex.schema.dropTableIfExists('question_types')
}
