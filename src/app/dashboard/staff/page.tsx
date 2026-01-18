"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { getMyLeaves, createLeave } from "@/lib/api";
import type { LeaveRequest } from "@/types/leave";

const formSchema = z
  .object({
    leaveType: z.string().min(1, "Select leave type"),
    startDate: z.string().min(1, "Start date required"),
    endDate: z.string().min(1, "End date required"),
    reason: z.string().optional(),
  })
  .refine((vals) => new Date(vals.endDate) >= new Date(vals.startDate), {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function StaffDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LeaveRequest[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await getMyLeaves();
      setData(res);
    } catch {
      toast.error("Failed to load requests");
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
    return { total, pending, approved };
  }, [data]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await createLeave(values);
      toast.success("Leave request submitted");
      setOpen(false);
      reset();
      await load();
    } catch {
      toast.error("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="p-6 min-h-screen">
      <Toaster />
      <DashboardHeader title="My Leave Requests" />

      <div className="flex items-start justify-between mb-6 gap-4">
        <p className="text-sm text-muted-foreground">
          Overview of your submitted leave requests
        </p>
        <Button size="lg" onClick={() => setOpen(true)}>
          Request Leave
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Total Requests</div>
            <div className="text-2xl font-bold">{totals.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold">{totals.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-2xl font-bold">{totals.approved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : data.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No leave requests yet
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.leaveType}</TableCell>
                    <TableCell>
                      {r.startDate} — {r.endDate}
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.status}>{r.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(r.submittedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <h3 className="text-lg font-semibold">Request Leave</h3>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="space-y-4">
            <select {...register("leaveType")} className="w-full border p-2">
              <option value="">Select leave type</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal Leave">Personal Leave</option>
            </select>

            <input type="date" {...register("startDate")} className="w-full border p-2" />
            <input type="date" {...register("endDate")} className="w-full border p-2" />

            <textarea
              {...register("reason")}
              className="w-full border p-2"
              placeholder="Reason (optional)"
            />
          </DialogBody>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </main>
  );
}
