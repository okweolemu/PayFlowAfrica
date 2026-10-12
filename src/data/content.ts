import Banknote from '@lucide/astro/icons/banknote';
import CalendarDays from '@lucide/astro/icons/calendar-days';
import ChartColumn from '@lucide/astro/icons/chart-column';
import ChartLine from '@lucide/astro/icons/chart-line';
import Coins from '@lucide/astro/icons/coins';
import Compass from '@lucide/astro/icons/compass';
import Cpu from '@lucide/astro/icons/cpu';
import FileCog from '@lucide/astro/icons/file-cog';
import HandCoins from '@lucide/astro/icons/hand-coins';
import Landmark from '@lucide/astro/icons/landmark';
import MapPin from '@lucide/astro/icons/map-pin';
import MapPinned from '@lucide/astro/icons/map-pinned';
import Network from '@lucide/astro/icons/network';
import Repeat from '@lucide/astro/icons/repeat';
import ScanEye from '@lucide/astro/icons/scan-eye';
import ShieldCheck from '@lucide/astro/icons/shield-check';
import SlidersHorizontal from '@lucide/astro/icons/sliders-horizontal';
import Sparkles from '@lucide/astro/icons/sparkles';
import Sprout from '@lucide/astro/icons/sprout';
import Target from '@lucide/astro/icons/target';
import Users from '@lucide/astro/icons/users';
import Workflow from '@lucide/astro/icons/workflow';
import { site } from '../config/site';

export type IconComponent = typeof Banknote;

export interface ProductArea {
  title: string;
  summary: string;
  points: string[];
  icon: IconComponent;
  status?: string;
}

export const productAreas: ProductArea[] = [
  {
    title: 'Payroll',
    summary: 'Automate payroll processing, earnings, deductions, benefits and payslips.',
    points: [
      'Monthly and off-cycle pay runs, validated before approval',
      'Earnings, allowances and deductions driven by configurable rules',
      'Pro-rating for joiners, leavers and mid-period changes',
      'Payslips and payment files ready for finance and banks',
    ],
    icon: Banknote,
  },
  {
    title: 'Employee Management',
    summary:
      'Keep employee information, employment details and organisational structures in one place.',
    points: [
      'Employee records, contracts and employment history',
      'Departments, positions, grades and reporting lines',
      'Role-based access, down to sensitive fields',
    ],
    icon: Users,
  },
  {
    title: 'Leave & Attendance',
    summary: 'Manage leave requests, balances, approvals and attendance-related workflows.',
    points: [
      'Leave types, accrual and carry-forward set by policy',
      'Approvals, delegation and team leave planning',
      'Leave and attendance data that flows into payroll',
    ],
    icon: CalendarDays,
  },
  {
    title: 'Benefits & Deductions',
    summary: 'Configure organisation-specific benefits, deductions and payroll rules.',
    points: [
      'Allowances and benefits with eligibility rules and limits',
      'Loans, salary advances and third-party deductions',
      'Statutory and voluntary deductions with effective dates',
    ],
    icon: HandCoins,
  },
  {
    title: 'Reporting & Analytics',
    summary: 'Turn payroll and HR data into useful operational and management insights.',
    points: [
      'Payroll summaries, variance and cost reports',
      'Headcount, turnover and leave analytics',
      'Exports for finance, audit and management',
    ],
    icon: ChartColumn,
  },
  {
    title: 'AI-Assisted HR Operations',
    summary:
      'Explore how AI can help organisations understand payroll and HR information, identify anomalies and reduce repetitive administrative work.',
    points: [
      'Plain-language answers about payroll and HR data',
      'Anomaly flags before a pay run is approved',
      'Privately hosted model options where data residency matters',
    ],
    icon: Sparkles,
    status: 'Exploring',
  },
];

export const roadmap: string[] = [
  'Employee self-service',
  'Pensions & end-of-service benefits',
  'Performance & goals',
  'Finance & ERP integrations',
  'Bank payment integrations',
  'Document management',
];

export interface Feature {
  title: string;
  text: string;
  icon: IconComponent;
}

export const africaPrinciples: Feature[] = [
  {
    title: 'Configurable payroll rules',
    text: 'Earnings, deductions and formulas defined as rules your team can read and review, not logic buried in spreadsheets.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Local requirements',
    text: 'Country and sector requirements configured per organisation, instead of hard-coded assumptions.',
    icon: MapPin,
  },
  {
    title: 'Multiple currencies',
    text: 'Pay, report and reconcile in the currencies your organisation actually works in.',
    icon: Coins,
  },
  {
    title: 'Organisation-specific policies',
    text: 'Your grades, allowances, leave policies and limits, modelled the way your organisation defines them.',
    icon: FileCog,
  },
  {
    title: 'Statutory deductions',
    text: 'Tax, pension and other statutory deductions set up as rules with effective dates, so rate changes don’t mean rework.',
    icon: Landmark,
  },
  {
    title: 'Auditability',
    text: 'A record of every pay-affecting change: who made it, when, and what it replaced.',
    icon: ScanEye,
  },
  {
    title: 'Approval workflows',
    text: 'Multi-step approvals for pay runs, changes and requests, with delegation when approvers are away.',
    icon: Workflow,
  },
  {
    title: 'Multi-organisation support',
    text: 'Several entities, branches or programmes, each with its own rules, managed from one place.',
    icon: Network,
  },
  {
    title: 'Data-driven HR operations',
    text: 'Structured, reliable data that turns monthly payroll into insight for HR, finance and leadership.',
    icon: ChartLine,
  },
];

