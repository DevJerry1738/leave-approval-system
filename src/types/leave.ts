export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  submittedAt: string; // created_at from Supabase
  reason?: string | null;
  status: LeaveStatus;
}
