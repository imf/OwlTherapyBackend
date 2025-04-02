import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('users_in_roles', 'users_in_roles_old')

  await knex.schema.createTable('users_in_roles', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.uuid('role_id').notNullable().references('id').inTable('roles').onDelete('CASCADE')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at')
    table.jsonb('metadata').notNullable().defaultTo('{}')
    table.primary(['user_id', 'role_id'])
  })

  await knex('users_in_roles').insert(
    knex('users_in_roles_old').select(
      'id', 'user_id', 'role_id', 'created_at', 'updated_at', 'deleted_at', 'metadata'
    )
  )

  await knex.schema.dropTable('users_in_roles_old')
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable('users_in_roles', 'users_in_roles_new')

  await knex.schema.createTable('users_in_roles', (table) => {
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.uuid('role_id').notNullable().references('id').inTable('roles').onDelete('CASCADE')
    table.uuid('id').notNullable().defaultTo(knex.raw('gen_random_uuid()'))
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at')
    table.jsonb('metadata').notNullable().defaultTo('{}')
    table.primary(['user_id', 'role_id'])
  })

  await knex('users_in_roles').insert(
    knex('users_in_roles_new').select(
      'user_id', 'role_id', 'id', 'created_at', 'updated_at', 'deleted_at', 'metadata'
    )
  )

  await knex.schema.dropTable('users_in_roles_new')
}
