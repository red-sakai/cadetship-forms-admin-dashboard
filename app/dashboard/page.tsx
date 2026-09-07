import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import TableTabs from "./table-tabs";
import ToBeInterviewedTable from "./to-be-interviewed-table";
import DepartmentCharts from "./department-charts";
import AutoRefresh from "./auto-refresh";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const TECH_CADET_LABELS = [
  { label: "Enterprise Networking Cadet", match: "Enterprise Networking" },
  { label: "Cybersecurity Operations Cadet", match: "Cybersecurity Operations" },
  { label: "Developer Network Cadet", match: "Developer Network" },
];

const OPERATIONS_LABELS = [
  { label: "Program Manager", match: "Program Manager" },
  { label: "Host", match: "Host" },
  { label: "Technical Coordinator", match: "Technical Coordinator" },
  { label: "Logistics & Resource Coordinator", match: "Logistics and Resource Coordinator" },
  { label: "Registration & Access Coordinator", match: "Registration and Access Coordinator" },
  { label: "Media Documentation Officer", match: "Media Documentation Officer" },
];

const CREATIVES_LABELS = [
  { label: "Video Editor", match: "Video Editor" },
  { label: "Animator", match: "Animator" },
  { label: "Photographer/Videographer", match: "Photographer/Videographer" },
  { label: "Graphic Designer", match: "Graphic Designer" },
  { label: "Illustrator", match: "Illustrator" },
];

const MARKETING_LABELS = [
  { label: "Chief Marketing Officer", match: "Chief Marketing Officer" },
  { label: "Vice Chief Marketing Officer", match: "Vice Chief Marketing Officer" },
  { label: "Caption Writer & Engagement Analyst", match: "Caption Writer and Engagement Analyst" },
  { label: "Content Strategist & Video Director", match: "Content Strategist and Video Director" },
];

const RELATIONS_LABELS = [
  { label: "Community Partnership Lead", match: "Community Partnership Lead" },
  { label: "Community Partnership Co-Lead", match: "Community Partnership Co-Lead" },
  { label: "Sponsors Lead", match: "Sponsors Lead" },
  { label: "Sponsors Co-Lead", match: "Sponsors Co-Lead" },
  { label: "Engagement Lead", match: "Engagement Lead" },
  { label: "Engagement Co-Lead", match: "Engagement Co-Lead" },
  { label: "Membership Lead", match: "Membership Lead" },
  { label: "Membership Co-Lead", match: "Membership Co-Lead" },
  { label: "Community Member", match: "Community Member" },
];

const ADMINISTRATIVE_LABELS = [
  { label: "Secretariat Officer", match: "Secretariat Officer" },
  { label: "Membership Officer", match: "Membership Officer" },
  { label: "Institutional Affairs Officer", match: "Institutional Affairs Officer" },
  { label: "Internal Operations Officer", match: "Internal Operations Officer" },
  { label: "Administrative Systems Officer", match: "Administrative Systems Officer" },
  { label: "Events & Records Officer", match: "Events & Records Officer" },
];

const EXECUTIVE_LABELS = [
  { label: "Vice Chief Executive Officer", match: "Vice Chief Executive Officer" },
];

const FINANCE_LABELS = [
  { label: "Chief Finance Officer", match: "Chief Finance Officer" },
  { label: "Vice Chief Finance Officer", match: "Vice Chief Finance Officer" },
  { label: "Auditor", match: "Auditor" },
];

type RegistrationRow = {
  created_at: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  facebook_link: string | null;
  facebook_shared_post: string | null;
  discord_username: string | null;
  linkedin_link: string | null;
  pup_webmail: string | null;
  phone: string | null;
  course_year_section: string | null;
  certificate_link: string | null;
  college_campus: string | null;
  membership_type: string | null;
};

type TechnologyCadetRow = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  track: string | null;
  question_1: string | null;
  question_2: string | null;
};

type OperationsRow = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  committee: string | null;
  application_role: string | null;
  question_answers: Record<string, unknown> | null;
};

type CreativesRow = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  team: string | null;
  application_role: string | null;
  question_answers: Record<string, unknown> | null;
};

type MarketingRow = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  team: string | null;
  application_role: string | null;
  question_answers: Record<string, unknown> | null;
};

