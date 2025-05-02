// src/models/ICD10Code.ts

import { BaseModel } from './BaseModel'

export class ICD10Code extends BaseModel {
  static tableName = 'icd10_codes'

  code!: string
  description!: string
  chapterCode?: string
  chapterTitle?: string
  blockCode?: string
  blockTitle?: string

  static get jsonSchema() {
    return this.createSchema(['code', 'description'], {
      code: { type: 'string' },
      description: { type: 'string' },
      chapterCode: { type: ['string', 'null'] },
      chapterTitle: { type: ['string', 'null'] },
      blockCode: { type: ['string', 'null'] },
      blockTitle: { type: ['string', 'null'] },
    })
  }

  static get relationMappings() {
    return {}
  }
}
