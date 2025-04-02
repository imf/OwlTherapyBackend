-- Migration: create_calendar_sessions_with_telehealth_and_related_tables

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    // Enums first
    .raw(`CREATE TYPE session_status AS ENUM ('scheduled', 'completed', 'cancelled', 'missed')`)
    .raw(`CREATE TYPE billing_status AS ENUM ('pending', 'billed', 'paid', 'unpaid', 'write_off')`)
    .raw(`CREATE TYPE recurrence_end_type AS ENUM ('after_occurrences', 'by_date')`)
    // Roles Table
    .createTable('therapeutic_roles', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('code', 16).unique().notNullable();
      table.text('label').notNullable();
      table.jsonb('metadata').notNullable().defaultTo('{}');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    // Billing Rules
    .createTable('billing_rules', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.text('description');
      table.jsonb('conditions');
      table.jsonb('metadata').notNullable().defaultTo('{}');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    // Billing Rates
    .createTable('billing_rates', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('code').unique();
      table.text('label');
      table.decimal('amount').notNullable();
      table.string('currency', 3).notNullable().defaultTo('USD');
      table.string('insurance_plan');
      table.decimal('copay');
      table.uuid('billing_rule_id').references('id').inTable('billing_rules');
      table.jsonb('metadata').notNullable().defaultTo('{}');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    // Therapeutic Relationships
    .createTable('therapeutic_relationships', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('therapist_id').notNullable().references('id').inTable('therapists');
      table.uuid('billing_rate_id').references('id').inTable('billing_rates');
      table.uuid('key_id').references('id').inTable('encryption_keys');
      table.jsonb('metadata').notNullable().defaultTo('{}');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    // Participants in Relationship
    .createTable('therapeutic_relationship_participants', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('relationship_id').notNullable().references('id').inTable('therapeutic_relationships');
      table.uuid('user_id').notNullable().references('id').inTable('users');
      table.string('therapeutic_role_code', 16).notNullable().references('code').inTable('therapeutic_roles');
      table.jsonb('metadata').notNullable().defaultTo('{}');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    // Recurrence Patterns
    .createTable('recurrence_patterns', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('frequency').notNullable();
      table.integer('interval').notNullable().defaultTo(1);
      table.specificType('days_of_week', 'text[]');
      table.integer('day_of_month');
      table.integer('month_of_year');
      table.enu('end_type', ['after_occurrences', 'by_date'], { useNative: true, enumName: 'recurrence_end_type' });
      table.integer('end_after_occurrences');
      table.date('end_by_date');
      table.jsonb('metadata').notNullable().defaultTo('{}');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    // Calendar Sessions
    .createTable('calendar_sessions', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('therapist_id').notNullable().references('id').inTable('therapists');
      table.uuid('recurrence_id').references('id').inTable('recurrence_patterns');
      table.uuid('therapeutic_relationship_id').references('id').inTable('therapeutic_relationships');
      table.timestamp('start_time').notNullable();
      table.timestamp('end_time').notNullable();
      table.enu('status', ['scheduled', 'completed', 'cancelled', 'missed'], { useNative: true, enumName: 'session_status' }).notNullable();
      table.enu('billing_status', ['pending', 'billed', 'paid', 'unpaid', 'write_off'], { useNative: true, enumName: 'billing_status' });
      table.string('icd10_code');
      table.string('delivery_type').notNullable().defaultTo('in_person');
      table.jsonb('delivery_details').defaultTo('{}');
      table.jsonb('metadata').notNullable().defaultTo('{}');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    });
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
    .raw('DROP TYPE IF EXISTS session_status')
    .raw('DROP TYPE IF EXISTS billing_status')
    .raw('DROP TYPE IF EXISTS recurrence_end_type');
}