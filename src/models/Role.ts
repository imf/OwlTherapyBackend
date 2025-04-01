import { BaseModel } from './BaseModel'
import { User } from './User'
import { QueryBuilder } from 'objection'

export class Role extends BaseModel {
  name!: string
  description?: string
  metadata!: Record<string, any>

  static get tableName() {
    return 'roles'
  }

  $beforeInsert(): void {
    super.$beforeInsert()
    if (!this.metadata) {
      this.metadata = {}
    }
  }

  $beforeUpdate(): void {
    super.$beforeUpdate()
    if (!this.metadata) {
      this.metadata = {}
    }
  }

  static get jsonSchema() {
    return BaseModel.createSchema(['name'], {
      name: { type: 'string' },
      description: { type: ['string', 'null'] },
    })
  }

  static get relationMappings() {
    return {
      users: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'roles.id',
          through: {
            from: 'users_in_roles.role_id',
            to: 'users_in_roles.user_id',
          },
          to: 'users.id',
        },
        modify: (builder: QueryBuilder<User>) => {
          builder.modify('notDeleted') // Apply the existing "notDeleted" modifier
          builder.select('users.id', 'login', 'email', 'givenName', 'familyName') // Exclude passwordHash inline
        },
      },
    }
  }

  static get modifiers() {
    return {
      ...super.modifiers, // Get base class modifiers
      omitPasswordHash(query: QueryBuilder<User>) {
        query.select('id', 'login', 'email', 'givenName', 'familyName')
      },
    }
  }
}
