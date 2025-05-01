// src/services/ehrService.ts
import { EHRAdapter } from './ehr/clients/BaseEHRAdapter'
import { TherapySession } from '../models/TherapySession'

export class EHRService {
  constructor(private adapter: EHRAdapter) {}

  async syncSession(session: TherapySession): Promise<void> {
    await this.adapter.pushTherapySession(session)
  }

  async fetchSessions(patientId: string): Promise<TherapySession[]> {
    return this.adapter.getTherapySession(patientId)
  }
}
