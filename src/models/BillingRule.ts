import { BaseModel } from './BaseModel'

export class BillingRule extends BaseModel {
  description?: string
  conditions?: Record<string, any>
  metadata!: Record<string, any>

  static get tableName() {
    return 'billing_rules'
  }

  static get jsonSchema() {
    return this.createSchema([], {
      description: { type: 'string' },
      conditions: { type: ['object', 'null'] },
      metadata: { type: 'object' },
    })
  }
}
