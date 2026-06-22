import { NavGroup } from "@/interfaces";
import {
  Employee,
  PayrollRun,
  Report,
  Transaction,
} from "@/interfaces/tables.interface";
import {
  ArrowDown,
  FileText,
  LayoutGrid,
  Receipt,
  ReceiptText,
  RotateCw,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

export const INDUSTRIES = [
  "Technology",
  "Retail & commerce",
  "Financial services",
  "Manufacturing",
  "Hospitality",
  "Other",
];

export const DEFAULT_HEADER = {
  title: "Good morning, Ama",
  subtitle: "Here's where TechCorp stands today.",
};

export const SIDEBAR_GROUPS_LINKS: NavGroup[] = [
  {
    id: "main",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutGrid },
      { title: "Team", url: "/dashboard/team", icon: Users },
      { title: "Payroll", url: "/dashboard/payroll", icon: RotateCw },
      { title: "Wallet", url: "/dashboard/wallet", icon: Wallet },
    ],
  },
  {
    id: "records",
    label: "Records",
    items: [
      { title: "Transactions", url: "/dashboard/transactions", icon: Receipt },
      { title: "Reports", url: "/dashboard/reports", icon: ArrowDown },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [{ title: "Settings", url: "/dashboard/settings", icon: Settings }],
  },
];

