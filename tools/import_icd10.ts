// src/scripts/insert_icd10_codes.ts
import fs from 'fs'
import path from 'path'
import { XMLParser } from 'fast-xml-parser'
import { ICD10Code } from '../src/models/ICD10Code'
import { transaction } from 'objection'
import knex from '../src/config/db'
import { Model } from 'objection'

// Ensure Objection is bound to the knex instance
Model.knex(knex)

const xmlFilePath = path.resolve(__dirname, '../data/icd10cm_tabular_2025.xml')

function collectNotes(elem: any, tag: string): string[] {
  const tagObj = elem?.[tag]
  if (!tagObj) return []
  if (Array.isArray(tagObj.note))
    return tagObj.note.map((n: any) => n['#text'] || n)
  if (tagObj.note) return [tagObj.note['#text'] || tagObj.note]
  return []
}

function walkDiags(
  diags: any[],
  chapterCode: string,
  chapterTitle: string,
  blockCode: string,
  blockTitle: string,
): any[] {
  const results: any[] = []

  for (const diag of diags) {
    if (!diag || !diag.name || !diag.desc) continue

    const code = diag.name
    const description = diag.desc

    const metadata: Record<string, any> = {
      inclusionTerms: collectNotes(diag, 'inclusionTerm'),
      excludes1: collectNotes(diag, 'excludes1'),
      excludes2: collectNotes(diag, 'excludes2'),
      useAdditionalCode: collectNotes(diag, 'useAdditionalCode'),
      codeAlso: collectNotes(diag, 'codeAlso'),
      codeFirst: collectNotes(diag, 'codeFirst'),
    }

    results.push({
      code,
      description,
      chapterCode,
      chapterTitle,
      blockCode,
      blockTitle,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const nested = diag.diag
    if (Array.isArray(nested)) {
      results.push(
        ...walkDiags(nested, chapterCode, chapterTitle, blockCode, blockTitle),
      )
    } else if (nested && typeof nested === 'object') {
      results.push(
        ...walkDiags(
          [nested],
          chapterCode,
          chapterTitle,
          blockCode,
          blockTitle,
        ),
      )
    }
  }

  return results
}

async function main() {
  const existingCount = await ICD10Code.query().resultSize()

  if (existingCount > 0) {
    if (process.env.FORCE === '1') {
      console.warn(
        `[WARN] Found ${existingCount} existing ICD-10 codes. FORCE=1 detected — deleting...`,
      )
      await ICD10Code.query().delete()
      console.log(`[INFO] Existing ICD-10 codes deleted.`)
    } else {
      console.error(
        `[ABORT] ICD-10 codes already exist in the database (${existingCount} rows).`,
      )
      console.error(`        Set FORCE=1 to delete and reimport.`)
      process.exit(1)
    }
  }

  console.log('[INFO] Loading ICD-10 XML file...')
  const xml = fs.readFileSync(xmlFilePath, 'utf-8')

  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    parseAttributeValue: false,
  })
  const parsed = parser.parse(xml)

  const chapters = parsed['ICD10CM.tabular']?.chapter
  if (!chapters)
    throw new Error('Invalid XML structure: no <chapter> elements found.')

  const rows: any[] = []

  for (const chapter of Array.isArray(chapters) ? chapters : [chapters]) {
    const chapterCode = chapter.name
    const chapterTitle = chapter.desc
    const sections = chapter.section

    for (const section of Array.isArray(sections) ? sections : [sections]) {
      const blockCode = section['@_id']
      const blockTitle = section.desc

      const diagSet = section.diag
      if (!diagSet) continue

      const diags = Array.isArray(diagSet) ? diagSet : [diagSet]
      rows.push(
        ...walkDiags(diags, chapterCode, chapterTitle, blockCode, blockTitle),
      )
    }
  }

  console.log(`[INFO] Parsed ${rows.length} ICD-10 codes. Inserting into DB...`)
  await transaction(ICD10Code.knex(), async (trx) => {
    const chunkSize = 500
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize)

      // Diagnostic check
      const bad = chunk.find(
        (row) =>
          typeof row.chapterCode !== 'string' && row.chapterCode !== null,
      )
      if (bad) {
        console.error('[DEBUG] Bad row:', JSON.stringify(bad, null, 2))
        throw new Error('Found invalid row before insert')
      }

      console.log(
        `[INFO] Inserting chunk ${i / chunkSize + 1} of ${Math.ceil(rows.length / chunkSize)}`,
      )
      await ICD10Code.query(trx).insert(chunk)
    }
  })

  console.log('[SUCCESS] ICD-10 import complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error('[ERROR]', err)
  process.exit(1)
})
