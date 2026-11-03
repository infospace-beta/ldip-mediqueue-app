import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { hospitalWorkspaceService } from "@/services/hospitalWorkspace.service";
import type { Hospital, HospitalWorkspaceState, User } from "@/types/models";

export class UnassignedHospitalSelectionError extends Error {
  constructor() {
    super("You do not have an active assignment to that hospital.");
    this.name = "UnassignedHospitalSelectionError";
  }
}

const initialState = (): HospitalWorkspaceState => ({
  staffUserId: null,
  assignments: [],
  selectedHospitalId: null,
  isLoading: false,
  isLoaded: false,
  error: null,
});

export const useHospitalWorkspaceStore = defineStore(
  "hospitalWorkspace",
  () => {
    const state = ref<HospitalWorkspaceState>(initialState());
    let requestSequence = 0;

    const availableAssignments = computed(() =>
      state.value.assignments.filter(
        (assignment) =>
          assignment.status === "active" &&
          assignment.hospital.status === "active" &&
          assignment.hospitalId === assignment.hospital.id,
      ),
    );
    const availableHospitals = computed(() => {
      const uniqueHospitals = new Map<string, Hospital>();
      availableAssignments.value.forEach((assignment) => {
        uniqueHospitals.set(assignment.hospital.id, assignment.hospital);
      });
      return [...uniqueHospitals.values()];
    });
    const currentAssignment = computed(
      () =>
        availableAssignments.value.find(
          (assignment) =>
            assignment.hospitalId === state.value.selectedHospitalId,
        ) ?? null,
    );
    const currentHospital = computed(
      () => currentAssignment.value?.hospital ?? null,
    );

    async function loadAssignments(staffUserId: User["id"]): Promise<boolean> {
      const currentRequest = ++requestSequence;
      state.value = {
        ...initialState(),
        staffUserId,
        isLoading: true,
      };

      try {
        const assignments =
          await hospitalWorkspaceService.getAssignmentsForStaff(staffUserId);
        if (currentRequest !== requestSequence) return false;
        if (
          assignments.some(
            (assignment) => assignment.staffUserId !== staffUserId,
          )
        ) {
          throw new Error(
            "Hospital assignment response did not match the staff user.",
          );
        }

        state.value = {
          staffUserId,
          assignments,
          selectedHospitalId: null,
          isLoading: false,
          isLoaded: true,
          error: null,
        };
        return true;
      } catch (error) {
        if (currentRequest !== requestSequence) return false;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load hospital assignments.";
        state.value = {
          ...initialState(),
          staffUserId,
          error: message,
        };
        console.error("Error loading hospital assignments:", error);
        return false;
      }
    }

    function selectHospital(hospitalId: Hospital["id"]): void {
      const hospital = availableHospitals.value.find(
        (assignedHospital) => assignedHospital.id === hospitalId,
      );
      if (!hospital) throw new UnassignedHospitalSelectionError();
      state.value.selectedHospitalId = hospitalId;
      state.value.error = null;
    }

    function clearWorkspace(): void {
      requestSequence += 1;
      state.value = initialState();
    }

    return {
      staffUserId: computed(() => state.value.staffUserId),
      assignments: computed(() => state.value.assignments),
      selectedHospitalId: computed(() => state.value.selectedHospitalId),
      isLoading: computed(() => state.value.isLoading),
      isLoaded: computed(() => state.value.isLoaded),
      error: computed(() => state.value.error),
      availableAssignments,
      availableHospitals,
      currentAssignment,
      currentHospital,
      loadAssignments,
      selectHospital,
      clearWorkspace,
    };
  },
);