type RelationsRow = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  team: string | null;
  application_role: string | null;
  question_answers: Record<string, unknown> | null;
};

type AdministrativeRow = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  application_role: string | null;
  question_answers: Record<string, unknown> | null;
};

type ExecutiveRow = AdministrativeRow & {
  last_name: string | null;
};

type FinanceRow = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  application_role: string | null;
  question_answers: Record<string, unknown> | null;
};

type ToBeInterviewedRow = {
  id: string;
  name: string;
  email: string;
  department: string;
  team: string | null;
  role: string | null;
  status: "pending" | "passed" | "failed";
};

type MonthlyCount = {
  label: string;
  count: number;
};

function getYearToDateMonths(now: Date): MonthlyCount[] {
  const months: MonthlyCount[] = [];
  const year = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();

  for (let month = 0; month <= currentMonth; month += 1) {
    const label = `${MONTH_LABELS[month]} ${year}`;
    months.push({ label, count: 0 });
  }

  return months;
}

function buildMonthlyCounts(rows: RegistrationRow[], now: Date): MonthlyCount[] {
  const months = getYearToDateMonths(now);
  const year = now.getUTCFullYear();

  rows.forEach((row) => {
    if (!row.created_at) {
      return;
    }

    const date = new Date(row.created_at);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    const rowYear = date.getUTCFullYear();
    const rowMonth = date.getUTCMonth();
    if (rowYear !== year || rowMonth < 0 || rowMonth >= months.length) {
      return;
    }

    months[rowMonth].count += 1;
  });

  return months;
}

function countMatches(
  rows: Array<Record<string, unknown>>,
  key: string,
  value: string,
): number {
  return rows.filter((row) => row[key] === value).length;
}

function formatName(
  firstName: string | null,
  lastName?: string | null,
): string {
  const first = (firstName ?? "").trim();
  const last = (lastName ?? "").trim();
  return [first, last].filter(Boolean).join(" ") || "-";
}

async function signOut() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  redirect("/");
}

