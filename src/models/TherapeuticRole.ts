import { BaseModel } from './BaseModel'

export class TherapeuticRole extends BaseModel {
  code!: string
  label!: string
  metadata!: Record<string, any>

  static get tableName() {
    return 'therapeutic_roles'
  }

  static get idColumn() {
    return 'code'
  }

  static get jsonSchema() {
    return this.createSchema(['code', 'label'], {
      code: { type: 'string', maxLength: 16 },
      label: { type: 'string' },
      metadata: { type: 'object' },
    })
  }
}
