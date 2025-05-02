import { BaseModel } from './BaseModel'
import { User } from './User'

export class Token extends BaseModel {
  id!: string
  userId!: string
  type!: string
  token!: string
  expiresAt!: Date
  metadata!: Record<string, any>

  static tableName = 'tokens'

  static get jsonSchema() {
    return this.createSchema(['userId', 'token', 'type'], {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      token: { type: 'string' },
      type: { type: 'string' },
      expiresAt: { type: 'string', format: 'date-time' },
    })
  }

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'tokens.user_id',
        to: 'users.id',
      },
    },
  }
}
