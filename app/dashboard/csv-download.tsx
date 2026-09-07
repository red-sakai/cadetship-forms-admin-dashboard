"use client";

export type CsvColumn<T> = {
  label: string;
  value: (row: T) => string | null | undefined;
};

type CsvDownloadButtonProps<T> = {
  rows: T[];
  columns: CsvColumn<T>[];
  fileName: string;
};

function escapeCsvValue(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function buildCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(
    ",",
  );
  const body = rows.map((row) => {
    const line = columns.map((column) => {
      const rawValue = column.value(row) ?? "";
      return escapeCsvValue(rawValue);
    }).join(",");
    return line;
  });

  return [header, ...body].join("\r\n");
}

export default function CsvDownloadButton<T>({
  rows,
  columns,
  fileName,
}: CsvDownloadButtonProps<T>) {
  const handleDownload = () => {
    const csvContent = buildCsv(rows, columns);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      className="dashboard-button"
      onClick={handleDownload}
      disabled={rows.length === 0}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download CSV
    </button>
  );
}
