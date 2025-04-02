import { BaseModel } from './BaseModel'
import { BillingRate } from './BillingRate'

export class TherapeuticRelationship extends BaseModel {
  therapistId!: string
  billingRateId?: string
  keyId?: string
  metadata!: Record<string, any>

  billingRate?: BillingRate

  static get tableName() {
    return 'therapeutic_relationships'
  }

  static get jsonSchema() {
    return this.createSchema(['therapistId'], {
      therapistId: { type: 'string', format: 'uuid' },
      billingRateId: { type: ['string', 'null'], format: 'uuid' },
      keyId: { type: ['string', 'null'], format: 'uuid' },
      metadata: { type: 'object' },
    })
  }
}
