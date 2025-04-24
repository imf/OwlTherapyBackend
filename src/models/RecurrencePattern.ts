import { BaseModel } from './BaseModel'

export class RecurrencePattern extends BaseModel {
  frequency!: string
  interval!: number
  daysOfWeek?: string[]
  dayOfMonth?: number
  monthOfYear?: number
  endType?: string
  endAfterOccurrences?: number
  endByDate?: string
  metadata!: Record<string, any>

  static get tableName() {
    return 'recurrence_patterns'
  }

  static get jsonSchema() {
    return this.createSchema(['frequency', 'interval'], {
      frequency: { type: 'string' },
      interval: { type: 'number' },
      daysOfWeek: { type: ['array', 'null'], items: { type: 'string' } },
      dayOfMonth: { type: ['number', 'null'] },
      monthOfYear: { type: ['number', 'null'] },
      endType: { type: ['string', 'null'] },
      endAfterOccurrences: { type: ['number', 'null'] },
      endByDate: { type: ['string', 'null'], format: 'date' },
      metadata: { type: 'object' },
    })
  }
}
