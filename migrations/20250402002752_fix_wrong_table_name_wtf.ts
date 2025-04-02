import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasOld = await knex.schema.hasTable('user_roles')
  const hasCorrect = await knex.schema.hasTable('users_in_roles')

  if (hasOld && !hasCorrect) {
    await knex.schema.renameTable('user_roles', 'users_in_roles')
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasNew = await knex.schema.hasTable('users_in_roles')
  const hasOld = await knex.schema.hasTable('user_roles')

  if (hasNew && !hasOld) {
    await knex.schema.renameTable('users_in_roles', 'user_roles')
  }
}
