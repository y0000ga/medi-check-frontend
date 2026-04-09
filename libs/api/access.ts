import { Role } from "@/types/api/care-invitation";

import { getMe } from "./auth";
import { getCareRelationships } from "./care-relationship";

const DEFAULT_PAGE_SIZE = 200;

export const getOwnPatientId = async () => {
  const me = await getMe();
  return me.patient_id ?? null;
};

export const getAccessiblePatientIds = async () => {
  const [ownPatientId, relationships] = await Promise.all([
    getOwnPatientId(),
    getCareRelationships({
      page: 1,
      page_size: DEFAULT_PAGE_SIZE,
      sort_by: "created_at",
      sort_order: "desc",
      direction: Role.CareGiver,
    }),
  ]);

  return Array.from(
    new Set([
      ...(ownPatientId ? [ownPatientId] : []),
      ...relationships.list.map((item) => item.patient_id),
    ]),
  );
};
