// migrations/YYYYMMDDHHMMSS_create_icd10_codes.ts

import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('icd10_codes', (table) => {
    table.uuid('id').primary()
    table.string('code').notNullable().unique().index()
    table.string('description').notNullable().index()
    table.string('chapter_code').nullable()
    table.string('chapter_title').nullable()
    table.string('block_code').nullable()
    table.string('block_title').nullable()
    table.jsonb('metadata').defaultTo('{}')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('icd10_codes')
}