export const SIDEBAR_GROUPS = [
  {
    id: "main",
    items: [
      { title: "Dashboard", url: "#", icon: LayoutGrid, isActive: true },
      { title: "Team", url: "#", icon: Users },
      { title: "Payroll", url: "#", icon: RotateCw },
      { title: "Wallet", url: "#", icon: Wallet },
    ],
  },
  {
    id: "records",
    label: "Records",
    items: [
      { title: "Transactions", url: "#", icon: Receipt },
      { title: "Reports", url: "#", icon: ArrowDown },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [{ title: "Settings", url: "#", icon: Settings }],
  },
];

export const ROUTE_HEADERS: Record<
  string,
  { title: string; subtitle: string }
> = {
  "/team": {
    title: "Team",
    subtitle: "Manage everyone on your payroll.",
  },
  "/payroll": {
    title: "Payroll",
    subtitle: "Run, schedule and review payments.",
  },
  "/wallet": {
    title: "Wallet",
    subtitle: "Fund your account and track every cedi.",
  },
  "/transactions": {
    title: "Transactions",
    subtitle: "Every movement on your Moolre wallet",
  },
  "/reports": {
    title: "Reports",
    subtitle: "Export payroll records for accounting.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Automation, company profile and security.",
  },
};

export const SLIDES = [
  {
    type: "gradient",
    tag: "SALARY, ALREADY SORTED",
    title: (
      <>
        Pay your team.
        <br />
        Their bills sort
        <br />
        themselves.
      </>
    ),
  },
  {
    type: "image",
    image: "/assets/slide_office.png",
    tag: "MOVE MONEY WITH TOTAL CONFIDENCE",
    title:
      "Secure, compliant, and reliable financial infrastructure for modern teams.",
  },
  {
    type: "image",
    image: "/assets/slide_atm.png",
    tag: "POWERING THE FUTURE OF DIGITAL PAYMENTS.",
    title: "Connecting digital wallets to real-world, everyday human utility.",
  },
  {
    type: "image",
    image: "/assets/slide_building.png",
    tag: "PAY YOUR TEAM IN ONE CLICK.",
    title: "We handle the complexity so you can focus on building",
  },
];

export const INITIAL_DATA: Employee[] = [
  {
    id: "1",
    name: "Kwame Essien",
    email: "kwame@techcorp.com",
    phone: "+233 24 111 2233",
    wallet: "Linked",
    status: "Active",
    salary: 5000,
    avatarColor: "bg-green-50 text-green-600",
  },
  {
    id: "2",
    name: "Abena Boateng",
    email: "abena@techcorp.com",
    phone: "+233 20 445 6677",
    wallet: "Linked",
    status: "Pending",
    salary: 4200,
    avatarColor: "bg-orange-50 text-orange-600",
  },
  {
    id: "3",
    name: "Yaw Mensah",
    email: "yaw@techcorp.com",
    phone: "+233 27 889 1100",
    wallet: "Linked",
    status: "Active",
    salary: 6800,
    avatarColor: "bg-[#ede7f6] text-[#4a148c]",
  },
  {
    id: "4",
    name: "Efua Asante",
    email: "efua@techcorp.com",
    phone: "+233 55 332 9988",
    wallet: "Linked",
    status: "Active",
    salary: 5500,
    avatarColor: "bg-[#e3f2fd] text-[#0d47a1]",
  },
  {
    id: "5",
    name: "Kofi Adjei",
    email: "kofi@techcorp.com",
    phone: "+233 24 776 5544",
    wallet: "Provisioning",
    status: "Suspended",
    salary: 4000,
    avatarColor: "bg-[#efebe9] text-[#3e2723]",
  },
  {
    id: "6",
    name: "Adwoa Owusu",
    email: "adwoa@techcorp.com",
    phone: "+233 26 220 3311",
    wallet: "Linked",
    status: "Active",
    salary: 7200,
    avatarColor: "bg-orange-50 text-orange-600",
  },
  {
    id: "7",
    name: "Kojo Darko",
    email: "kojo@techcorp.com",
    phone: "+233 24 990 8877",
    wallet: "Linked",
    status: "Active",
    salary: 5800,
    avatarColor: "bg-green-50 text-green-600",
  },
  {
    id: "8",
    name: "Akosua Frimpong",
    email: "akosua@techcorp.com",
    phone: "+233 20 113 4455",
    wallet: "Linked",
    status: "Active",
    salary: 4600,
    avatarColor: "bg-[#ede7f6] text-[#4a148c]",
  },
  {
    id: "9",
    name: "Kwabena Osei",
    email: "kwabena@techcorp.com",
    phone: "+233 27 556 7788",
    wallet: "Linked",
    status: "Active",
    salary: 6100,
    avatarColor: "bg-[#e3f2fd] text-[#0d47a1]",
  },
  {
    id: "10",
    name: "Esi Quaye",
    email: "esi@techcorp.com",
    phone: "+233 55 667 2299",
    wallet: "Linked",
    status: "Pending",
    salary: 5300,
    avatarColor: "bg-[#efebe9] text-[#3e2723]",
  },
  {
    id: "11",
    name: "Nana Yeboah",
    email: "nana@techcorp.com",
    phone: "+233 24 334 1122",
    wallet: "Linked",
    status: "Active",
    salary: 6400,
    avatarColor: "bg-orange-50 text-orange-600",
  },
];

export const PAYROLL_HISTORY: PayrollRun[] = [
  {
    id: "pr-1",
    period: "May 2026",
    runDate: "May 28, 2026",
    employees: 9,
    successRate: 100,
    totalPaid: 45000,
  },
  {
    id: "pr-2",
    period: "Apr 2026",
    runDate: "Apr 28, 2026",
    employees: 7,
    successRate: 88,
    totalPaid: 38500,
  },
  {
    id: "pr-3",
    period: "Mar 2026",
    runDate: "Mar 28, 2026",
    employees: 6,
    successRate: 100,
    totalPaid: 34200,
  },
];

export const TRANSACTIONS_HISTORY: Transaction[] = [
  {
    id: "tx-1",
    date: "Jun 15, 2026",
    description: "Wallet top-up · MTN MoMo",
    reference: "MLR-0Q7V5E",
    status: "Success",
    amount: 10000,
    type: "inflow",
  },
  {
    id: "tx-2",
    date: "Jun 12, 2026",
    description: "Wallet top-up · MTN MoMo",
    reference: "MLR-9F2A71",
    status: "Success",
    amount: 15000,
    type: "inflow",
  },
  {
    id: "tx-3",
    date: "May 28, 2026",
    description: "Payroll run · 9 employees",
    reference: "MLR-8B1C40",
    status: "Success",
    amount: 45000,
    type: "payout",
  },
  {
    id: "tx-4",
    date: "May 28, 2026",
    description: "Service fee · payroll",
    reference: "MLR-8B1C41",
    status: "Success",
    amount: 225,
    type: "payout",
  },
  {
    id: "tx-5",
    date: "May 14, 2026",
    description: "Wallet top-up · Bank transfer",
    reference: "MLR-7A0099",
    status: "Success",
    amount: 30000,
    type: "inflow",
  },
  {
    id: "tx-6",
    date: "Apr 28, 2026",
    description: "Payroll run · 7 employees",
    reference: "MLR-6C5512",
    status: "Success",
    amount: 38500,
    type: "payout",
  },
  {
    id: "tx-7",
    date: "Apr 28, 2026",
    description: "Payroll run · Kofi Adjei",
    reference: "MLR-6C5513",
    status: "Failed",
    amount: 4000,
    type: "payout",
  },
];

export const reports: Report[] = [
  {
    id: "may-2026-payroll",
    name: "Payroll run report",
    period: "May 2026",
    records: "9 employees",
    formats: ["CSV", "PDF"],
  },
  {
    id: "apr-2026-payroll",
    name: "Payroll run report",
    period: "Apr 2026",
    records: "7 employees",
    formats: ["CSV", "PDF"],
  },
  {
    id: "mar-2026-payroll",
    name: "Payroll run report",
    period: "Mar 2026",
    records: "6 employees",
    formats: ["CSV", "PDF"],
  },
  {
    id: "2026-tax-summary",
    name: "Annual tax summary",
    period: "2026 YTD",
    records: "all runs",
    formats: ["PDF"],
  },
];

export const summaryCards = [
  {
    label: "Total paid in 2026",
    value: "GHS 162,700",
    helper: "across 5 payroll runs",
    icon: ReceiptText,
    className: "bg-green-50 text-green-600",
  },
  {
    label: "Employees paid",
    value: "11",
    helper: "unique this year",
    icon: Users,
    className: "bg-blue-50 text-blue-600",
  },
  {
    label: "Reports generated",
    value: "5",
    helper: "ready to export",
    icon: FileText,
    className: "bg-orange-50 text-orange-600",
  },
];

export const bankDetails = [
  {
    label: "Account name",
    value: "Klare - TechCorp Ltd",
  },
  {
    label: "Account number",
    value: "1400 0044 71",
  },
  {
    label: "Bank",
    value: "Moolre / GCB rail",
  },
];
