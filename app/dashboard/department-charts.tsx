"use client";

import { useRef, useState } from "react";

export type DepartmentSlice = {
  label: string;
  count: number;
};

const COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#14b8a6",
  "#64748b",
];

const BAR_WIDTH = 44;
const BAR_GAP = 26;
const CHART_HEIGHT = 160;
const DONUT_RADIUS = 60;
const DONUT_STROKE = 22;
const DONUT_GAP = 3;

type DepartmentChartsProps = {
  departments: DepartmentSlice[];
};

function DepartmentBarChart({
  departments,
}: {
  departments: DepartmentSlice[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(
    null,
  );

  const max = Math.max(1, ...departments.map((dept) => dept.count));
  const viewWidth = departments.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
  const viewHeight = CHART_HEIGHT + 60;

  const handleBarMove = (index: number, event: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    const width = rect?.width ?? 0;
    const x = Math.min(
      Math.max(event.clientX - (rect?.left ?? 0), 44),
      Math.max(44, width - 44),
    );
    const y = event.clientY - (rect?.top ?? 0);
    setHoverIndex(index);
    setTooltip({ x, y });
  };

  const handleBarLeave = () => {
    setHoverIndex(null);
    setTooltip(null);
  };

  return (
    <div className="charts-bars-wrap" ref={wrapRef}>
      <svg
        className="charts-bars"
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        role="img"
        aria-label="Applicants by department bar chart"
      >
        {[0.25, 0.5, 0.75, 1].map((fraction) => {
          const y = CHART_HEIGHT - CHART_HEIGHT * fraction;
          return (
            <line
              key={fraction}
              x1={0}
              x2={viewWidth}
              y1={y}
              y2={y}
              className="charts-gridline"
            />
          );
        })}
        {departments.map((dept, index) => {
          const height = Math.round((dept.count / max) * CHART_HEIGHT);
          const x = index * (BAR_WIDTH + BAR_GAP);
          const y = CHART_HEIGHT - height;
          return (
            <g
              key={dept.label}
              className="charts-bar-group"
              onMouseMove={(event) => handleBarMove(index, event)}
              onMouseLeave={handleBarLeave}
            >
              <title>{`${dept.label}: ${dept.count}`}</title>
              <rect
                x={x}
                y={y}
                width={BAR_WIDTH}
                height={height > 0 ? height : 2}
                rx={6}
                className="charts-bar"
                style={{
                  fill: COLORS[index % COLORS.length],
                  animationDelay: `${index * 60}ms`,
                }}
              />
              <text
                x={x + BAR_WIDTH / 2}
                y={CHART_HEIGHT + 28}
                textAnchor="middle"
                className="charts-bar-label"
              >
                {dept.label}
              </text>
            </g>
          );
        })}
      </svg>
      {tooltip && hoverIndex !== null ? (
        <div
          className="charts-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <span
            className="charts-tooltip-dot"
            style={{ background: COLORS[hoverIndex % COLORS.length] }}
            aria-hidden="true"
          />
          <div className="charts-tooltip-text">
            <span className="charts-tooltip-label">
              {departments[hoverIndex].label}
            </span>
            <strong className="charts-tooltip-count">
              {departments[hoverIndex].count}
            </strong>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DepartmentDonut({
  departments,
  total,
}: {
  departments: DepartmentSlice[];
  total: number;
}) {
  const circumference = 2 * Math.PI * DONUT_RADIUS;
  const size = (DONUT_RADIUS + DONUT_STROKE) * 2;
  const center = size / 2;
  const segments: Array<{
    label: string;
    sweep: number;
    offset: number;
    color: string;
  }> = [];
  let cursor = 0;
  departments.forEach((dept, index) => {
    if (dept.count === 0) {
      return;
    }

    const fraction = dept.count / total;
    const sweep = fraction * circumference - DONUT_GAP;
    segments.push({
      label: dept.label,
      sweep: Math.max(0, sweep),
      offset: -cursor,
      color: COLORS[index % COLORS.length],
    });
    cursor += fraction * circumference;
  });

  return (
    <div className="charts-donut-block anim-fade">
      <svg
        className="charts-donut"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Applicants by department donut chart"
      >
        <circle
          cx={center}
          cy={center}
          r={DONUT_RADIUS}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={DONUT_STROKE}
        />
        {segments.map((segment) => (
          <circle
            key={segment.label}
            cx={center}
            cy={center}
            r={DONUT_RADIUS}
            fill="none"
            stroke={segment.color}
            strokeWidth={DONUT_STROKE}
            strokeDasharray={`${segment.sweep} ${circumference - segment.sweep}`}
            strokeDashoffset={segment.offset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        ))}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          className="charts-donut-value"
        >
          {total}
        </text>
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          className="charts-donut-caption"
        >
          applicants
        </text>
      </svg>
      <div className="charts-legend">
        {departments.map((dept, index) => (
          <div key={dept.label} className="charts-legend-row">
            <span
              className="charts-legend-dot"
              style={{ background: COLORS[index % COLORS.length] }}
              aria-hidden="true"
            />
            <span>{dept.label}</span>
            <span className="charts-legend-count">{dept.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DepartmentCharts({
  departments,
}: DepartmentChartsProps) {
  const total = departments.reduce((sum, dept) => sum + dept.count, 0);

  if (total === 0) {
    return (
      <p className="dashboard-empty" role="status">
        No submissions yet.
      </p>
    );
  }

  return (
    <div className="charts-layout">
      <DepartmentBarChart departments={departments} />
      <DepartmentDonut departments={departments} total={total} />
    </div>
  );
}