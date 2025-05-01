// src/services/ehr/clients/EpicClient.ts
import { EHRAdapter } from './BaseEHRAdapter'
import { TherapySession } from '../../../models/TherapySession'

export class EpicClient implements EHRAdapter {
  async getTherapySession(patientId: string): Promise<TherapySession[]> {
    // Epic FHIR request
    return []
  }

  async pushTherapySession(session: TherapySession): Promise<void> {
    // POST via FHIR DocumentReference or custom profile
  }
}
