import { BaseModel } from './BaseModel'
import { BillingRule } from './BillingRule'

export class BillingRate extends BaseModel {
  code?: string
  label?: string
  amount!: number
  currency!: string
  insurancePlan?: string
  copay?: number
  billingRuleId?: string
  metadata!: Record<string, any>

  billingRule?: BillingRule

  static get tableName() {
    return 'billing_rates'
  }

  static get jsonSchema() {
    return this.createSchema(['amount', 'currency'], {
      code: { type: ['string', 'null'] },
      label: { type: ['string', 'null'] },
      amount: { type: 'number' },
      currency: { type: 'string' },
      insurancePlan: { type: ['string', 'null'] },
      copay: { type: ['number', 'null'] },
      billingRuleId: { type: ['string', 'null'], format: 'uuid' },
      metadata: { type: 'object' },
    })
  }
}