export interface ValueProp extends Feature {
  key: 'accuracy' | 'automation' | 'visibility' | 'control' | 'africa';
}

export const valueProps: ValueProp[] = [
  {
    key: 'accuracy',
    title: 'Accuracy',
    text: 'Designed to reduce manual payroll work and calculation errors, with validation checks before anything is approved.',
    icon: Target,
  },
  {
    key: 'automation',
    title: 'Automation',
    text: 'Repetitive HR and payroll processes, such as recurring deductions, pro-rating and approvals, turned into dependable workflows.',
    icon: Repeat,
  },
  {
    key: 'visibility',
    title: 'Visibility',
    text: 'A clearer view of payroll costs, headcount and month-to-month changes for HR and finance teams.',
    icon: ScanEye,
  },
  {
    key: 'control',
    title: 'Control',
    text: 'Configurable rules, role-based access, approvals and audit trails, so every pay-affecting change is accounted for.',
    icon: ShieldCheck,
  },
  {
    key: 'africa',
    title: 'Built for African organisations',
    text: 'Designed around multiple currencies, local requirements and the operational realities of organisations across Africa.',
    icon: MapPinned,
  },
];

/**
 * Shown on the home page and reused, word for word, in its structured data and in /llms.txt. Answers are plain text
 * so they read the same everywhere; the contact address is linked automatically on the page.
 */
export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: 'What is PayFlow Africa?',
    answer:
      'PayFlow Africa is an early-stage, founder-led technology company building payroll and HR software for organisations across Africa. The platform is being designed to bring payroll, employee records, leave, benefits and deductions, and reporting together in one system.',
  },
  {
    question: 'Is PayFlow Africa a payments company?',
    answer:
      'No. PayFlow Africa is building payroll and HR software, not a payment processor, wallet or money-transfer service. Payroll is being designed to prepare payslips and payment files for an organisation’s finance team and banks, with bank payment integrations further along the roadmap.',
  },
  {
    question: 'Can my organisation use PayFlow Africa today?',
    answer:
      `Not yet. PayFlow Africa is in active development, and the product screens on ${site.domain} are design concepts populated with sample data. Organisations can join early access to get updates as the product takes shape and to be considered for early previews before general release.`,
  },
  {
    question: 'Who is PayFlow Africa for?',
    answer:
      'PayFlow Africa is being built for SMEs, NGOs and growing organisations across Africa, and for the HR, payroll and finance teams who run payroll every month, including organisations with several entities, branches or programmes.',
  },
  {
    question: 'Which countries does PayFlow Africa support?',
    answer:
      'No country configuration is described as supported yet. Country and sector requirements are being built as configuration rather than hard-coded assumptions, and we’ll only describe a country configuration as supported once it has been validated against current local requirements.',
  },
  {
    question: 'Will PayFlow Africa handle payroll in more than one currency?',
    answer:
      'Multi-currency payroll is a core design goal. The platform is being designed so organisations can pay, report and reconcile in the currencies they actually work in, with totals across entities shown in a reporting currency.',
  },
  {
    question: 'How will PayFlow Africa use AI?',
    answer:
      'AI-assisted HR operations are an area we’re exploring, not a finished feature. Ideas under consideration include plain-language answers about payroll and HR data, anomaly flags before a pay run is approved, and privately hosted model options where data residency matters.',
  },
  {
    question: 'How do I join early access or get in touch?',
    answer:
      `Use the early-access form on ${site.domain}, or email ${site.contactEmail} with your name and organisation. The same address handles general enquiries, partnership ideas and product feedback.`,
  },
];

export const aboutPillars: Feature[] = [
  {
    title: 'Early-stage',
    text: 'We’re in active development, and we’ll always be clear about what’s available and what’s still being built.',
    icon: Sprout,
  },
  {
    title: 'Founder-led',
    text: 'PayFlow Africa is led by its founder, keeping product decisions close to the problems organisations actually face.',
    icon: Compass,
  },
  {
    title: 'Africa-focused',
    text: 'We start from the needs of African organisations, rather than adapting software designed for somewhere else.',
    icon: MapPinned,
  },
  {
    title: 'Technology-driven',
    text: 'Modern architecture, configurable rules, and practical use of AI where it genuinely helps.',
    icon: Cpu,
  },
];
