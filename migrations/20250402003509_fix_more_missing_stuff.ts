import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('users_in_roles')
  if (!hasTable) return

  await knex.schema.alterTable('users_in_roles', (table) => {
    if (!table.columns.includes('id')) {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    }
    if (!table.columns.includes('created_at')) {
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    }
    if (!table.columns.includes('updated_at')) {
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    }
    if (!table.columns.includes('deleted_at')) {
      table.timestamp('deleted_at').nullable()
    }
    if (!table.columns.includes('metadata')) {
      table.jsonb('metadata').notNullable().defaultTo('{}')
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('users_in_roles')
  if (!hasTable) return

  await knex.schema.alterTable('users_in_roles', (table) => {
    table.dropColumn('id')
    table.dropColumn('created_at')
    table.dropColumn('updated_at')
    table.dropColumn('deleted_at')
    table.dropColumn('metadata')
  })
}
