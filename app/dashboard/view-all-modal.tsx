"use client";

import { type ReactElement, useEffect, useMemo, useRef, useState } from "react";
import CsvDownloadButton, { type CsvColumn } from "./csv-download";

type PersonalRow = {
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

type ExecutiveRow = AdministrativeRow;

type FinanceRow = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  application_role: string | null;
  question_answers: Record<string, unknown> | null;
};

type TabKey =
  | "personal"
  | "technology"
  | "operations"
  | "creatives"
  | "marketing"
  | "relations"
  | "administrative"
  | "executive"
  | "finance";

type FilterKey = string;

type ViewAllModalProps = {
  open: boolean;
  onClose: () => void;
  activeTab: TabKey;
  personalRows: PersonalRow[];
  technologyCadetRows: TechnologyCadetRow[];
  operationsRows: OperationsRow[];
  creativesRows: CreativesRow[];
  marketingRows: MarketingRow[];
  relationsRows: RelationsRow[];
  administrativeRows: AdministrativeRow[];
  executiveRows: ExecutiveRow[];
  financeRows: FinanceRow[];
};

const TABS: { key: TabKey; label: string }[] = [
  { key: "personal", label: "Personal Info" },
  { key: "technology", label: "Technology" },
  { key: "operations", label: "Operations" },
  { key: "creatives", label: "Creatives" },
  { key: "marketing", label: "Marketing" },
  { key: "relations", label: "Relations" },
  { key: "administrative", label: "Administrative" },
  { key: "executive", label: "Executive" },
  { key: "finance", label: "Finance" },
];

const TECH_FILTERS: FilterKey[] = [
  "All",
  "Enterprise Networking",
  "Cybersecurity Operations",
  "Developer Network",
];

const OPS_FILTERS: FilterKey[] = [
  "All",
  "Program Manager",
  "Host",
  "Technical Coordinator",
  "Logistics and Resource Coordinator",
  "Registration and Access Coordinator",
  "Media Documentation Officer",
];

const CREATIVES_FILTERS: FilterKey[] = [
  "All",
  "Video Editor",
  "Animator",
  "Photographer/Videographer",
  "Graphic Designer",
  "Illustrator",
];

const MARKETING_FILTERS: FilterKey[] = [
  "All",
  "Chief Marketing Officer",
  "Vice Chief Marketing Officer",
  "Caption Writer and Engagement Analyst",
  "Content Strategist and Video Director",
];

const RELATIONS_FILTERS: FilterKey[] = [
  "All",
  "Community Partnership Lead",
  "Community Partnership Co-Lead",
  "Sponsors Lead",
  "Sponsors Co-Lead",
  "Engagement Lead",
  "Engagement Co-Lead",
  "Membership Lead",
  "Membership Co-Lead",
  "Community Member",
];

const ADMIN_FILTERS: FilterKey[] = [
  "All",
  "Secretariat Officer",
  "Membership Officer",
  "Institutional Affairs Officer",
  "Internal Operations Officer",
  "Administrative Systems Officer",
  "Events & Records Officer",
];

const EXEC_FILTERS: FilterKey[] = ["All", "Vice Chief Executive Officer"];

const FINANCE_FILTERS: FilterKey[] = [
  "All",
  "Chief Finance Officer",
  "Vice Chief Finance Officer",
  "Auditor",
];

const TECH_QUESTIONS: Record<string, string[]> = {
  "Enterprise Networking": [
    "What interests you about learning how computer networks work, and what do you hope to gain from the Enterprise Networking track?",
    "If you could set up or troubleshoot a network for a school or small office, what would you want to learn first?",
  ],
  "Cybersecurity Operations": [
    "What interests you about cybersecurity and protecting computer systems, and what do you hope to gain from the Cybersecurity Operations track?",
    "If you could learn one skill to keep networks safe from threats, what would it be and why?",
  ],
  "Developer Network": [
    "What interests you about programming and automation, and what do you hope to gain from the Developer Network track?",
    "If you could build a tool that automates a repetitive task, what kind of tool would you want to create?",
  ],
};

