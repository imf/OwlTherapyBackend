import { BaseModel } from './BaseModel'

export class EncryptionKey extends BaseModel {
  provider!: string
  externalId!: string
  publicKey?: string
  keyType!: string
  isActive!: boolean
  metadata!: Record<string, any>

  static get tableName() {
    return 'encryption_keys'
  }

  static get jsonSchema() {
    return this.createSchema(
      ['provider', 'externalId', 'keyType', 'isActive'],
      {
        provider: { type: 'string' },
        externalId: { type: 'string' },
        publicKey: { type: ['string', 'null'] },
        keyType: { type: 'string' },
        isActive: { type: 'boolean' },
        metadata: { type: 'object' },
      },
    )
  }
}
