import { mediqueueService, type HospitalRecord } from "@/services/mediqueue.service";
import type { Hospital, HospitalRegistrationInput } from "@/types/models";

function mapHospital(record: HospitalRecord): Hospital {
  return {
    id: String(record.id),
    name: record.name,
    hospitalType: record.hospitalType,
    registrationIdentifier: record.registrationNumber ?? undefined,
    phone: record.phone ?? undefined,
    email: record.email ?? undefined,
    location: {
      address: record.address ?? undefined,
      city: record.town ?? undefined,
      region: record.county ?? undefined,
    },
    status: record.status === "ACTIVE" ? "active" : "inactive",
  };
}

export const hospitalManagementService = {
  async getHospitals(): Promise<Hospital[]> {
    const records = await mediqueueService.getAdminHospitals();
    return records.map(mapHospital);
  },

  async getHospital(hospitalId: number): Promise<Hospital> {
    return mapHospital(await mediqueueService.getHospital(hospitalId));
  },

  async registerHospital(
    hospital: HospitalRegistrationInput,
  ): Promise<Hospital> {
    const record = await mediqueueService.createHospital({
      name: hospital.name,
      registrationNumber: hospital.registrationNumber,
      hospitalType: hospital.hospitalType,
      address: hospital.address,
      county: hospital.county,
      town: hospital.town,
      phone: hospital.phone,
      email: hospital.email,
      status: hospital.status,
    });
    return mapHospital(record);
  },
};
