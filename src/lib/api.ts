// src/lib/api.ts
'use client';

import { createBrowserSupabaseClient } from "./supabase/browser-client";
import type { LeaveRequest, LeaveStatus } from "@/types/leave";

// Create a single instance for the module
const supabase = createBrowserSupabaseClient();

/**
 * Fetch logged-in staff leave requests
 */
export async function getMyLeaves(): Promise<LeaveRequest[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user.id;

  if (!userId) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((item) => ({
    id: item.id,
    leaveType: item.leave_type,
    startDate: item.start_date,
    endDate: item.end_date,
    submittedAt: item.created_at ?? 'N/A',
    reason: item.reason ?? '',
    status: item.status as LeaveStatus,
  }));
}

/**
 * Create new leave request
 */
export async function createLeave(payload: {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
}) {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;

  if (!user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("leave_requests")
    .insert({
      user_id: user.id,
      leave_type: payload.leaveType,
      start_date: payload.startDate,
      end_date: payload.endDate,
      reason: payload.reason ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: fetch all leave requests with staff name
 */
export async function getAllLeaves() {
  const { data, error } = await supabase
    .from("leave_requests")
    .select(`
      id,
      leave_type,
      start_date,
      end_date,
      status,
      created_at,
      profiles!inner (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((item) => ({
    id: item.id,
    staffName: (item.profiles as any)?.name ?? "Unknown",
    leaveType: item.leave_type,
    startDate: item.start_date,
    endDate: item.end_date,
    status: item.status,
    submittedAt: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
  }));
}

/**
 * Admin actions
 */
export async function approveLeave(id: string) {
  const { data, error } = await supabase
    .from("leave_requests")
    .update({ status: "approved" })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function rejectLeave(id: string) {
  const { data, error } = await supabase
    .from("leave_requests")
    .update({ status: "rejected" })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}