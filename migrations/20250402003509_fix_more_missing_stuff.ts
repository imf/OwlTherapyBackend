import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('users_in_roles')
  if (!hasTable) return

  await knex.schema.alterTable('users_in_roles', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('gen_random_uuid()'))
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
    table.jsonb('metadata').notNullable().defaultTo('{}')
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
