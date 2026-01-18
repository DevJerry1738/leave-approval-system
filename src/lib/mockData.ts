/**
 * Mock Data Service
 * Temporary in-memory data store for leave requests while backend is being rebuilt.
 * Replace with actual API calls once backend is ready.
 */

export type LeaveRequest = {
  id: string;
  staffName: string;
  staffEmail: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
};

// In-memory store
let mockLeaves: LeaveRequest[] = [
  {
    id: "1",
    staffName: "John Doe",
    staffEmail: "john@example.com",
    leaveType: "Annual Leave",
    startDate: "2026-01-20",
    endDate: "2026-01-24",
    reason: "Vacation",
    status: "pending",
    submittedAt: "2026-01-15",
  },
  {
    id: "2",
    staffName: "Jane Smith",
    staffEmail: "jane@example.com",
    leaveType: "Sick Leave",
    startDate: "2026-01-16",
    endDate: "2026-01-17",
    reason: "Medical appointment",
    status: "approved",
    submittedAt: "2026-01-15",
  },
  {
    id: "3",
    staffName: "Bob Johnson",
    staffEmail: "bob@example.com",
    leaveType: "Annual Leave",
    startDate: "2026-02-01",
    endDate: "2026-02-05",
    reason: "Family visit",
    status: "rejected",
    submittedAt: "2026-01-14",
  },
  {
    id: "4",
    staffName: "Alice Williams",
    staffEmail: "alice@example.com",
    leaveType: "Casual Leave",
    startDate: "2026-01-22",
    endDate: "2026-01-22",
    reason: "Personal reason",
    status: "pending",
    submittedAt: "2026-01-16",
  },
];

let currentUserEmail = "john@example.com"; // Default mock user

/**
 * Set the current user for mock operations
 */
export function setCurrentUser(email: string) {
  currentUserEmail = email;
}

/**
 * Get current logged-in user email
 */
export function getCurrentUserEmail(): string {
  return currentUserEmail;
}

/**
 * Get all leave requests (admin view)
 */
export async function mockGetAllLeaves(): Promise<LeaveRequest[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockLeaves;
}

/**
 * Get current user's leave requests (staff view)
 */
export async function mockGetMyLeaves(): Promise<LeaveRequest[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockLeaves.filter((leave) => leave.staffEmail === currentUserEmail);
}

/**
 * Create a new leave request
 */
export async function mockCreateLeave(payload: {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
}): Promise<LeaveRequest> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newLeave: LeaveRequest = {
    id: String(mockLeaves.length + 1),
    staffName: "Current Staff", // In real app, get from session
    staffEmail: currentUserEmail,
    leaveType: payload.leaveType,
    startDate: payload.startDate,
    endDate: payload.endDate,
    reason: payload.reason,
    status: "pending",
    submittedAt: new Date().toISOString().split("T")[0],
  };

  mockLeaves.push(newLeave);
  return newLeave;
}

/**
 * Approve a leave request
 */
export async function mockApproveLeave(id: string): Promise<LeaveRequest> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const leave = mockLeaves.find((l) => l.id === id);
  if (!leave) throw new Error("Leave request not found");

  leave.status = "approved";
  return leave;
}

/**
 * Reject a leave request
 */
export async function mockRejectLeave(id: string): Promise<LeaveRequest> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const leave = mockLeaves.find((l) => l.id === id);
  if (!leave) throw new Error("Leave request not found");

  leave.status = "rejected";
  return leave;
}

/**
 * Reset mock data to initial state (useful for testing)
 */
export function resetMockData() {
  mockLeaves = [
    {
      id: "1",
      staffName: "John Doe",
      staffEmail: "john@example.com",
      leaveType: "Annual Leave",
      startDate: "2026-01-20",
      endDate: "2026-01-24",
      reason: "Vacation",
      status: "pending",
      submittedAt: "2026-01-15",
    },
    {
      id: "2",
      staffName: "Jane Smith",
      staffEmail: "jane@example.com",
      leaveType: "Sick Leave",
      startDate: "2026-01-16",
      endDate: "2026-01-17",
      reason: "Medical appointment",
      status: "approved",
      submittedAt: "2026-01-15",
    },
    {
      id: "3",
      staffName: "Bob Johnson",
      staffEmail: "bob@example.com",
      leaveType: "Annual Leave",
      startDate: "2026-02-01",
      endDate: "2026-02-05",
      reason: "Family visit",
      status: "rejected",
      submittedAt: "2026-01-14",
    },
    {
      id: "4",
      staffName: "Alice Williams",
      staffEmail: "alice@example.com",
      leaveType: "Casual Leave",
      startDate: "2026-01-22",
      endDate: "2026-01-22",
      reason: "Personal reason",
      status: "pending",
      submittedAt: "2026-01-16",
    },
  ];
}
