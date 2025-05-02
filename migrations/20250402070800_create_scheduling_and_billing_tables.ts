import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Enum tables (replacing Postgres ENUM types)
  await knex.schema.createTable('session_statuses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name').notNullable().unique()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })
  await knex('session_statuses').insert([
    { id: knex.raw('gen_random_uuid()'), name: 'scheduled' },
    { id: knex.raw('gen_random_uuid()'), name: 'completed' },
    { id: knex.raw('gen_random_uuid()'), name: 'cancelled' },
    { id: knex.raw('gen_random_uuid()'), name: 'missed' },
  ])

  await knex.schema.createTable('billing_statuses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name').notNullable().unique()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })
  await knex('billing_statuses').insert([
    { id: knex.raw('gen_random_uuid()'), name: 'pending' },
    { id: knex.raw('gen_random_uuid()'), name: 'billed' },
    { id: knex.raw('gen_random_uuid()'), name: 'paid' },
    { id: knex.raw('gen_random_uuid()'), name: 'unpaid' },
    { id: knex.raw('gen_random_uuid()'), name: 'write_off' },
  ])

  await knex.schema.createTable('recurrence_end_types', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name').notNullable().unique()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })
  await knex('recurrence_end_types').insert([
    { id: knex.raw('gen_random_uuid()'), name: 'after_occurrences' },
    { id: knex.raw('gen_random_uuid()'), name: 'by_date' },
  ])

  // Therapeutic Roles
  await knex.schema.createTable('therapeutic_roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('code', 16).unique().notNullable()
    table.text('label').notNullable()
    table.jsonb('metadata').notNullable().defaultTo('{}')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })

  // Billing Rules
  await knex.schema.createTable('billing_rules', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.text('description')
    table.jsonb('conditions')
    table.jsonb('metadata').notNullable().defaultTo('{}')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })

  // Billing Rates
  await knex.schema.createTable('billing_rates', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('code').unique()
    table.text('label')
    table.decimal('amount').notNullable()
    table.string('currency', 3).notNullable().defaultTo('USD')
    table.string('insurance_plan')
    table.decimal('copay')
    table.uuid('billing_rule_id').references('id').inTable('billing_rules')
    table.jsonb('metadata').notNullable().defaultTo('{}')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })

  await knex.schema.createTable('encryption_keys', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('provider').notNullable() // e.g. 'aws-kms', 'vault', etc.
    table.string('external_id').notNullable() // key ID or path
    table.text('public_key').nullable() // for asymmetric encryption
    table.string('key_type').notNullable() // e.g. 'rsa-2048', 'aes-256'
    table.boolean('is_active').notNullable().defaultTo(true)
    table.jsonb('metadata').notNullable().defaultTo('{}')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })

  // Therapeutic Relationships
  await knex.schema.createTable('therapeutic_relationships', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table
      .uuid('therapist_id')
      .notNullable()
      .references('id')
      .inTable('therapists')
    table.uuid('billing_rate_id').references('id').inTable('billing_rates')
    table.uuid('key_id').references('id').inTable('encryption_keys')
    table.jsonb('metadata').notNullable().defaultTo('{}')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })

  // Participants in Relationship
  await knex.schema.createTable(
    'therapeutic_relationship_participants',
    (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table
        .uuid('relationship_id')
        .notNullable()
        .references('id')
        .inTable('therapeutic_relationships')
      table.uuid('user_id').notNullable().references('id').inTable('users')
      table
        .string('therapeutic_role_code', 16)
        .notNullable()
        .references('code')
        .inTable('therapeutic_roles')
      table.jsonb('metadata').notNullable().defaultTo('{}')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
      table.timestamp('deleted_at').nullable()
    },
  )

  // Recurrence Patterns
  await knex.schema.createTable('recurrence_patterns', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('frequency').notNullable()
    table.integer('interval').notNullable().defaultTo(1)
    table.specificType('days_of_week', 'text[]')
    table.integer('day_of_month')
    table.integer('month_of_year')
    table.string('recurrence_end_type')
    table
      .foreign('recurrence_end_type')
      .references('name')
      .inTable('recurrence_end_types')
      .onDelete('RESTRICT')
    table.integer('end_after_occurrences')
    table.date('end_by_date')
    table.jsonb('metadata').notNullable().defaultTo('{}')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })

  // Calendar Sessions
  await knex.schema.createTable('calendar_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table
      .uuid('therapist_id')
      .notNullable()
      .references('id')
      .inTable('therapists')
    table.uuid('recurrence_id').references('id').inTable('recurrence_patterns')
    table
      .uuid('therapeutic_relationship_id')
      .references('id')
      .inTable('therapeutic_relationships')
    table.timestamp('start_time').notNullable()
    table.timestamp('end_time').notNullable()
    table.string('session_status').notNullable()
    table
      .foreign('session_status')
      .references('name')
      .inTable('session_statuses')
      .onDelete('RESTRICT')
    table.string('billing_status')
    table
      .foreign('billing_status')
      .references('name')
      .inTable('billing_statuses')
      .onDelete('RESTRICT')
    table.string('icd10_code')
    table.string('delivery_type').notNullable().defaultTo('in_person')
    table.jsonb('delivery_details').defaultTo('{}')
    table.jsonb('metadata').notNullable().defaultTo('{}')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('calendar_sessions')
    .dropTableIfExists('recurrence_patterns')
    .dropTableIfExists('therapeutic_relationship_participants')
    .dropTableIfExists('therapeutic_relationships')
    .dropTableIfExists('billing_rates')
    .dropTableIfExists('billing_rules')
    .dropTableIfExists('therapeutic_roles')
    .dropTableIfExists('encryption_keys')
    .dropTableIfExists('recurrence_end_types')
    .dropTableIfExists('billing_statuses')
    .dropTableIfExists('session_statuses')
}
