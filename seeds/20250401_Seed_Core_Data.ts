import { Knex } from 'knex'
import { v4 as uuidv4 } from 'uuid'

export async function seed(knex: Knex): Promise<void> {
  await knex('users_in_roles').del()
  await knex('therapist_licenses').del()
  await knex('therapist_education').del()
  await knex('therapists').del()
  await knex('patients').del()
  await knex('tokens').del()
  await knex('sessions').del()
  await knex('roles').del()
  await knex('users').del()

  const roles = [
    { id: uuidv4(), name: 'admin', description: 'System administrator' },
    {
      id: uuidv4(),
      name: 'therapist',
      description: 'Licensed mental health provider',
    },
    { id: uuidv4(), name: 'patient', description: 'Registered patient' },
  ]
  await knex('roles').insert(roles)

  const [adminRole, therapistRole, patientRole] = roles

  const users = [
    {
      id: uuidv4(),
      login: 'ian',
      email: 'ian@neo.com',
      password_hash: 'fake-hash-ian',
      given_name: 'Ian',
      family_name: 'McFarland',
      metadata: {},
    },
    {
      id: uuidv4(),
      login: 'laurence',
      email: 'laurence@healthcareshares.com',
      password_hash: 'fake-hash-laurence',
      given_name: 'Laurence',
      family_name: 'Girard',
      metadata: {},
    },
    {
      id: uuidv4(),
      login: 'ca-psych',
      email: 'psych1@example.com',
      password_hash: 'hash1',
      given_name: 'Carol',
      family_name: 'Nguyen',
      metadata: {},
    },
    {
      id: uuidv4(),
      login: 'ca-mft',
      email: 'mft1@example.com',
      password_hash: 'hash2',
      given_name: 'Jordan',
      family_name: 'Lee',
      metadata: {},
    },
    {
      id: uuidv4(),
      login: 'ca-amft',
      email: 'amft1@example.com',
      password_hash: 'hash3',
      given_name: 'Sam',
      family_name: 'Chen',
      metadata: {},
    },
    {
      id: uuidv4(),
      login: 'ny-therapist',
      email: 'therapist.ny@example.com',
      password_hash: 'hash4',
      given_name: 'Melissa',
      family_name: 'Greenberg',
      metadata: {},
    },
    {
      id: uuidv4(),
      login: 'nv-patient',
      email: 'patient.nv@example.com',
      password_hash: 'hash5',
      given_name: 'Alex',
      family_name: 'Brown',
      metadata: {},
    },
    {
      id: uuidv4(),
      login: 'ny-patient',
      email: 'patient.ny@example.com',
      password_hash: 'hash6',
      given_name: 'Taylor',
      family_name: 'Singh',
      metadata: {},
    },
    {
      id: uuidv4(),
      login: 'dual-role',
      email: 'dual@example.com',
      password_hash: 'hash7',
      given_name: 'Jamie',
      family_name: 'Kim',
      metadata: {},
    },
  ]
  await knex('users').insert(users)

  const userMap = Object.fromEntries(users.map((u) => [u.login, u]))

  await knex('users_in_roles').insert([
    { user_id: userMap['ian'].id, role_id: adminRole.id },
    { user_id: userMap['laurence'].id, role_id: adminRole.id },
    { user_id: userMap['ca-psych'].id, role_id: therapistRole.id },
    { user_id: userMap['ca-mft'].id, role_id: therapistRole.id },
    { user_id: userMap['ca-amft'].id, role_id: therapistRole.id },
    { user_id: userMap['ny-therapist'].id, role_id: therapistRole.id },
    { user_id: userMap['nv-patient'].id, role_id: patientRole.id },
    { user_id: userMap['ny-patient'].id, role_id: patientRole.id },
    { user_id: userMap['dual-role'].id, role_id: therapistRole.id },
    { user_id: userMap['dual-role'].id, role_id: patientRole.id },
  ])

  // Follow with therapists, licenses, education, patients, sessions, tokens...
}