const OFFICER_QUESTIONS: Record<string, string[]> = {
  "Program Manager": [
    "How would you approach planning and coordinating a CNCP event from start to finish?",
    "Describe a time you managed timelines or coordinated multiple tasks for a project. How did you ensure everything stayed on track?",
  ],
  Host: [
    "How would you engage with attendees and manage the flow of an event you're hosting?",
    "Describe a time you presented or facilitated a discussion. How did you keep the audience engaged?",
  ],
  "Technical Coordinator": [
    "How would you ensure that all technical systems (AV, streaming, etc.) are functioning correctly before and during an event?",
    "Describe a time you troubleshooted a technical issue during an event. How did you handle it?",
  ],
  "Logistics and Resource Coordinator": [
    "How would you approach managing the setup and transportation of equipment for an event?",
    "How would you ensure that all necessary items are available and in place before an event starts?",
  ],
  "Registration and Access Coordinator": [
    "How would you manage event registration processes and ensure proper access control?",
    "Describe a time you handled a registration issue or managed a guest list. How did you resolve any problems?",
  ],
  "Media Documentation Officer": [
    "How would you approach capturing high-quality photos and visual documentation during an event?",
    "How would you ensure that event photos are properly archived and organized for future use?",
  ],
  "Video Editor": [
    "How would you approach the post-production process to create engaging video content for CNCP?",
    "Describe a time you edited a video or worked with footage. What tools did you use and what did you learn from the experience?",
  ],
  Animator: [
    "How would you develop animated elements that complement video content or stand alone as engaging digital assets?",
    "Describe a time you created an animation or motion-based visual. What was your creative process and what did you learn?",
  ],
  "Photographer/Videographer": [
    "How would you approach capturing high-quality images and videos during a CNCP event or campaign?",
    "Describe a time you took photos or shot video for a project. How did you ensure the visuals told an engaging story?",
  ],
  "Graphic Designer": [
    "How would you create visually appealing layouts that combine typography, color, and design elements for CNCP materials?",
    "Describe a time you designed graphics or visual materials. How did you ensure brand consistency and visual impact?",
  ],
  Illustrator: [
    "How would you approach crafting custom visual elements such as mascots or unique illustrations for CNCP?",
    "Describe a time you created an illustration or custom visual element. What was your creative process and what did you learn?",
  ],
  "Chief Marketing Officer": [
    "What does leading a marketing team look like to you, and how would you set the direction for CNCP's brand?",
    "Tell us about a time you led or took charge of a project or activity from start to finish.",
  ],
  "Vice Chief Marketing Officer": [
    "How would you help the Chief Marketing Officer plan and pace the team's content and campaigns?",
    "If two team members had different ideas for a campaign, how would you help them move forward?",
  ],
  "Caption Writer and Engagement Analyst": [
    "How would you approach creating captions that reflect CNCP's brand voice while encouraging engagement from followers?",
    "What strategies would you use to analyze engagement metrics and use them to improve future content?",
  ],
  "Content Strategist and Video Director": [
    "How would you approach brainstorming and developing ideas for a new CNCP campaign or post?",
    "How would you ensure that messaging such as titles, taglines, and key concepts are attention-grabbing and on-brand?",
  ],
  "Community Partnership Lead": [
    "How would you identify and establish partnerships with other student organizations and academic communities to strengthen CNCP's presence?",
    "Describe a time you built or maintained a professional relationship with an external group. How did you approach it and what was the outcome?",
  ],
  "Community Partnership Co-Lead": [
    "How would you support the Community Partnership Lead in managing external relationships and coordinating partnership activities?",
    "How would you handle a situation where a potential partner organization is unresponsive to outreach?",
  ],
  "Sponsors Lead": [
    "How would you approach potential sponsors to secure support for CNCP's activities and initiatives?",
    "Describe a time you persuaded someone to support a cause or project. What strategies did you use and how did it go?",
  ],
  "Sponsors Co-Lead": [
    "How would you assist the Sponsors Lead in preparing sponsorship proposals and managing follow-ups?",
    "How would you organize and maintain sponsor information to ensure effective communication?",
  ],
  "Engagement Lead": [
    "How would you design and implement an engagement strategy that keeps members active and connected within the community?",
    "How would you evaluate the effectiveness of engagement initiatives and adjust strategies based on feedback?",
  ],
  "Engagement Co-Lead": [
    "How would you plan and facilitate an engaging community activity or event for CNCP members?",
    "How would you handle low participation in an engagement initiative you're leading?",
  ],
  "Membership Lead": [
    "How would you develop and execute a recruitment strategy to grow CNCP's membership base?",
    "How would you organize the onboarding process to ensure new members feel welcomed and integrated?",
  ],
  "Membership Co-Lead": [
    "How would you assist the Membership Lead in coordinating recruitment campaigns and onboarding activities?",
    "How would you follow up with potential applicants who have shown interest but haven't completed their application?",
  ],
  "Community Member": [
    "How would you contribute to community initiatives and help strengthen participation within CNCP?",
    "What ideas do you have for activities or events that could improve member engagement in the organization?",
  ],
  "Secretariat Officer": [
    "How would you manage official documentation and ensure that organizational records are accurate and accessible?",
    "Describe a time you managed documents, schedules, or records. How did you stay organized and ensure nothing was missed?",
  ],
  "Membership Officer": [
    "How would you manage membership records and ensure that member information is complete and up to date?",
    "Describe a time you handled member-related administration or processed applications. How did you ensure accuracy and efficiency?",
  ],
  "Institutional Affairs Officer": [
    "How would you coordinate with the school regarding organizational requirements such as the GPOA?",
    "Describe a time you followed up on pending submissions or coordinated with institutional offices. How did you ensure timely completion?",
  ],
  "Internal Operations Officer": [
    "How would you monitor administrative tasks and ensure that deadlines are met across departments?",
    "Describe a time you identified delayed or incomplete tasks and escalated them appropriately. How did you handle it?",
  ],
  "Administrative Systems Officer": [
    "How would you manage the administrative use of CNCP's systems and ensure they support operational needs?",
    "Describe a time you identified gaps or inefficiencies in a system or workflow. How did you address them?",
  ],
  "Events & Records Officer": [
    "How would you coordinate the administrative requirements for a CNCP event with the Operations Department?",
    "Describe a time you tracked event statistics or participation data. How did you ensure accuracy and completeness?",
  ],
  "Vice Chief Executive Officer": [
    "What does being part of the organization's executive team mean to you, and how would you contribute as Vice Chief Executive Officer?",
    "Describe a time you supported or stepped in for a leader. What did you do, and what did you learn from it?",
  ],
  "Chief Finance Officer": [
    "How would you lead the Finance Department in managing CNCP's financial resources responsibly and transparently?",
    "Describe a time you managed a budget, allocated resources, or handled financial planning. What did you learn from the experience?",
  ],
  "Vice Chief Finance Officer": [
    "How would you support the Chief Finance Officer in managing day-to-day financial operations and departmental coordination?",
    "How would you handle a situation where financial documentation needs to be completed under a tight deadline?",
  ],
  Auditor: [
    "How would you approach independently reviewing financial records to ensure accuracy and compliance with policies?",
    "Describe a time you identified an error or discrepancy in a process. How did you handle it and what was the outcome?",
  ],
};

function formatAnswerValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-";
  if (Array.isArray(value))
    return value.length ? value.map(String).join(", ") : "-";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  try { return JSON.stringify(value); } catch { return "-"; }
}

function formatJsonCell(value: Record<string, unknown> | null): string {
  if (!value) return "-";
  try { return JSON.stringify(value); } catch { return "[Unable to display]"; }
}

function matchesQuery(
  row: { first_name?: string | null; last_name?: string | null; email?: string | null },
  query: string,
): boolean {
  if (!query) return true;
  const needle = query.toLowerCase();
  const first = (row.first_name ?? "").toLowerCase();
  const last = (row.last_name ?? "").toLowerCase();
  const email = (row.email ?? "").toLowerCase();
  return first.includes(needle) || last.includes(needle) || email.includes(needle);
}

function renderTechAnswers(
  track: string | null,
  q1: string | null,
  q2: string | null,
): ReactElement {
  const questions = track ? TECH_QUESTIONS[track] : undefined;
  const labels = questions ?? ["Question 1", "Question 2"];
  const answers = [q1 ?? "-", q2 ?? "-"];
  return (
    <div className="view-all-answers">
      {labels.map((label, i) => (
        <div key={`${i}-${label}`} className="view-all-answer">
          <strong>{i + 1}. {label}</strong>
          <div>{formatAnswerValue(answers[i])}</div>
        </div>
      ))}
    </div>
  );
}

function getAnswer(value: Record<string, unknown>, index: number): unknown {
  const key = `question_${index + 1}`;
  const altKey = `leadershipQuestion${index + 1}`;
  const altKey2 = `leadershipQuestion_${index + 1}`;
  return value[key] ?? value[altKey] ?? value[altKey2] ?? null;
}

