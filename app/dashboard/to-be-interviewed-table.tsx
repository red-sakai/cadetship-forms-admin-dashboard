"use client";

import { useTransition } from "react";

type InterviewRow = {
  id: string;
  name: string;
  email: string;
  department: string;
  team: string | null;
  role: string | null;
  status: "pending" | "passed" | "failed";
};

type ToBeInterviewedTableProps = {
  rows: InterviewRow[];
  onUpdateStatus: (id: string, status: InterviewRow["status"]) => Promise<void>;
};

export default function ToBeInterviewedTable({
  rows,
  onUpdateStatus,
}: ToBeInterviewedTableProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="dashboard-table-wrap">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Team</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>{row.department}</td>
              <td>{row.team ?? "-"}</td>
              <td>{row.role ?? "-"}</td>
              <td>
                <select
                  className={`dashboard-status-select status-${row.status}`}
                  value={row.status}
                  disabled={isPending}
                  onChange={(event) => {
                    const nextStatus = event.target.value as InterviewRow["status"];
                    startTransition(async () => {
                      await onUpdateStatus(row.id, nextStatus);
                    });
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
