"use client";

import { useMemo, useState, useTransition } from "react";

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

const PAGE_SIZE = 10;

export default function ToBeInterviewedTable({
  rows,
  onUpdateStatus,
}: ToBeInterviewedTableProps) {
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pagedRows = useMemo(
    () => rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [rows, safePage],
  );

  return (
    <>
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
            {pagedRows.map((row) => (
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
      {rows.length > PAGE_SIZE && (
        <div className="dashboard-pagination">
          <span>
            Showing{" "}
            {rows.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, rows.length)} of {rows.length}
          </span>
          <div className="dashboard-pagination-actions">
            <button
              type="button"
              className="dashboard-page-button"
              disabled={safePage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="dashboard-page-button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