function lookupQuestions(role: string | null): string[] | undefined {
  if (!role) return undefined;
  if (OFFICER_QUESTIONS[role]) return OFFICER_QUESTIONS[role];
  if (role.endsWith("s") && OFFICER_QUESTIONS[role.slice(0, -1)]) {
    return OFFICER_QUESTIONS[role.slice(0, -1)];
  }
  for (const key of Object.keys(OFFICER_QUESTIONS)) {
    if (key.toLowerCase() === role.toLowerCase()) return OFFICER_QUESTIONS[key];
    if (key.endsWith("s") && key.slice(0, -1).toLowerCase() === role.toLowerCase()) {
      return OFFICER_QUESTIONS[key];
    }
    if (role.endsWith("s") && key.toLowerCase() === role.slice(0, -1).toLowerCase()) {
      return OFFICER_QUESTIONS[key];
    }
  }
  return undefined;
}

function renderOfficerAnswers(
  value: Record<string, unknown> | null,
  role: string | null,
): ReactElement {
  if (!value || Object.keys(value).length === 0) return <span>-</span>;
  const questions = lookupQuestions(role);
  const keys = Object.keys(value).sort();

  if (questions) {
    return (
      <div className="view-all-answers">
        {questions.map((question, i) => (
          <div key={`${role}-${i}`} className="view-all-answer">
            <strong>{i + 1}. {question}</strong>
            <div>{formatAnswerValue(getAnswer(value, i))}</div>
          </div>
        ))}
      </div>
    );
  }

  if (keys.length > 0) {
    return (
      <div className="view-all-answers">
        {keys.map((k, i) => (
          <div key={k} className="view-all-answer">
            <strong>Question {i + 1}</strong>
            <div>{formatAnswerValue(value[k])}</div>
          </div>
        ))}
      </div>
    );
  }

  return <span>-</span>;
}

