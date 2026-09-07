"use client";

import { type ReactElement, useMemo, useState } from "react";
import CsvDownloadButton, { type CsvColumn } from "./csv-download";
import ViewAllModal from "./view-all-modal";

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

type TableTabsProps = {
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
type TechFilterKey =
  | "All"
  | "Enterprise Networking"
  | "Cybersecurity Operations"
  | "Developer Network";
type OpsFilterKey =
  | "All"
  | "Program Manager"
  | "Host"
  | "Technical Coordinator"
  | "Logistics and Resource Coordinator"
  | "Registration and Access Coordinator"
  | "Media Documentation Officer";
type CreativesFilterKey =
  | "All"
  | "Video Editor"
  | "Animator"
  | "Photographer/Videographer"
  | "Graphic Designer"
  | "Illustrator";
type MarketingFilterKey =
  | "All"
  | "Chief Marketing Officer"
  | "Vice Chief Marketing Officer"
  | "Caption Writer and Engagement Analyst"
  | "Content Strategist and Video Director";
type RelationsFilterKey =
  | "All"
  | "Community Partnership Lead"
  | "Community Partnership Co-Lead"
  | "Sponsors Lead"
  | "Sponsors Co-Lead"
  | "Engagement Lead"
  | "Engagement Co-Lead"
  | "Membership Lead"
  | "Membership Co-Lead"
  | "Community Member";
type AdministrativeFilterKey =
  | "All"
  | "Secretariat Officer"
  | "Membership Officer"
  | "Institutional Affairs Officer"
  | "Internal Operations Officer"
  | "Administrative Systems Officer"
  | "Events & Records Officer";
type ExecutiveFilterKey =
  | "All"
  | "Vice Chief Executive Officer";
type FinanceFilterKey =
  | "All"
  | "Chief Finance Officer"
  | "Vice Chief Finance Officer"
  | "Auditor";

const PAGE_SIZE = 10;

const TECHNOLOGY_FILTERS: TechFilterKey[] = [
  "All",
  "Enterprise Networking",
  "Cybersecurity Operations",
  "Developer Network",
];
const OPERATIONS_FILTERS: OpsFilterKey[] = [
  "All",
  "Program Manager",
  "Host",
  "Technical Coordinator",
  "Logistics and Resource Coordinator",
  "Registration and Access Coordinator",
  "Media Documentation Officer",
];
const CREATIVES_FILTERS: CreativesFilterKey[] = [
  "All",
  "Video Editor",
  "Animator",
  "Photographer/Videographer",
  "Graphic Designer",
  "Illustrator",
];
const MARKETING_FILTERS: MarketingFilterKey[] = [
  "All",
  "Chief Marketing Officer",
  "Vice Chief Marketing Officer",
  "Caption Writer and Engagement Analyst",
  "Content Strategist and Video Director",
];
const RELATIONS_FILTERS: RelationsFilterKey[] = [
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
const ADMINISTRATIVE_FILTERS: AdministrativeFilterKey[] = [
  "All",
  "Secretariat Officer",
  "Membership Officer",
  "Institutional Affairs Officer",
  "Internal Operations Officer",
  "Administrative Systems Officer",
  "Events & Records Officer",
];
const EXECUTIVE_FILTERS: ExecutiveFilterKey[] = [
  "All",
  "Vice Chief Executive Officer",
];
const FINANCE_FILTERS: FinanceFilterKey[] = [
  "All",
  "Chief Finance Officer",
  "Vice Chief Finance Officer",
  "Auditor",
];

function paginateRows<T>(rows: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE;
  return rows.slice(start, start + PAGE_SIZE);
}

function formatCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function formatJsonCell(value: Record<string, unknown> | null): string {
  if (!value) {
    return "-";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return "[Unable to display]";
  }
}

function formatAnswerValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (Array.isArray(value)) {
    return value.length ? value.map(String).join(", ") : "-";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return "-";
  }
}

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

function renderTechAnswers(
  track: string | null,
  question1: string | null,
  question2: string | null,
): ReactElement {
  const questions = track ? TECH_QUESTIONS[track] : undefined;
  const questionLabels = questions ?? ["Question 1", "Question 2"];
  const answers = [question1 ?? "-", question2 ?? "-"];

  return (
    <div className="dashboard-answers">
      {questionLabels.map((question, index) => (
        <div key={`${index}-${question}`} className="dashboard-answer">
          <strong>
            {index + 1}. {question}
          </strong>
          <div>{formatAnswerValue(answers[index])}</div>
        </div>
      ))}
    </div>
  );
}

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

function renderOfficerAnswers(
  value: Record<string, unknown> | null,
  role: string | null,
): ReactElement {
  if (!value || Object.keys(value).length === 0) {
    return <span>-</span>;
  }

  const questions = role ? OFFICER_QUESTIONS[role] : undefined;
  if (!questions) {
    const keys = Object.keys(value).sort();
    return (
      <div className="dashboard-answers">
        {keys.map((key) => (
          <div key={key} className="dashboard-answer">
            <strong>{key}</strong>
            <div>{formatAnswerValue(value[key])}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-answers">
      {questions.map((question, index) => (
        <div key={`${role}-${index}`} className="dashboard-answer">
          <strong>
            {index + 1}. {question}
          </strong>
          <div>
            {formatAnswerValue(value[`question_${index + 1}`])}
          </div>
        </div>
      ))}
    </div>
  );
}

function toFileSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function matchesQuery(
  row: { first_name?: string | null; last_name?: string | null; email?: string | null },
  query: string,
): boolean {
  if (!query) {
    return true;
  }

  const needle = query.toLowerCase();
  const first = (row.first_name ?? "").toLowerCase();
  const last = (row.last_name ?? "").toLowerCase();
  const email = (row.email ?? "").toLowerCase();
  return (
    first.includes(needle) || last.includes(needle) || email.includes(needle)
  );
}

export default function TableTabs({
  personalRows,
  technologyCadetRows,
  operationsRows,
  creativesRows,
  marketingRows,
  relationsRows,
  administrativeRows,
  executiveRows,
  financeRows,
}: TableTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [techFilter, setTechFilter] = useState<TechFilterKey>("All");
  const [opsFilter, setOpsFilter] = useState<OpsFilterKey>("All");
  const [creativesFilter, setCreativesFilter] =
    useState<CreativesFilterKey>("All");
  const [marketingFilter, setMarketingFilter] =
    useState<MarketingFilterKey>("All");
  const [relationsFilter, setRelationsFilter] =
    useState<RelationsFilterKey>("All");
  const [adminFilter, setAdminFilter] = useState<AdministrativeFilterKey>("All");
  const [execFilter, setExecFilter] = useState<ExecutiveFilterKey>("All");
  const [financeFilter, setFinanceFilter] = useState<FinanceFilterKey>("All");
  const [viewAllOpen, setViewAllOpen] = useState(false);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
  };
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const handleTechFilterChange = (filter: TechFilterKey) => {
    setTechFilter(filter);
    setPage(1);
  };
  const handleOpsFilterChange = (filter: OpsFilterKey) => {
    setOpsFilter(filter);
    setPage(1);
  };
  const handleCreativesFilterChange = (filter: CreativesFilterKey) => {
    setCreativesFilter(filter);
    setPage(1);
  };
  const handleMarketingFilterChange = (filter: MarketingFilterKey) => {
    setMarketingFilter(filter);
    setPage(1);
  };
  const handleRelationsFilterChange = (filter: RelationsFilterKey) => {
    setRelationsFilter(filter);
    setPage(1);
  };
  const handleAdminFilterChange = (filter: AdministrativeFilterKey) => {
    setAdminFilter(filter);
    setPage(1);
  };
  const handleExecFilterChange = (filter: ExecutiveFilterKey) => {
    setExecFilter(filter);
    setPage(1);
  };
  const handleFinanceFilterChange = (filter: FinanceFilterKey) => {
    setFinanceFilter(filter);
    setPage(1);
  };

  const filteredPersonalRows = useMemo(() => {
    return personalRows.filter((row) => matchesQuery(row, query));
  }, [personalRows, query]);
  const filteredTechCadetRows = useMemo(() => {
    if (techFilter === "All") {
      return technologyCadetRows.filter((row) => matchesQuery(row, query));
    }

    return technologyCadetRows.filter(
      (row) =>
        row.track === techFilter && matchesQuery(row, query),
    );
  }, [technologyCadetRows, techFilter, query]);
  const filteredOperationsRows = useMemo(() => {
    if (opsFilter === "All") {
      return operationsRows.filter((row) => matchesQuery(row, query));
    }

    return operationsRows.filter(
      (row) =>
        row.application_role === opsFilter && matchesQuery(row, query),
    );
  }, [operationsRows, opsFilter, query]);
  const filteredCreativesRows = useMemo(() => {
    if (creativesFilter === "All") {
      return creativesRows.filter((row) => matchesQuery(row, query));
    }

    return creativesRows.filter(
      (row) =>
        row.application_role === creativesFilter && matchesQuery(row, query),
    );
  }, [creativesFilter, creativesRows, query]);
  const filteredMarketingRows = useMemo(() => {
    if (marketingFilter === "All") {
      return marketingRows.filter((row) => matchesQuery(row, query));
    }

    return marketingRows.filter(
      (row) =>
        row.application_role === marketingFilter && matchesQuery(row, query),
    );
  }, [marketingFilter, marketingRows, query]);
  const filteredRelationsRows = useMemo(() => {
    if (relationsFilter === "All") {
      return relationsRows.filter((row) => matchesQuery(row, query));
    }

    return relationsRows.filter(
      (row) =>
        row.application_role === relationsFilter && matchesQuery(row, query),
    );
  }, [relationsFilter, relationsRows, query]);
  const filteredAdministrativeRows = useMemo(() => {
    if (adminFilter === "All") {
      return administrativeRows.filter((row) => matchesQuery(row, query));
    }

    return administrativeRows.filter(
      (row) =>
        row.application_role === adminFilter && matchesQuery(row, query),
    );
  }, [adminFilter, administrativeRows, query]);
  const filteredExecutiveRows = useMemo(() => {
    if (execFilter === "All") {
      return executiveRows.filter((row) => matchesQuery(row, query));
    }

    return executiveRows.filter(
      (row) =>
        row.application_role === execFilter && matchesQuery(row, query),
    );
  }, [execFilter, executiveRows, query]);
  const filteredFinanceRows = useMemo(() => {
    if (financeFilter === "All") {
      return financeRows.filter((row) => matchesQuery(row, query));
    }

    return financeRows.filter(
      (row) =>
        row.application_role === financeFilter && matchesQuery(row, query),
    );
  }, [financeFilter, financeRows, query]);
  const activeRows = useMemo(() => {
    if (activeTab === "personal") {
      return filteredPersonalRows;
    }
    if (activeTab === "technology") {
      return filteredTechCadetRows;
    }
    if (activeTab === "operations") {
      return filteredOperationsRows;
    }
    if (activeTab === "creatives") {
      return filteredCreativesRows;
    }
    if (activeTab === "marketing") {
      return filteredMarketingRows;
    }
    if (activeTab === "relations") {
      return filteredRelationsRows;
    }
    if (activeTab === "executive") {
      return filteredExecutiveRows;
    }
    if (activeTab === "finance") {
      return filteredFinanceRows;
    }
    return filteredAdministrativeRows;
  }, [
    activeTab,
    filteredPersonalRows,
    filteredTechCadetRows,
    filteredOperationsRows,
    filteredCreativesRows,
    filteredMarketingRows,
    filteredRelationsRows,
    filteredAdministrativeRows,
    filteredExecutiveRows,
    filteredFinanceRows,
  ]);
  const totalPages = Math.max(1, Math.ceil(activeRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedPersonalRows = useMemo(() => {
    return paginateRows(filteredPersonalRows, safePage);
  }, [filteredPersonalRows, safePage]);
  const pagedTechCadetRows = useMemo(() => {
    return paginateRows(filteredTechCadetRows, safePage);
  }, [filteredTechCadetRows, safePage]);
  const pagedOperationsRows = useMemo(() => {
    return paginateRows(filteredOperationsRows, safePage);
  }, [filteredOperationsRows, safePage]);
  const pagedCreativesRows = useMemo(() => {
    return paginateRows(filteredCreativesRows, safePage);
  }, [filteredCreativesRows, safePage]);
  const pagedMarketingRows = useMemo(() => {
    return paginateRows(filteredMarketingRows, safePage);
  }, [filteredMarketingRows, safePage]);
  const pagedRelationsRows = useMemo(() => {
    return paginateRows(filteredRelationsRows, safePage);
  }, [filteredRelationsRows, safePage]);
  const pagedAdministrativeRows = useMemo(() => {
    return paginateRows(filteredAdministrativeRows, safePage);
  }, [filteredAdministrativeRows, safePage]);
  const pagedExecutiveRows = useMemo(() => {
    return paginateRows(filteredExecutiveRows, safePage);
  }, [filteredExecutiveRows, safePage]);
  const pagedFinanceRows = useMemo(() => {
    return paginateRows(filteredFinanceRows, safePage);
  }, [filteredFinanceRows, safePage]);
  const rowCount = useMemo(() => {
    return activeTab === "personal"
      ? filteredPersonalRows.length
      : activeTab === "technology"
        ? filteredTechCadetRows.length
        : activeTab === "operations"
          ? filteredOperationsRows.length
          : activeTab === "creatives"
            ? filteredCreativesRows.length
            : activeTab === "marketing"
              ? filteredMarketingRows.length
              : activeTab === "relations"
                ? filteredRelationsRows.length
                : activeTab === "executive"
                  ? filteredExecutiveRows.length
                  : activeTab === "finance"
                    ? filteredFinanceRows.length
                    : filteredAdministrativeRows.length;
  }, [
    activeTab,
    filteredPersonalRows.length,
    filteredTechCadetRows.length,
    filteredOperationsRows.length,
    filteredCreativesRows.length,
    filteredMarketingRows.length,
    filteredRelationsRows.length,
    filteredAdministrativeRows.length,
    filteredExecutiveRows.length,
    filteredFinanceRows.length,
  ]);

  const dateStamp = useMemo(() => {
    return new Date().toISOString().slice(0, 10);
  }, []);

  const renderCsvButton = () => {
    if (activeTab === "personal") {
      const columns: CsvColumn<PersonalRow>[] = [
        { label: "First name", value: (row) => row.first_name },
        { label: "Last name", value: (row) => row.last_name },
        { label: "Email", value: (row) => row.email },
        { label: "Facebook link", value: (row) => row.facebook_link },
        { label: "Facebook shared post", value: (row) => row.facebook_shared_post },
        { label: "Discord username", value: (row) => row.discord_username },
        { label: "LinkedIn link", value: (row) => row.linkedin_link },
        { label: "PUP webmail", value: (row) => row.pup_webmail },
        { label: "Phone", value: (row) => row.phone },
        { label: "Course/Year/Section", value: (row) => row.course_year_section },
        { label: "Certificate link", value: (row) => row.certificate_link },
        { label: "College campus", value: (row) => row.college_campus },
        { label: "Membership type", value: (row) => row.membership_type },
      ];

      return (
        <CsvDownloadButton
          rows={filteredPersonalRows}
          columns={columns}
          fileName={`personal-info-${dateStamp}.csv`}
        />
      );
    }

    if (activeTab === "technology") {
      const filterSuffix =
        techFilter === "All" ? "" : `-${toFileSlug(techFilter)}`;
      const columns: CsvColumn<TechnologyCadetRow>[] = [
        { label: "First name", value: (row) => row.first_name },
        { label: "Last name", value: (row) => row.last_name },
        { label: "Email", value: (row) => row.email },
        { label: "Track", value: (row) => row.track },
        { label: "Question 1 answer", value: (row) => row.question_1 },
        { label: "Question 2 answer", value: (row) => row.question_2 },
      ];

      return (
        <CsvDownloadButton
          rows={filteredTechCadetRows}
          columns={columns}
          fileName={`technology-cadet${filterSuffix}-${dateStamp}.csv`}
        />
      );
    }

    if (activeTab === "operations") {
      const filterSuffix =
        opsFilter === "All" ? "" : `-${toFileSlug(opsFilter)}`;
      const columns: CsvColumn<OperationsRow>[] = [
        { label: "First name", value: (row) => row.first_name },
        { label: "Last name", value: (row) => row.last_name },
        { label: "Email", value: (row) => row.email },
        { label: "Committee", value: (row) => row.committee },
        { label: "Application role", value: (row) => row.application_role },
        { label: "Question answers", value: (row) => formatCsvValue(row.question_answers) },
      ];

      return (
        <CsvDownloadButton
          rows={filteredOperationsRows}
          columns={columns}
          fileName={`operations${filterSuffix}-${dateStamp}.csv`}
        />
      );
    }

    if (activeTab === "creatives") {
      const filterSuffix =
        creativesFilter === "All" ? "" : `-${toFileSlug(creativesFilter)}`;
      const columns: CsvColumn<CreativesRow>[] = [
        { label: "First name", value: (row) => row.first_name },
        { label: "Last name", value: (row) => row.last_name },
        { label: "Email", value: (row) => row.email },
        { label: "Team", value: (row) => row.team },
        { label: "Application role", value: (row) => row.application_role },
        { label: "Question answers", value: (row) => formatCsvValue(row.question_answers) },
      ];

      return (
        <CsvDownloadButton
          rows={filteredCreativesRows}
          columns={columns}
          fileName={`creatives${filterSuffix}-${dateStamp}.csv`}
        />
      );
    }

    if (activeTab === "marketing") {
      const filterSuffix =
        marketingFilter === "All" ? "" : `-${toFileSlug(marketingFilter)}`;
      const columns: CsvColumn<MarketingRow>[] = [
        { label: "First name", value: (row) => row.first_name },
        { label: "Last name", value: (row) => row.last_name },
        { label: "Email", value: (row) => row.email },
        { label: "Team", value: (row) => row.team },
        { label: "Application role", value: (row) => row.application_role },
        { label: "Question answers", value: (row) => formatCsvValue(row.question_answers) },
      ];

      return (
        <CsvDownloadButton
          rows={filteredMarketingRows}
          columns={columns}
          fileName={`marketing${filterSuffix}-${dateStamp}.csv`}
        />
      );
    }

    if (activeTab === "relations") {
      const filterSuffix =
        relationsFilter === "All" ? "" : `-${toFileSlug(relationsFilter)}`;
      const columns: CsvColumn<RelationsRow>[] = [
        { label: "First name", value: (row) => row.first_name },
        { label: "Last name", value: (row) => row.last_name },
        { label: "Email", value: (row) => row.email },
        { label: "Team", value: (row) => row.team },
        { label: "Application role", value: (row) => row.application_role },
        { label: "Question answers", value: (row) => formatCsvValue(row.question_answers) },
      ];

      return (
        <CsvDownloadButton
          rows={filteredRelationsRows}
          columns={columns}
          fileName={`relations${filterSuffix}-${dateStamp}.csv`}
        />
      );
    }

    if (activeTab === "executive") {
      const columns: CsvColumn<ExecutiveRow>[] = [
        { label: "First name", value: (row) => row.first_name },
        { label: "Last name", value: (row) => row.last_name },
        { label: "Email", value: (row) => row.email },
        { label: "Application role", value: (row) => row.application_role },
        { label: "Question answers", value: (row) => formatCsvValue(row.question_answers) },
      ];

      return (
        <CsvDownloadButton
          rows={filteredExecutiveRows}
          columns={columns}
          fileName={`executive-${dateStamp}.csv`}
        />
      );
    }

    if (activeTab === "finance") {
      const filterSuffix =
        financeFilter === "All" ? "" : `-${toFileSlug(financeFilter)}`;
      const columns: CsvColumn<FinanceRow>[] = [
        { label: "First name", value: (row) => row.first_name },
        { label: "Last name", value: (row) => row.last_name },
        { label: "Email", value: (row) => row.email },
        { label: "Application role", value: (row) => row.application_role },
        { label: "Question answers", value: (row) => formatCsvValue(row.question_answers) },
      ];

      return (
        <CsvDownloadButton
          rows={filteredFinanceRows}
          columns={columns}
          fileName={`finance${filterSuffix}-${dateStamp}.csv`}
        />
      );
    }

    const columns: CsvColumn<AdministrativeRow>[] = [
      { label: "First name", value: (row) => row.first_name },
      { label: "Last name", value: (row) => row.last_name },
      { label: "Email", value: (row) => row.email },
      { label: "Application role", value: (row) => row.application_role },
      { label: "Question answers", value: (row) => formatCsvValue(row.question_answers) },
    ];

    return (
      <CsvDownloadButton
        rows={filteredAdministrativeRows}
        columns={columns}
        fileName={`administrative-${dateStamp}.csv`}
      />
    );
  };

  return (
    <>
    <div className="dashboard-tabs">
      <div className="dashboard-tabs-header">
        <div className="dashboard-tabs-controls" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "personal"}
            className={`dashboard-tab ${
              activeTab === "personal" ? "is-active" : ""
            }`}
            onClick={() => handleTabChange("personal")}
          >
            Personal Info
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "technology"}
            className={`dashboard-tab ${
              activeTab === "technology" ? "is-active" : ""
            }`}
            onClick={() => handleTabChange("technology")}
          >
            Technology Department
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "operations"}
            className={`dashboard-tab ${
              activeTab === "operations" ? "is-active" : ""
            }`}
            onClick={() => handleTabChange("operations")}
          >
            Operations Department
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "creatives"}
            className={`dashboard-tab ${
              activeTab === "creatives" ? "is-active" : ""
            }`}
            onClick={() => handleTabChange("creatives")}
          >
            Creatives Department
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "marketing"}
            className={`dashboard-tab ${
              activeTab === "marketing" ? "is-active" : ""
            }`}
            onClick={() => handleTabChange("marketing")}
          >
            Marketing Department
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "relations"}
            className={`dashboard-tab ${
              activeTab === "relations" ? "is-active" : ""
            }`}
            onClick={() => handleTabChange("relations")}
          >
            Relations Department
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "administrative"}
            className={`dashboard-tab ${
              activeTab === "administrative" ? "is-active" : ""
            }`}
            onClick={() => handleTabChange("administrative")}
          >
            Administrative Department
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "executive"}
            className={`dashboard-tab ${
              activeTab === "executive" ? "is-active" : ""
            }`}
            onClick={() => handleTabChange("executive")}
          >
            Executive Department
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "finance"}
            className={`dashboard-tab ${
              activeTab === "finance" ? "is-active" : ""
            }`}
            onClick={() => handleTabChange("finance")}
          >
            Finance Department
          </button>
        </div>
        <div className="dashboard-tab-meta">
          <span className="dashboard-tab-count">{rowCount} rows</span>
          <button
            type="button"
            className="dashboard-button"
            onClick={() => setViewAllOpen(true)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
            View All
          </button>
          {renderCsvButton()}
          <label className="dashboard-search">
            <span className="dashboard-search-icon" aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder="Search name or email"
            />
          </label>
        </div>
      </div>

      {activeTab === "personal" ? (
        <div className="dashboard-table-wrap" role="tabpanel">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Course/Year/Section</th>
                <th>College campus</th>
                <th>Membership</th>
              </tr>
            </thead>
            <tbody>
              {pagedPersonalRows.map((row, index) => (
                <tr key={`${row.email ?? "row"}-${index}`}>
                  <td>{row.first_name ?? "-"}</td>
                  <td>{row.last_name ?? "-"}</td>
                  <td>{row.email ?? "-"}</td>
                  <td>{row.phone ?? "-"}</td>
                  <td>{row.course_year_section ?? "-"}</td>
                  <td>{row.college_campus ?? "-"}</td>
                  <td>{row.membership_type ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="dashboard-pagination">
            <span>
              Showing{" "}
              {activeRows.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, activeRows.length)} of{" "}
              {activeRows.length}
            </span>
            <div className="dashboard-pagination-actions">
              <button
                type="button"
                className="dashboard-page-button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage === 1}
              >
                Prev
              </button>
              <span>
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                className="dashboard-page-button"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={safePage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === "technology" ? (
        <div className="dashboard-tech" role="tabpanel">
          <div className="dashboard-filter-bar" role="toolbar">
            {TECHNOLOGY_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`dashboard-filter ${
                  techFilter === filter ? "is-active" : ""
                }`}
                onClick={() => handleTechFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredTechCadetRows.length === 0 ? (
            <p className="dashboard-empty" role="status">
              No submissions for this filter.
            </p>
          ) : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Track</th>
                    <th>Question answers</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedTechCadetRows.map((row, index) => (
                    <tr key={`${row.email ?? "row"}-${index}`}>
                      <td>{row.first_name ?? "-"}</td>
                      <td>{row.last_name ?? "-"}</td>
                      <td>{row.email ?? "-"}</td>
                      <td>{row.track ?? "-"}</td>
                      <td>
                        {renderTechAnswers(
                          row.track,
                          row.question_1,
                          row.question_2,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="dashboard-pagination">
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {safePage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "operations" ? (
        <div className="dashboard-tech" role="tabpanel">
          <div className="dashboard-filter-bar" role="toolbar">
            {OPERATIONS_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`dashboard-filter ${
                  opsFilter === filter ? "is-active" : ""
                }`}
                onClick={() => handleOpsFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredOperationsRows.length === 0 ? (
            <p className="dashboard-empty" role="status">
              No submissions for this filter.
            </p>
          ) : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Committee</th>
                    <th>Application role</th>
                    <th>Question answers</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedOperationsRows.map((row, index) => (
                    <tr key={`${row.email ?? "row"}-${index}`}>
                      <td>{row.first_name ?? "-"}</td>
                      <td>{row.last_name ?? "-"}</td>
                      <td>{row.email ?? "-"}</td>
                      <td>{row.committee ?? "-"}</td>
                      <td>{row.application_role ?? "-"}</td>
                      <td>
                        {renderOfficerAnswers(
                          row.question_answers,
                          row.application_role,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="dashboard-pagination">
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {safePage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "creatives" ? (
        <div className="dashboard-tech" role="tabpanel">
          <div className="dashboard-filter-bar" role="toolbar">
            {CREATIVES_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`dashboard-filter ${
                  creativesFilter === filter ? "is-active" : ""
                }`}
                onClick={() => handleCreativesFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredCreativesRows.length === 0 ? (
            <p className="dashboard-empty" role="status">
              No submissions for this filter.
            </p>
          ) : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Team</th>
                    <th>Application role</th>
                    <th>Question answers</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedCreativesRows.map((row, index) => (
                    <tr key={`${row.email ?? "row"}-${index}`}>
                      <td>{row.first_name ?? "-"}</td>
                      <td>{row.last_name ?? "-"}</td>
                      <td>{row.email ?? "-"}</td>
                      <td>{row.team ?? "-"}</td>
                      <td>{row.application_role ?? "-"}</td>
                      <td>
                        {renderOfficerAnswers(
                          row.question_answers,
                          row.application_role,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="dashboard-pagination">
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {safePage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "marketing" ? (
        <div className="dashboard-tech" role="tabpanel">
          <div className="dashboard-filter-bar" role="toolbar">
            {MARKETING_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`dashboard-filter ${
                  marketingFilter === filter ? "is-active" : ""
                }`}
                onClick={() => handleMarketingFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredMarketingRows.length === 0 ? (
            <p className="dashboard-empty" role="status">
              No submissions for this filter.
            </p>
          ) : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Team</th>
                    <th>Application role</th>
                    <th>Question answers</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedMarketingRows.map((row, index) => (
                    <tr key={`${row.email ?? "row"}-${index}`}>
                      <td>{row.first_name ?? "-"}</td>
                      <td>{row.last_name ?? "-"}</td>
                      <td>{row.email ?? "-"}</td>
                      <td>{row.team ?? "-"}</td>
                      <td>{row.application_role ?? "-"}</td>
                      <td>
                        {renderOfficerAnswers(
                          row.question_answers,
                          row.application_role,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="dashboard-pagination">
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {safePage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "relations" ? (
        <div className="dashboard-tech" role="tabpanel">
          <div className="dashboard-filter-bar" role="toolbar">
            {RELATIONS_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`dashboard-filter ${
                  relationsFilter === filter ? "is-active" : ""
                }`}
                onClick={() => handleRelationsFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredRelationsRows.length === 0 ? (
            <p className="dashboard-empty" role="status">
              No submissions for this filter.
            </p>
          ) : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Team</th>
                    <th>Application role</th>
                    <th>Question answers</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRelationsRows.map((row, index) => (
                    <tr key={`${row.email ?? "row"}-${index}`}>
                      <td>{row.first_name ?? "-"}</td>
                      <td>{row.last_name ?? "-"}</td>
                      <td>{row.email ?? "-"}</td>
                      <td>{row.team ?? "-"}</td>
                      <td>{row.application_role ?? "-"}</td>
                      <td>
                        {renderOfficerAnswers(
                          row.question_answers,
                          row.application_role,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="dashboard-pagination">
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {safePage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "executive" ? (
        <div className="dashboard-tech" role="tabpanel">
          <div className="dashboard-filter-bar" role="toolbar">
            {EXECUTIVE_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`dashboard-filter ${
                  execFilter === filter ? "is-active" : ""
                }`}
                onClick={() => handleExecFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredExecutiveRows.length === 0 ? (
            <p className="dashboard-empty" role="status">
              No submissions yet.
            </p>
          ) : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Application role</th>
                    <th>Question answers</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedExecutiveRows.map((row, index) => (
                    <tr key={`${row.email ?? "row"}-${index}`}>
                      <td>{row.first_name ?? "-"}</td>
                      <td>{row.last_name ?? "-"}</td>
                      <td>{row.email ?? "-"}</td>
                      <td>{row.application_role ?? "-"}</td>
                      <td>
                        {renderOfficerAnswers(
                          row.question_answers,
                          row.application_role,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="dashboard-pagination">
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {safePage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "finance" ? (
        <div className="dashboard-tech" role="tabpanel">
          <div className="dashboard-filter-bar" role="toolbar">
            {FINANCE_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`dashboard-filter ${
                  financeFilter === filter ? "is-active" : ""
                }`}
                onClick={() => handleFinanceFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredFinanceRows.length === 0 ? (
            <p className="dashboard-empty" role="status">
              No submissions yet.
            </p>
          ) : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Application role</th>
                    <th>Question answers</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedFinanceRows.map((row, index) => (
                    <tr key={`${row.email ?? "row"}-${index}`}>
                      <td>{row.first_name ?? "-"}</td>
                      <td>{row.last_name ?? "-"}</td>
                      <td>{row.email ?? "-"}</td>
                      <td>{row.application_role ?? "-"}</td>
                      <td>
                        {renderOfficerAnswers(
                          row.question_answers,
                          row.application_role,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="dashboard-pagination">
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {safePage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="dashboard-tech" role="tabpanel">
          <div className="dashboard-filter-bar" role="toolbar">
            {ADMINISTRATIVE_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`dashboard-filter ${
                  adminFilter === filter ? "is-active" : ""
                }`}
                onClick={() => handleAdminFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredAdministrativeRows.length === 0 ? (
            <p className="dashboard-empty" role="status">
              No submissions yet.
            </p>
          ) : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Application role</th>
                    <th>Question answers</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedAdministrativeRows.map((row, index) => (
                    <tr key={`${row.email ?? "row"}-${index}`}>
                      <td>{row.first_name ?? "-"}</td>
                      <td>{row.last_name ?? "-"}</td>
                      <td>{row.email ?? "-"}</td>
                      <td>{row.application_role ?? "-"}</td>
                      <td>
                        {renderOfficerAnswers(
                          row.question_answers,
                          row.application_role,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="dashboard-pagination">
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {safePage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="dashboard-page-button"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    <ViewAllModal
      open={viewAllOpen}
      onClose={() => setViewAllOpen(false)}
      activeTab={activeTab}
      personalRows={personalRows}
      technologyCadetRows={technologyCadetRows}
      operationsRows={operationsRows}
      creativesRows={creativesRows}
      marketingRows={marketingRows}
      relationsRows={relationsRows}
      administrativeRows={administrativeRows}
      executiveRows={executiveRows}
      financeRows={financeRows}
    />
    </>
  );
}
