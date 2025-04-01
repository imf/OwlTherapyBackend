import { BaseModel } from './BaseModel'
import { ApiKey } from './ApiKey'
import { Role } from './Role'
import { UserRelationship } from './UserRelationship'

export class User extends BaseModel {
  login?: string
  email!: string
  passwordHash!: string
  givenName?: string
  familyName?: string
  profilePhotoUrl?: string
  dob?: Date
  metadata!: Record<string, any>

  apiKeys?: ApiKey[]
  roles?: Role[]
  relationships?: UserRelationship[]

  static get tableName(): string {
    return 'users'
  }

  static get jsonSchema() {
    return this.createSchema(
      ['email', 'givenName', 'familyName', 'passwordHash'],
      {
        login: { type: 'string' },
        email: { type: 'string', format: 'email' },
        passwordHash: { type: ['string', 'null'] },
        givenName: { type: 'string' },
        familyName: { type: 'string' },
        dob: { type: ['string', 'null'], format: 'date' },
        profilePhotoUrl: { type: ['string', 'null'], format: 'uri' },
      },
    )
  }

  // add a getter and setter for metadata values
  getMetadataValue(key: string): any {
    return this.metadata[key]
  }

  async setMetadataValue(key: string, value: any): Promise<void> {
    this.metadata[key] = value
    await this.$query().patch({ metadata: this.metadata })
  }

  get age(): number | null {
    if (!this.dob) {
      return null
    }
    const now = new Date()
    const dob = new Date(this.dob)
    const age = now.getFullYear() - dob.getFullYear()
    if (now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())) {
      return age - 1
    }
    return age
  }

  static get relationMappings() {
    return {
      apiKeys: {
        relation: BaseModel.HasManyRelation,
        modelClass: ApiKey,
        join: {
          from: 'users.id',
          to: 'api_keys.user_id',
        },
      },
      roles: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'users.id',
          through: {
            from: 'users_in_roles.user_id',
            to: 'users_in_roles.role_id',
          },
          to: 'roles.id',
        },
      },
      relationships: {
        relation: BaseModel.HasManyRelation,
        modelClass: UserRelationship,
        join: {
          from: 'users.id',
          to: 'user_relationships.user_id',
        },
      },
    }
  }
}
