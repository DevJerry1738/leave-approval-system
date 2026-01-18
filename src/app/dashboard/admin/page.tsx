// src/app/dashboard/admin/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import DashboardHeader from "@/components/common/DashboardHeader";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { getAllLeaves, approveLeave, rejectLeave } from "@/lib/api";

type Status = "pending" | "approved" | "rejected";

type LeaveRequest = {
  id: string;
  staffName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: Status;
};

export default function AdminDashboard() {
  const [data, setData] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await getAllLeaves();
      // Map to ensure type safety: Ignore extra fields like submittedAt, coerce status if null
      const mappedData: LeaveRequest[] = (res || []).map((item: any) => ({
        id: item.id,
        staffName: item.staffName,
        leaveType: item.leaveType,
        startDate: item.startDate,
        endDate: item.endDate,
        status: item.status ?? "pending", // Fallback if null; adjust based on your DB
      }));
      setData(mappedData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const totals = useMemo(() => {
    const total = data.length;
    const pending = data.filter((d) => d.status === "pending").length;
    const approved = data.filter((d) => d.status === "approved").length;
    const rejected = data.filter((d) => d.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [data]);

  async function handleAction(id: string, action: "approve" | "reject") {
    setActionLoading(id);
    setData(prev => prev.map(r => r.id === id ? { ...r, status: action === "approve" ? "approved" : "rejected" } : r));
    try {
      if (action === "approve") await approveLeave(id);
      else await rejectLeave(id);
      toast.success(`Request ${action}ed`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} request`);
      await load(); // reload on failure
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <main className="p-6 min-h-screen">
      <Toaster />
      <DashboardHeader title="Admin Dashboard" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Total Requests</div>
            <div className="text-2xl font-bold">{loading ? "—" : totals.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold">{loading ? "—" : totals.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-2xl font-bold">{loading ? "—" : totals.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Rejected</div>
            <div className="text-2xl font-bold">{loading ? "—" : totals.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading requests…</div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map(req => (
                    <TableRow key={req.id} className="border-t">
                      <TableCell>{req.staffName}</TableCell>
                      <TableCell>{req.leaveType}</TableCell>
                      <TableCell>{req.startDate} — {req.endDate}</TableCell>
                      <TableCell>
                        <Badge variant={req.status === "pending" ? "pending" : req.status === "approved" ? "approved" : "rejected"}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            disabled={req.status !== "pending" || actionLoading === req.id}
                            onClick={() => handleAction(req.id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={req.status !== "pending" || actionLoading === req.id}
                            onClick={() => handleAction(req.id, "reject")}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}