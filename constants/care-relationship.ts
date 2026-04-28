import { InvationStatus } from "@/store/care-invitation/type";

export const INVITATION_STATUS_LABEL: Record<InvationStatus, string> =
  {
    [InvationStatus.accpeted]: "已接受",
    [InvationStatus.declined]: "已拒絕",
    [InvationStatus.pending]: "待審查",
    [InvationStatus.revoked]: "已撤回",
  };
