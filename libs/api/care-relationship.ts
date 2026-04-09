import { request } from "./client";
import { IPaginationResponse } from "@/types/api/base";
import {
  ICareRelationship,
  TGetCareRelationshipParams,
} from "@/types/api/care-relationship";

export const getCareRelationships = (
  params: TGetCareRelationshipParams,
) =>
  request<
    IPaginationResponse<ICareRelationship>,
    undefined,
    TGetCareRelationshipParams
  >("/care-relationships", { params });
