export const profile = {
  name: "Aayan Amir",
  handle: "aayan-amir",
  role: "Software Developer",
  location: "Karachi, Pakistan",
  email: "aayanwork1@gmail.com",
  domain: "aayanamir.tech",
  github: "https://github.com/aayan-amir",
  headline:
    "BS Computer Science student and software developer building inventory, POS, ERP, and database-backed business systems.",
  summary:
    "Hands-on full-stack developer focused on translating real business workflows into practical software for stock tracking, sales, purchases, reporting, user roles, dashboards, and database-backed operations.",
};

export const projects = [
  {
    id: "mobileworld",
    number: "01",
    title: "Mobile World",
    type: "Commerce System",
    repo: "https://github.com/aayan-amir/mobileworld",
    stack: ["React", "Vite", "Express", "Postgres", "Cloudinary"],
    color: "#19d7ff",
    secondary: "#7c5cff",
    aura: "#f8d84a",
    text: "Full-stack e-commerce app for a Karachi phone retailer, with published inventory, bank-transfer checkout, screenshot uploads, admin order handling, and production-ready storage options.",
    playSummary: "A phone shop e-commerce system with inventory, checkout, uploads, and admin order control.",
    stats: ["JWT admin auth", "Google customer login", "PTA/FU order rules"],
    metrics: ["Commerce", "Payments", "Admin"],
  },
  {
    id: "imei-stock",
    number: "02",
    title: "IMEI Stock App",
    type: "Stock-ly / POS Platform",
    repo: "https://github.com/aayan-amir/IMEI-STOCK-APP",
    stack: ["Node", "Express", "MongoDB", "Vanilla JS", "Android Shell"],
    color: "#f8d84a",
    secondary: "#19d7ff",
    aura: "#14f195",
    text: "Multi-tenant IMEI stock and POS app for several mobile shops, covering sales logs, daily sheets, expenses, monthly P&L, CEO dashboards, model analytics, backups, reports, and tenant administration.",
    playSummary: "A multi-shop IMEI stock and POS platform with reports, tenants, dashboards, and backups.",
    stats: ["Gate/admin/shop auth", "MongoDB TTL sessions", "Super-admin controls"],
    metrics: ["POS", "Tenants", "Reports"],
  },
  {
    id: "erp-app",
    number: "03",
    title: "Stock ERP",
    type: "Business ERP",
    repo: "https://github.com/aayan-amir/erp-app",
    stack: ["React 19", "Vite", "Express", "Prisma", "PostgreSQL"],
    color: "#7c5cff",
    secondary: "#19d7ff",
    aura: "#f8d84a",
    text: "Full-stack ERP for small and mid-size operations teams, with dashboards, inventory, purchase orders, sales orders, suppliers, customers, reports, locations, users, and admin governance.",
    playSummary: "An ERP system for operations teams: inventory, orders, suppliers, users, reports, and audit logs.",
    stats: ["httpOnly JWT cookies", "Zod validation", "Inventory audit logs"],
    metrics: ["RBAC", "Audit", "ERP"],
  },
  {
    id: "stockapp",
    number: "04",
    title: "Stock Management",
    type: "Next.js Dashboard",
    repo: "https://github.com/aayan-amir/stockapp",
    stack: ["Next.js", "Prisma", "Supabase", "Tailwind"],
    color: "#ff4fd8",
    secondary: "#7c5cff",
    aura: "#19d7ff",
    text: "Modern inventory, purchases, and sales system converted from a Microsoft Access VBA workflow, with live KPIs, stock browser, purchase entries, invoices, customer records, ledger, settings, and PIN login.",
    playSummary: "A modern stock, purchase, sales, ledger, and KPI dashboard rebuilt from an Access workflow.",
    stats: ["Supabase Postgres", "Prisma seeding", "Deployment scripts"],
    metrics: ["KPI", "Sales", "Ledger"],
  },
  {
    id: "debug-sim",
    number: "05",
    title: "Code Debugging Simulator",
    type: "Learning Game",
    repo: "https://github.com/aayan-amir/Code-Debugging-Simulator",
    stack: ["C#", "WinForms", "MySQL", "ReaLTaiizor"],
    color: "#14f195",
    secondary: "#19d7ff",
    aura: "#f8d84a",
    text: "Educational debugging simulator with database-driven questions, fill-in-the-blanks, MCQs, score tracking, and a scoreboard for programming practice.",
    playSummary: "A classroom-style coding practice game with debugging, MCQs, scores, and database-driven questions.",
    stats: ["Debugging mode", "MCQs", "Scoreboard"],
    metrics: ["C#", "Quiz", "Scores"],
  },
];

export const timeline = [
  {
    label: "May 14, 2026",
    title: "ERP documentation and readiness pass",
    repo: "erp-app",
  },
  {
    label: "May 14, 2026",
    title: "IMEI Stock README updated to current production state",
    repo: "IMEI-STOCK-APP",
  },
  {
    label: "May 14, 2026",
    title: "Mobile World gained Google customer login and account support",
    repo: "mobileworld",
  },
  {
    label: "May 13, 2026",
    title: "Mobile World added Cloudinary/Postgres production support",
    repo: "mobileworld",
  },
  {
    label: "May 10, 2026",
    title: "IMEI Stock performance work: paginated logs and lazy reports",
    repo: "IMEI-STOCK-APP",
  },
];

export const capabilities = [
  { label: "React and Vite interfaces", group: "Frontend" },
  { label: "Next.js dashboards", group: "Frontend" },
  { label: "Tailwind and responsive UI", group: "Frontend" },
  { label: "Express APIs", group: "Backend" },
  { label: "Auth, RBAC, sessions", group: "Backend" },
  { label: "Deployment and production hardening", group: "Backend" },
  { label: "Postgres, Prisma, MongoDB", group: "Data" },
  { label: "SQL queries and data validation", group: "Data" },
  { label: "Inventory and ERP workflows", group: "Systems" },
  { label: "Admin dashboards and reports", group: "Systems" },
  { label: "C# Windows Forms", group: "Desktop" },
  { label: "LAN, printers, and office IT support", group: "IT" },
];

export const experience = [
  {
    role: "Software Developer / IT Support Specialist",
    company: "KOGO Metal",
    location: "Karachi",
    dates: "Jan 2026 - Present",
    points: [
      "Develops and supports business software workflows for internal operations.",
      "Builds and maintains WordPress and web functionality.",
      "Handles LAN file sharing, printing, hardware, software, and connectivity support.",
    ],
  },
  {
    role: "IT Support Intern / Assistant",
    company: "Precision Multiproducts Limited",
    location: "Karachi",
    dates: "2024",
    points: [
      "Ran routine SQL queries and checked database integrity for backend data operations.",
      "Provided Level-1 hardware and software support for office workstations.",
      "Documented troubleshooting procedures and supported IT asset management.",
    ],
  },
];

export const education = {
  school: "Sir Syed University of Engineering & Technology",
  degree: "Bachelor of Science in Computer Science",
  detail: "Currently enrolled, 4th semester, CGPA 3.62",
  focus: "Software development, databases, networking, and operating systems",
};

export const strengths = [
  "Problem-solving",
  "Analytical thinking",
  "Debugging",
  "Fast learning",
  "End-to-end programming",
  "CCNA in progress",
];
