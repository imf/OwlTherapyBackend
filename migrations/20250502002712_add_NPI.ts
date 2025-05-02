import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('therapists', (table) => {
    table.string('npi_number').nullable().index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('therapists', (table) => {
    table.dropColumn('npi')
  })
}