export default function ViewAllModal({
  open,
  onClose,
  activeTab: initialTab,
  personalRows,
  technologyCadetRows,
  operationsRows,
  creativesRows,
  marketingRows,
  relationsRows,
  administrativeRows,
  executiveRows,
  financeRows,
}: ViewAllModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalTab, setModalTab] = useState<TabKey>(initialTab);
  const [query, setQuery] = useState("");
  const [techFilter, setTechFilter] = useState<FilterKey>("All");
  const [opsFilter, setOpsFilter] = useState<FilterKey>("All");
  const [creativesFilter, setCreativesFilter] = useState<FilterKey>("All");
  const [marketingFilter, setMarketingFilter] = useState<FilterKey>("All");
  const [relationsFilter, setRelationsFilter] = useState<FilterKey>("All");
  const [adminFilter, setAdminFilter] = useState<FilterKey>("All");
  const [execFilter, setExecFilter] = useState<FilterKey>("All");
  const [financeFilter, setFinanceFilter] = useState<FilterKey>("All");

  useEffect(() => {
    if (open) {
      setModalTab(initialTab);
      setQuery("");
      setTechFilter("All");
      setOpsFilter("All");
      setCreativesFilter("All");
      setMarketingFilter("All");
      setRelationsFilter("All");
      setAdminFilter("All");
      setExecFilter("All");
      setFinanceFilter("All");
    }
  }, [open, initialTab]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const getFilters = (): FilterKey[] => {
    switch (modalTab) {
      case "technology": return TECH_FILTERS;
      case "operations": return OPS_FILTERS;
      case "creatives": return CREATIVES_FILTERS;
      case "marketing": return MARKETING_FILTERS;
      case "relations": return RELATIONS_FILTERS;
      case "administrative": return ADMIN_FILTERS;
      case "executive": return EXEC_FILTERS;
      case "finance": return FINANCE_FILTERS;
      default: return [];
    }
  };

  const getActiveFilter = (): FilterKey => {
    switch (modalTab) {
      case "technology": return techFilter;
      case "operations": return opsFilter;
      case "creatives": return creativesFilter;
      case "marketing": return marketingFilter;
      case "relations": return relationsFilter;
      case "administrative": return adminFilter;
      case "executive": return execFilter;
      case "finance": return financeFilter;
      default: return "All";
    }
  };

  const setActiveFilter = (f: FilterKey) => {
    switch (modalTab) {
      case "technology": setTechFilter(f); break;
      case "operations": setOpsFilter(f); break;
      case "creatives": setCreativesFilter(f); break;
      case "marketing": setMarketingFilter(f); break;
      case "relations": setRelationsFilter(f); break;
      case "administrative": setAdminFilter(f); break;
      case "executive": setExecFilter(f); break;
      case "finance": setFinanceFilter(f); break;
    }
  };

  const filteredPersonalRows = useMemo(
    () => personalRows.filter((r) => matchesQuery(r, query)),
    [personalRows, query],
  );

  const filteredTechRows = useMemo(() => {
    const base = techFilter === "All"
      ? technologyCadetRows
      : technologyCadetRows.filter((r) => r.track === techFilter);
    return base.filter((r) => matchesQuery(r, query));
  }, [technologyCadetRows, techFilter, query]);

  const filteredOpsRows = useMemo(() => {
    const base = opsFilter === "All"
      ? operationsRows
      : operationsRows.filter((r) => r.application_role === opsFilter);
    return base.filter((r) => matchesQuery(r, query));
  }, [operationsRows, opsFilter, query]);

  const filteredCreativesRows = useMemo(() => {
    const base = creativesFilter === "All"
      ? creativesRows
      : creativesRows.filter((r) => r.application_role === creativesFilter);
    return base.filter((r) => matchesQuery(r, query));
  }, [creativesRows, creativesFilter, query]);

  const filteredMarketingRows = useMemo(() => {
    const base = marketingFilter === "All"
      ? marketingRows
      : marketingRows.filter((r) => r.application_role === marketingFilter);
    return base.filter((r) => matchesQuery(r, query));
  }, [marketingRows, marketingFilter, query]);

  const filteredRelationsRows = useMemo(() => {
    const base = relationsFilter === "All"
      ? relationsRows
      : relationsRows.filter((r) => r.application_role === relationsFilter);
    return base.filter((r) => matchesQuery(r, query));
  }, [relationsRows, relationsFilter, query]);

  const filteredAdminRows = useMemo(() => {
    const base = adminFilter === "All"
      ? administrativeRows
      : administrativeRows.filter((r) => r.application_role === adminFilter);
    return base.filter((r) => matchesQuery(r, query));
  }, [administrativeRows, adminFilter, query]);

  const filteredExecRows = useMemo(() => {
    const base = execFilter === "All"
      ? executiveRows
      : executiveRows.filter((r) => r.application_role === execFilter);
    return base.filter((r) => matchesQuery(r, query));
  }, [executiveRows, execFilter, query]);

  const filteredFinanceRows = useMemo(() => {
    const base = financeFilter === "All"
      ? financeRows
      : financeRows.filter((r) => r.application_role === financeFilter);
    return base.filter((r) => matchesQuery(r, query));
  }, [financeRows, financeFilter, query]);

  const activeFilter = getActiveFilter();
  const filters = getFilters();

  const today = new Date().toISOString().slice(0, 10);

  const renderTable = () => {
    if (modalTab === "personal") {
      return (
        <table className="view-all-table">
          <thead>
            <tr>
              <th>First name</th><th>Last name</th><th>Email</th>
              <th>Facebook link</th><th>Facebook shared post</th><th>Discord</th>
              <th>LinkedIn</th><th>PUP webmail</th><th>Phone</th>
              <th>Course/Year/Section</th><th>Certificate</th>
              <th>College campus</th><th>Membership type</th>
            </tr>
          </thead>
          <tbody>
            {filteredPersonalRows.map((row, i) => (
              <tr key={`${row.email ?? "r"}-${i}`}>
                <td>{row.first_name ?? "-"}</td>
                <td>{row.last_name ?? "-"}</td>
                <td>{row.email ?? "-"}</td>
                <td>{row.facebook_link ? <a href={row.facebook_link} target="_blank" rel="noreferrer">View</a> : "-"}</td>
                <td>{row.facebook_shared_post ? <a href={row.facebook_shared_post} target="_blank" rel="noreferrer">View</a> : "-"}</td>
                <td>{row.discord_username ?? "-"}</td>
                <td>{row.linkedin_link ? <a href={row.linkedin_link} target="_blank" rel="noreferrer">View</a> : "-"}</td>
                <td>{row.pup_webmail ?? "-"}</td>
                <td>{row.phone ?? "-"}</td>
                <td>{row.course_year_section ?? "-"}</td>
                <td>{row.certificate_link ? <a href={row.certificate_link} target="_blank" rel="noreferrer">View</a> : "-"}</td>
                <td>{row.college_campus ?? "-"}</td>
                <td>{row.membership_type ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (modalTab === "technology") {
      return (
        <table className="view-all-table">
          <thead>
            <tr>
              <th>First name</th><th>Last name</th><th>Email</th><th>Track</th><th>Question answers</th>
            </tr>
          </thead>
          <tbody>
            {filteredTechRows.map((row, i) => (
              <tr key={`${row.email ?? "r"}-${i}`}>
                <td>{row.first_name ?? "-"}</td>
                <td>{row.last_name ?? "-"}</td>
                <td>{row.email ?? "-"}</td>
                <td>{row.track ?? "-"}</td>
                <td>{renderTechAnswers(row.track, row.question_1, row.question_2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (modalTab === "operations") {
      return (
        <table className="view-all-table">
          <thead>
            <tr>
              <th>First name</th><th>Last name</th><th>Email</th><th>Committee</th><th>Role</th><th>Question answers</th>
            </tr>
          </thead>
          <tbody>
            {filteredOpsRows.map((row, i) => (
              <tr key={`${row.email ?? "r"}-${i}`}>
                <td>{row.first_name ?? "-"}</td>
                <td>{row.last_name ?? "-"}</td>
                <td>{row.email ?? "-"}</td>
                <td>{row.committee ?? "-"}</td>
                <td>{row.application_role ?? "-"}</td>
                <td>{renderOfficerAnswers(row.question_answers, row.application_role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (modalTab === "creatives") {
      return (
        <table className="view-all-table">
          <thead>
            <tr>
              <th>First name</th><th>Last name</th><th>Email</th><th>Team</th><th>Role</th><th>Question answers</th>
            </tr>
          </thead>
          <tbody>
            {filteredCreativesRows.map((row, i) => (
              <tr key={`${row.email ?? "r"}-${i}`}>
                <td>{row.first_name ?? "-"}</td>
                <td>{row.last_name ?? "-"}</td>
                <td>{row.email ?? "-"}</td>
                <td>{row.team ?? "-"}</td>
                <td>{row.application_role ?? "-"}</td>
                <td>{renderOfficerAnswers(row.question_answers, row.application_role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (modalTab === "marketing") {
      return (
        <table className="view-all-table">
          <thead>
            <tr>
              <th>First name</th><th>Last name</th><th>Email</th><th>Team</th><th>Role</th><th>Question answers</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarketingRows.map((row, i) => (
              <tr key={`${row.email ?? "r"}-${i}`}>
                <td>{row.first_name ?? "-"}</td>
                <td>{row.last_name ?? "-"}</td>
                <td>{row.email ?? "-"}</td>
                <td>{row.team ?? "-"}</td>
                <td>{row.application_role ?? "-"}</td>
                <td>{renderOfficerAnswers(row.question_answers, row.application_role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (modalTab === "relations") {
      return (
        <table className="view-all-table">
          <thead>
            <tr>
              <th>First name</th><th>Last name</th><th>Email</th><th>Team</th><th>Role</th><th>Question answers</th>
            </tr>
          </thead>
          <tbody>
            {filteredRelationsRows.map((row, i) => (
              <tr key={`${row.email ?? "r"}-${i}`}>
                <td>{row.first_name ?? "-"}</td>
                <td>{row.last_name ?? "-"}</td>
                <td>{row.email ?? "-"}</td>
                <td>{row.team ?? "-"}</td>
                <td>{row.application_role ?? "-"}</td>
                <td>{renderOfficerAnswers(row.question_answers, row.application_role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (modalTab === "administrative") {
      return (
        <table className="view-all-table">
          <thead>
            <tr>
              <th>First name</th><th>Last name</th><th>Email</th><th>Role</th><th>Question answers</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdminRows.map((row, i) => (
              <tr key={`${row.email ?? "r"}-${i}`}>
                <td>{row.first_name ?? "-"}</td>
                <td>{row.last_name ?? "-"}</td>
                <td>{row.email ?? "-"}</td>
                <td>{row.application_role ?? "-"}</td>
                <td>{renderOfficerAnswers(row.question_answers, row.application_role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (modalTab === "executive") {
      return (
        <table className="view-all-table">
          <thead>
            <tr>
              <th>First name</th><th>Last name</th><th>Email</th><th>Role</th><th>Question answers</th>
            </tr>
          </thead>
          <tbody>
            {filteredExecRows.map((row, i) => (
              <tr key={`${row.email ?? "r"}-${i}`}>
                <td>{row.first_name ?? "-"}</td>
                <td>{row.last_name ?? "-"}</td>
                <td>{row.email ?? "-"}</td>
                <td>{row.application_role ?? "-"}</td>
                <td>{renderOfficerAnswers(row.question_answers, row.application_role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <table className="view-all-table">
        <thead>
          <tr>
            <th>First name</th><th>Last name</th><th>Email</th><th>Role</th><th>Question answers</th>
          </tr>
        </thead>
        <tbody>
          {filteredFinanceRows.map((row, i) => (
            <tr key={`${row.email ?? "r"}-${i}`}>
              <td>{row.first_name ?? "-"}</td>
              <td>{row.last_name ?? "-"}</td>
              <td>{row.email ?? "-"}</td>
              <td>{row.application_role ?? "-"}</td>
              <td>{renderOfficerAnswers(row.question_answers, row.application_role)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const getRowData = (): { rows: unknown[]; columns: CsvColumn<unknown>[] } => {
    const csvColumns: CsvColumn<unknown>[] = [];
    let rows: unknown[] = [];
    if (modalTab === "personal") {
      rows = filteredPersonalRows;
      csvColumns.push(
        { label: "First name", value: (r: unknown) => (r as PersonalRow).first_name },
        { label: "Last name", value: (r: unknown) => (r as PersonalRow).last_name },
        { label: "Email", value: (r: unknown) => (r as PersonalRow).email },
        { label: "Facebook link", value: (r: unknown) => (r as PersonalRow).facebook_link },
        { label: "Facebook shared post", value: (r: unknown) => (r as PersonalRow).facebook_shared_post },
        { label: "Discord", value: (r: unknown) => (r as PersonalRow).discord_username },
        { label: "LinkedIn", value: (r: unknown) => (r as PersonalRow).linkedin_link },
        { label: "PUP webmail", value: (r: unknown) => (r as PersonalRow).pup_webmail },
        { label: "Phone", value: (r: unknown) => (r as PersonalRow).phone },
        { label: "Course/Year/Section", value: (r: unknown) => (r as PersonalRow).course_year_section },
        { label: "Certificate", value: (r: unknown) => (r as PersonalRow).certificate_link },
        { label: "College campus", value: (r: unknown) => (r as PersonalRow).college_campus },
        { label: "Membership type", value: (r: unknown) => (r as PersonalRow).membership_type },
      );
    } else if (modalTab === "technology") {
      rows = filteredTechRows;
      csvColumns.push(
        { label: "First name", value: (r: unknown) => (r as TechnologyCadetRow).first_name },
        { label: "Last name", value: (r: unknown) => (r as TechnologyCadetRow).last_name },
        { label: "Email", value: (r: unknown) => (r as TechnologyCadetRow).email },
        { label: "Track", value: (r: unknown) => (r as TechnologyCadetRow).track },
        { label: "Question 1", value: (r: unknown) => (r as TechnologyCadetRow).question_1 },
        { label: "Question 2", value: (r: unknown) => (r as TechnologyCadetRow).question_2 },
      );
    } else if (modalTab === "operations") {
      rows = filteredOpsRows;
      csvColumns.push(
        { label: "First name", value: (r: unknown) => (r as OperationsRow).first_name },
        { label: "Last name", value: (r: unknown) => (r as OperationsRow).last_name },
        { label: "Email", value: (r: unknown) => (r as OperationsRow).email },
        { label: "Committee", value: (r: unknown) => (r as OperationsRow).committee },
        { label: "Role", value: (r: unknown) => (r as OperationsRow).application_role },
        { label: "Answers", value: (r: unknown) => formatJsonCell((r as OperationsRow).question_answers) },
      );
    } else if (modalTab === "creatives") {
      rows = filteredCreativesRows;
      csvColumns.push(
        { label: "First name", value: (r: unknown) => (r as CreativesRow).first_name },
        { label: "Last name", value: (r: unknown) => (r as CreativesRow).last_name },
        { label: "Email", value: (r: unknown) => (r as CreativesRow).email },
        { label: "Team", value: (r: unknown) => (r as CreativesRow).team },
        { label: "Role", value: (r: unknown) => (r as CreativesRow).application_role },
        { label: "Answers", value: (r: unknown) => formatJsonCell((r as CreativesRow).question_answers) },
      );
    } else if (modalTab === "marketing") {
      rows = filteredMarketingRows;
      csvColumns.push(
        { label: "First name", value: (r: unknown) => (r as MarketingRow).first_name },
        { label: "Last name", value: (r: unknown) => (r as MarketingRow).last_name },
        { label: "Email", value: (r: unknown) => (r as MarketingRow).email },
        { label: "Team", value: (r: unknown) => (r as MarketingRow).team },
        { label: "Role", value: (r: unknown) => (r as MarketingRow).application_role },
        { label: "Answers", value: (r: unknown) => formatJsonCell((r as MarketingRow).question_answers) },
      );
    } else if (modalTab === "relations") {
      rows = filteredRelationsRows;
      csvColumns.push(
        { label: "First name", value: (r: unknown) => (r as RelationsRow).first_name },
        { label: "Last name", value: (r: unknown) => (r as RelationsRow).last_name },
        { label: "Email", value: (r: unknown) => (r as RelationsRow).email },
        { label: "Team", value: (r: unknown) => (r as RelationsRow).team },
        { label: "Role", value: (r: unknown) => (r as RelationsRow).application_role },
        { label: "Answers", value: (r: unknown) => formatJsonCell((r as RelationsRow).question_answers) },
      );
    } else if (modalTab === "administrative") {
      rows = filteredAdminRows;
      csvColumns.push(
        { label: "First name", value: (r: unknown) => (r as AdministrativeRow).first_name },
        { label: "Last name", value: (r: unknown) => (r as AdministrativeRow).last_name },
        { label: "Email", value: (r: unknown) => (r as AdministrativeRow).email },
        { label: "Role", value: (r: unknown) => (r as AdministrativeRow).application_role },
        { label: "Answers", value: (r: unknown) => formatJsonCell((r as AdministrativeRow).question_answers) },
      );
    } else if (modalTab === "executive") {
      rows = filteredExecRows;
      csvColumns.push(
        { label: "First name", value: (r: unknown) => (r as ExecutiveRow).first_name },
        { label: "Last name", value: (r: unknown) => (r as ExecutiveRow).last_name },
        { label: "Email", value: (r: unknown) => (r as ExecutiveRow).email },
        { label: "Role", value: (r: unknown) => (r as ExecutiveRow).application_role },
        { label: "Answers", value: (r: unknown) => formatJsonCell((r as ExecutiveRow).question_answers) },
      );
    } else {
      rows = filteredFinanceRows;
      csvColumns.push(
        { label: "First name", value: (r: unknown) => (r as FinanceRow).first_name },
        { label: "Last name", value: (r: unknown) => (r as FinanceRow).last_name },
        { label: "Email", value: (r: unknown) => (r as FinanceRow).email },
        { label: "Role", value: (r: unknown) => (r as FinanceRow).application_role },
        { label: "Answers", value: (r: unknown) => formatJsonCell((r as FinanceRow).question_answers) },
      );
    }
    return { rows, columns: csvColumns };
  };

  const { rows: csvRows, columns: csvColumns } = getRowData();
  const rowCount = csvRows.length;

  return (
    <dialog ref={dialogRef} className="view-all-dialog">
      <div className="view-all-header">
        <div className="view-all-header-left">
          <h2>View All Applicants</h2>
          <span>{rowCount} rows</span>
        </div>
        <div className="view-all-header-actions">
          <CsvDownloadButton
            rows={csvRows}
            columns={csvColumns}
            fileName={`${modalTab}-${today}.csv`}
          />
          <button type="button" className="view-all-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="view-all-toolbar">
        <div className="view-all-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`view-all-tab ${modalTab === tab.key ? "is-active" : ""}`}
              onClick={() => { setModalTab(tab.key); setQuery(""); }}
              role="tab"
              aria-selected={modalTab === tab.key}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filters.length > 0 && (
          <div className="view-all-filters">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                className={`view-all-filter ${activeFilter === f ? "is-active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        <div className="view-all-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="view-all-body">
        {rowCount === 0 ? (
          <p className="view-all-empty">No submissions match your search.</p>
        ) : (
          renderTable()
        )}
      </div>
    </dialog>
  );
}
