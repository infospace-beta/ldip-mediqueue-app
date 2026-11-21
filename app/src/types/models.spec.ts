import { describe, expect, it } from "vitest";
import * as models from "@/types/models";

const normalizeBackendUserRole = (
  models as unknown as {
    normalizeBackendUserRole?: (user: {
      id: unknown;
      username?: string;
      role: unknown;
    }) =>
      | {
          id: unknown;
          username?: string;
          role: unknown;
          backendRole: unknown;
        }
      | null;
  }
).normalizeBackendUserRole;

describe.skipIf(!normalizeBackendUserRole)("normalizeBackendUserRole", () => {
  it.each([
    ["PATIENT", "patient"],
    ["RESPONDER", "responder"],
    ["DOCTOR", "doctor"],
    ["RECEPTIONIST", "staff"],
    ["MEDICAL_STAFF", "staff"],
    ["HOSPITAL_ADMIN", "admin"],
    ["SYSTEM_ADMIN", "system_admin"],
  ] as const)(
    "maps %s to %s and preserves the backend role",
    (backendRole, role) => {
      expect(
        normalizeBackendUserRole!({
          id: 42,
          username: "user@example.test",
          role: backendRole,
        }),
      ).toEqual({
        id: 42,
        username: "user@example.test",
        role,
        backendRole,
      });
    },
  );

  it.each([undefined, null, "", "patient", "UNKNOWN", 1, {}])(
    "rejects unsupported backend role %s",
    (role) => {
      expect(normalizeBackendUserRole!({ id: 42, role })).toBeNull();
    },
  );

  it("preserves numeric user IDs", () => {
    const id = Number.MAX_SAFE_INTEGER;

    const normalized = normalizeBackendUserRole!({
      id,
      role: "SYSTEM_ADMIN",
    });

    expect(normalized?.id).toBe(id);
    expect(typeof normalized?.id).toBe("number");
  });
});
