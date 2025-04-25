import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Users
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('login').nullable()
    table.string('email').notNullable().unique()
    table.string('password_hash').notNullable()
    table.string('given_name').nullable()
    table.string('family_name').nullable()
    table.string('profile_photo_url').nullable()
    table.date('dob').nullable()
    table.jsonb('metadata').notNullable().defaultTo('{}')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })

  // Roles
  await knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name').notNullable().unique()
    table.string('description')
    table.jsonb('metadata').notNullable().defaultTo('{}')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })

  await knex.schema.createTable('user_roles', (table) => {
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.uuid('role_id').notNullable().references('id').inTable('roles').onDelete('CASCADE')
    table.primary(['user_id', 'role_id'])
  })

  // Sessions
  await knex.schema.createTable('sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.string('current_token').notNullable()
    table.string('previous_token')
    table.timestamp('expires_at').notNullable()
    table.string('ip_address')
    table.string('user_agent')
    table.jsonb('metadata').notNullable().defaultTo('{}')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })

  // Tokens
  await knex.schema.createTable('tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.string('token').notNullable().unique()
    table.string('type').notNullable()
    table.timestamp('expires_at')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
    table.jsonb('metadata').defaultTo('{}')
  })

  // Type tables (replacing ENUMs)
  await knex.schema.createTable('patient_statuses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name').notNullable().unique()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })

  await knex('patient_statuses').insert([
    { id: knex.raw('gen_random_uuid()'), name: 'pending' },
    { id: knex.raw('gen_random_uuid()'), name: 'active' },
    { id: knex.raw('gen_random_uuid()'), name: 'inactive' },
    { id: knex.raw('gen_random_uuid()'), name: 'archived' },
  ])

  await knex.schema.createTable('license_statuses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name').notNullable().unique()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })

  await knex('license_statuses').insert([
    { id: knex.raw('gen_random_uuid()'), name: 'active' },
    { id: knex.raw('gen_random_uuid()'), name: 'inactive' },
    { id: knex.raw('gen_random_uuid()'), name: 'expired' },
    { id: knex.raw('gen_random_uuid()'), name: 'revoked' },
  ])

  // Patients
  await knex.schema.createTable('patients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.date('birth_date')
    table.string('country', 2).notNullable()
    table.string('region')
    table.string('patient_status').notNullable()
    table.foreign('patient_status').references('name').inTable('patient_statuses').onDelete('RESTRICT')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
    table.jsonb('metadata').defaultTo('{}')
  })

  // Therapists
  await knex.schema.createTable('therapists', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.text('bio')
    table.specificType('specialties', 'text[]')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
    table.jsonb('metadata').defaultTo('{}')
  })

  // Therapist Education
  await knex.schema.createTable('therapist_education', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('therapist_id').notNullable().references('id').inTable('therapists').onDelete('CASCADE')
    table.string('institution').notNullable()
    table.string('degree').notNullable()
    table.string('field_of_study').notNullable()
    table.integer('graduation_year')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
    table.jsonb('metadata').defaultTo('{}')
  })

  // Therapist Licenses
  await knex.schema.createTable('therapist_licenses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('therapist_id').notNullable().references('id').inTable('therapists').onDelete('CASCADE')
    table.string('license_title').notNullable()
    table.string('license_number').notNullable()
    table.string('issuing_state').notNullable()
    table.string('license_status').notNullable()
    table.foreign('license_status').references('name').inTable('license_statuses').onDelete('RESTRICT')
    table.date('issue_date')
    table.date('expiration_date')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
    table.jsonb('metadata').defaultTo('{}')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('therapist_licenses')
  await knex.schema.dropTableIfExists('therapist_education')
  await knex.schema.dropTableIfExists('therapists')
  await knex.schema.dropTableIfExists('patients')
  await knex.schema.dropTableIfExists('license_statuses')
  await knex.schema.dropTableIfExists('patient_statuses')
  await knex.schema.dropTableIfExists('tokens')
  await knex.schema.dropTableIfExists('sessions')
  await knex.schema.dropTableIfExists('user_roles')
  await knex.schema.dropTableIfExists('roles')
  await knex.schema.dropTableIfExists('users')
}