async function updateInterviewStatus(id: string, status: ToBeInterviewedRow["status"]) {
  "use server";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: {
      fetch: (url, options) =>
        fetch(url, { ...options, cache: "no-store" }),
    },
  });
  await supabase.from("to_be_interviewed").update({ status }).eq("id", id);
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get("admin_auth")?.value === "1";

  if (!isAuthed) {
    redirect("/");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
  const now = new Date();
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

  let monthlyCounts: MonthlyCount[] = getYearToDateMonths(now);
  let loadError: string | null = null;
  let registrations: RegistrationRow[] = [];
  let technologyCadetRows: TechnologyCadetRow[] = [];
  let operationsRows: OperationsRow[] = [];
  let creativesRows: CreativesRow[] = [];
  let marketingRows: MarketingRow[] = [];
  let relationsRows: RelationsRow[] = [];
  let administrativeRows: AdministrativeRow[] = [];
  let executiveRows: ExecutiveRow[] = [];
  let financeRows: FinanceRow[] = [];
  let interviewRows: ToBeInterviewedRow[] = [];

  if (!supabaseUrl || !supabaseAnonKey) {
    loadError = "Supabase credentials are not configured.";
  } else {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: {
        fetch: (url, options) =>
          fetch(url, { ...options, cache: "no-store" }),
      },
    });
    const [reg, tech, ops, creat, mkt, rel, admin, exec, fin] = await Promise.all([
      supabase
        .from("registration_personal_info")
        .select(
          "created_at, first_name, last_name, email, facebook_link, facebook_shared_post, discord_username, linkedin_link, pup_webmail, phone, course_year_section, certificate_link, college_campus, membership_type",
        )
        .order("created_at", { ascending: false })
        .gte("created_at", yearStart.toISOString()),

      supabase
        .from("registration_technology_cadet")
        .select(
          "id, created_at, first_name, last_name, email, track, question_1, question_2",
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("registration_operations_department")
        .select(
          "id, created_at, first_name, last_name, email, committee, application_role, question_answers",
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("registration_creatives_department")
        .select(
          "id, created_at, first_name, last_name, email, team, application_role, question_answers",
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("registration_marketing_department")
        .select(
          "id, created_at, first_name, last_name, email, team, application_role, question_answers",
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("registration_relations_department")
        .select(
          "id, created_at, first_name, last_name, email, team, application_role, question_answers",
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("registration_administrative_department")
        .select(
          "id, created_at, first_name, last_name, email, application_role, question_answers",
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("registration_executive_department")
        .select(
          "id, created_at, first_name, last_name, email, application_role, question_answers",
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("registration_finance_department")
        .select(
          "id, created_at, first_name, last_name, email, application_role, question_answers",
        )
        .order("created_at", { ascending: false }),
    ]);

    const { data, error } = reg;
    const { data: techCadetData, error: techCadetError } = tech;
    const { data: operationsData, error: operationsError } = ops;
    const { data: creativesData, error: creativesError } = creat;
    const { data: marketingData, error: marketingError } = mkt;
    const { data: relationsData, error: relationsError } = rel;
    const { data: administrativeData, error: administrativeError } = admin;
    const { data: executiveData, error: executiveError } = exec;
    const { data: financeData, error: financeError } = fin;

    if (
      error ||
      techCadetError ||
      operationsError ||
      creativesError ||
      marketingError ||
      relationsError ||
      administrativeError ||
      executiveError ||
      financeError
    ) {
      loadError =
        error?.message ??
        techCadetError?.message ??
        operationsError?.message ??
        creativesError?.message ??
        marketingError?.message ??
        relationsError?.message ??
        administrativeError?.message ??
        executiveError?.message ??
        financeError?.message ??
        null;
    } else {
      registrations = (data as RegistrationRow[]) ?? [];
      monthlyCounts = buildMonthlyCounts(registrations, now);
      technologyCadetRows = (techCadetData as TechnologyCadetRow[]) ?? [];
      operationsRows = (operationsData as OperationsRow[]) ?? [];
      creativesRows = (creativesData as CreativesRow[]) ?? [];
      marketingRows = (marketingData as MarketingRow[]) ?? [];
      relationsRows = (relationsData as RelationsRow[]) ?? [];
      administrativeRows = (administrativeData as AdministrativeRow[]) ?? [];
      executiveRows = (executiveData as ExecutiveRow[]) ?? [];
      financeRows = (financeData as FinanceRow[]) ?? [];

      const candidateRows = [
        ...technologyCadetRows.map((row) => ({
          name: formatName(row.first_name, row.last_name),
          email: row.email ?? "",
          department: "Technology",
          team: row.track ?? null,
          role: row.track ? `${row.track} Cadet` : null,
          status: "pending" as const,
        })),
        ...operationsRows
          .filter((row) =>
            ["Program Manager", "Operations Manager"].includes(
              row.application_role ?? "",
            ),
          )
          .map((row) => ({
            name: formatName(row.first_name, row.last_name),
            email: row.email ?? "",
            department: "Operations",
            team: row.committee ?? null,
            role: row.application_role ?? null,
            status: "pending" as const,
          })),
        ...relationsRows.map((row) => ({
          name: formatName(row.first_name, row.last_name),
          email: row.email ?? "",
          department: "Relations",
          team: row.team ?? null,
          role: row.application_role ?? null,
          status: "pending" as const,
        })),
      ].filter((row) => row.email);

      if (candidateRows.length > 0) {
        await supabase.from("to_be_interviewed").upsert(candidateRows, {
          onConflict: "email,department,role",
          ignoreDuplicates: true,
        });
      }

      const { data: interviewData } = await supabase
        .from("to_be_interviewed")
        .select("id, name, email, department, team, role, status")
        .order("created_at", { ascending: false });
      interviewRows = (interviewData as ToBeInterviewedRow[]) ?? [];
    }
  }

  const totalApplicants = monthlyCounts.reduce(
    (sum, month) => sum + month.count,
    0,
  );

  const departmentTotals = [
    { label: "Tech", count: technologyCadetRows.length },
    { label: "Ops", count: operationsRows.length },
    { label: "Creatives", count: creativesRows.length },
    { label: "Marketing", count: marketingRows.length },
    { label: "Relations", count: relationsRows.length },
    { label: "Admin", count: administrativeRows.length },
    { label: "Exec", count: executiveRows.length },
    { label: "Finance", count: financeRows.length },
  ];

  const teamGroups = [
    {
      title: "Technology",
      rows: technologyCadetRows,
      key: "track",
      labels: TECH_CADET_LABELS,
    },
    {
      title: "Operations",
      rows: operationsRows,
      key: "application_role",
      labels: OPERATIONS_LABELS,
    },
    {
      title: "Creatives",
      rows: creativesRows,
      key: "application_role",
      labels: CREATIVES_LABELS,
    },
    {
      title: "Marketing",
      rows: marketingRows,
      key: "application_role",
      labels: MARKETING_LABELS,
    },
    {
      title: "Relations",
      rows: relationsRows,
      key: "application_role",
      labels: RELATIONS_LABELS,
    },
    {
      title: "Administrative",
      rows: administrativeRows,
      key: "application_role",
      labels: ADMINISTRATIVE_LABELS,
    },
    {
      title: "Executive",
      rows: executiveRows,
      key: "application_role",
      labels: EXECUTIVE_LABELS,
    },
    {
      title: "Finance",
      rows: financeRows,
      key: "application_role",
      labels: FINANCE_LABELS,
    },
  ].map((group) => {
    const items = group.labels.map(({ label, match }) => ({
      label,
      count: countMatches(group.rows, group.key, match),
    }));
    const max = Math.max(1, ...items.map((item) => item.count));
    const total = items.reduce((sum, item) => sum + item.count, 0);
    return { ...group, items, max, total };
  }) satisfies Array<{
    title: string;
    rows: Array<Record<string, unknown>>;
    key: string;
    labels: Array<{ label: string; match: string }>;
    items: Array<{ label: string; count: number }>;
    max: number;
    total: number;
  }>;

  const toBeInterviewed = interviewRows;

  const thisMonthCount =
    monthlyCounts.length > 0 ? monthlyCounts[monthlyCounts.length - 1].count : 0;
  const activeDepartments = departmentTotals.filter((dept) => dept.count > 0)
    .length;
  const pendingInterviews = interviewRows.filter(
    (row) => row.status === "pending",
  ).length;
  const lastUpdated = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="dashboard-page">
      <AutoRefresh />
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <Image
              src="/cncp-fb-logo.jpg"
              alt="CNCP logo"
              className="app-logo"
              width={34}
              height={34}
            />
            <div className="app-brand-text">
              <strong>CNCP Membership</strong>
              <small>Admin console</small>
            </div>
          </div>
          <div className="app-header-actions">
            <span className="app-live">
              <span className="app-live-dot" aria-hidden="true" />
              Auto-refresh 30s · updated {lastUpdated}
            </span>
            <form action={signOut}>
              <button type="submit" className="app-signout">
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="dashboard-shell">
        <div className="dashboard-stack">
          <section className="dashboard-hero anim">
            <div>
              <p className="dashboard-eyebrow">
                CNCP Recruitment {now.getUTCFullYear()}
              </p>
              <h1 className="dashboard-title">Membership Dashboard</h1>
              <p className="dashboard-subtitle">
                Year-to-date applicants across all membership forms.
              </p>
            </div>
          </section>

          <section className="dashboard-stats" aria-label="Key metrics">
            <article
              className="dashboard-stat-card anim"
              style={{ animationDelay: "60ms" }}
            >
              <span className="dashboard-stat-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <div>
                <p className="dashboard-stat-label">Total applicants</p>
                <strong className="dashboard-stat-value">
                  {totalApplicants}
                </strong>
              </div>
              <p className="dashboard-stat-note">Year to date</p>
            </article>

            <article
              className="dashboard-stat-card anim"
              style={{ animationDelay: "140ms" }}
            >
              <span className="dashboard-stat-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <div>
                <p className="dashboard-stat-label">This month</p>
                <strong className="dashboard-stat-value">
                  {thisMonthCount}
                </strong>
              </div>
              <p className="dashboard-stat-note">
                {MONTH_LABELS[now.getUTCMonth()]} {now.getUTCFullYear()}
              </p>
            </article>

            <article
              className="dashboard-stat-card anim"
              style={{ animationDelay: "220ms" }}
            >
              <span className="dashboard-stat-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 2 8.5 4.5L12 11 3.5 6.5 12 2Z" />
                  <path d="m3.5 11.5 8.5 4.5 8.5-4.5" />
                  <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
                </svg>
              </span>
              <div>
                <p className="dashboard-stat-label">Departments</p>
                <strong className="dashboard-stat-value">
                  {activeDepartments}
                  <span className="dashboard-stat-denominator">
                    /{departmentTotals.length}
                  </span>
                </strong>
              </div>
              <p className="dashboard-stat-note">With submissions</p>
            </article>

            <article
              className="dashboard-stat-card anim"
              style={{ animationDelay: "300ms" }}
            >
              <span className="dashboard-stat-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div>
                <p className="dashboard-stat-label">Pending interviews</p>
                <strong className="dashboard-stat-value">
                  {pendingInterviews}
                </strong>
              </div>
              <p className="dashboard-stat-note">
                {toBeInterviewed.length} candidates total
              </p>
            </article>
          </section>

          <section
            className="dashboard-card anim"
            style={{ animationDelay: "380ms" }}
            aria-label="Dashboard overview"
          >
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h2>Applicants by department</h2>
                <span>{departmentTotals.length} departments</span>
              </div>

              {loadError ? (
                <p className="dashboard-error" role="status">
                  {loadError}
                </p>
              ) : (
                <DepartmentCharts departments={departmentTotals} />
              )}
            </div>

            <div className="dashboard-panel dashboard-panel-bordered">
              <div className="dashboard-panel-header">
                <h2>Applicants by team</h2>
                <span>Leadership roles</span>
              </div>

              {loadError ? (
                <p className="dashboard-error" role="status">
                  {loadError}
                </p>
              ) : (
                <div className="dashboard-team-grid">
                  {teamGroups.map((group, index) => (
                    <section
                      key={group.title}
                      className="dashboard-team-card anim"
                      style={{ animationDelay: `${420 + index * 60}ms` }}
                    >
                      <div className="dashboard-team-header">
                        <h3>{group.title}</h3>
                        <span>{group.total}</span>
                      </div>
                      <div className="dashboard-team-bars">
                        {group.items.map((item) => (
                          <div
                            key={item.label}
                            className="dashboard-team-row"
                          >
                            <span className="dashboard-team-label">
                              {item.label}
                            </span>
                            <div className="dashboard-team-track">
                              <div
                                className="dashboard-team-fill"
                                style={{
                                  width: `${Math.round(
                                    (item.count / group.max) * 100,
                                  )}%`,
                                }}
                              />
                            </div>
                            <span className="dashboard-team-count">
                              {item.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section
            className="dashboard-card anim"
            style={{ animationDelay: "500ms" }}
            aria-label="Applicants table"
          >
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h2>Applicants</h2>
                <div className="dashboard-panel-header-actions">
                  <span className="dashboard-chip">
                    {registrations.length} rows
                  </span>
                </div>
              </div>

              {loadError ? (
                <p className="dashboard-error" role="status">
                  {loadError}
                </p>
              ) :
                registrations.length === 0 &&
                technologyCadetRows.length === 0 &&
                operationsRows.length === 0 &&
                creativesRows.length === 0 &&
                marketingRows.length === 0 &&
                relationsRows.length === 0 &&
                administrativeRows.length === 0 &&
                executiveRows.length === 0 &&
                financeRows.length === 0 ? (
                <p className="dashboard-empty" role="status">
                  No submissions yet.
                </p>
              ) : (
                <TableTabs
                  personalRows={registrations}
                  technologyCadetRows={technologyCadetRows}
                  operationsRows={operationsRows}
                  creativesRows={creativesRows}
                  marketingRows={marketingRows}
                  relationsRows={relationsRows}
                  administrativeRows={administrativeRows}
                  executiveRows={executiveRows}
                  financeRows={financeRows}
                />
              )}
            </div>
          </section>

          <section
            className="dashboard-card anim"
            style={{ animationDelay: "580ms" }}
            aria-label="To be interviewed"
          >
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h2>To Be Interviewed</h2>
                <div className="dashboard-panel-header-actions">
                  <span className="dashboard-chip amber">
                    {pendingInterviews} pending
                  </span>
                  <span className="dashboard-chip">
                    {toBeInterviewed.length} candidates
                  </span>
                </div>
              </div>

              {toBeInterviewed.length === 0 ? (
                <p className="dashboard-empty" role="status">
                  No candidates queued for interviews.
                </p>
              ) : (
                <ToBeInterviewedTable
                  rows={toBeInterviewed}
                  onUpdateStatus={updateInterviewStatus}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
