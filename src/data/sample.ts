/**
 * Fictional data for the product concept screens.
 * No real people, organisations, account numbers or pay figures are used.
 * Totals are kept internally consistent so the concepts read like a working product.
 */

export type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

export const sampleOrg = {
  name: 'Demo Organisation',
  period: 'October 2026',
  periodShort: 'Oct 2026',
  reportingCurrency: 'USD',
  entities: [
    { name: 'Kenya', currency: 'KES', employees: 102, grossUsd: 166_420 },
    { name: 'Uganda', currency: 'UGX', employees: 61, grossUsd: 98_150 },
    { name: 'Zambia', currency: 'ZMW', employees: 49, grossUsd: 87_640 },
    { name: 'Ghana', currency: 'GHS', employees: 36, grossUsd: 60_650 },
  ],
};

export const dashboard = {
  kpis: [
    { label: 'Gross pay', value: 'USD 412,860', delta: '+1.8% on Sep', tone: 'neutral' as Tone },
    { label: 'Net pay', value: 'USD 309,214', delta: '+1.6% on Sep', tone: 'neutral' as Tone },
    { label: 'Employees paid', value: '248', delta: '3 joiners · 1 leaver', tone: 'neutral' as Tone },
    { label: 'Deductions', value: 'USD 103,646', delta: '25.1% of gross', tone: 'neutral' as Tone },
  ],
  grossTrend: [396.2, 398.9, 401.5, 404.0, 405.6, 412.9],
  steps: [
    { label: 'Prepare', meta: '3 Oct', state: 'done' },
    { label: 'Validate', meta: '4 Oct', state: 'done' },
    { label: 'Review', meta: 'In progress', state: 'current' },
    { label: 'Approve', meta: 'Pending', state: 'upcoming' },
    { label: 'Pay', meta: 'Due 27 Oct', state: 'upcoming' },
  ] as { label: string; meta: string; state: 'done' | 'current' | 'upcoming' }[],
  attention: [
    { tone: 'warning' as Tone, text: '3 employees missing bank details', action: 'Resolve' },
    { tone: 'warning' as Tone, text: 'Overtime in Kenya up 12.4% on September', action: 'Review' },
  ],
  tasks: [
    { text: 'Leave requests awaiting approval', value: '6' },
    { text: 'Contracts ending in the next 30 days', value: '4' },
    { text: 'Pension rate change takes effect', value: '1 Jan' },
  ],
};

export const employees = [
  { name: 'Amani Otieno', initials: 'AO', number: 'EMP-00142', department: 'Finance', position: 'Finance Officer', entity: 'Kenya', status: 'Active' },
  { name: 'Wanjiru Kamau', initials: 'WK', number: 'EMP-00019', department: 'Human Resources', position: 'HR Business Partner', entity: 'Kenya', status: 'Active' },
  { name: 'Thandiwe Banda', initials: 'TB', number: 'EMP-00087', department: 'Programmes', position: 'Programme Manager', entity: 'Zambia', status: 'Active' },
  { name: 'Kwame Mensah', initials: 'KM', number: 'EMP-00231', department: 'Operations', position: 'Logistics Coordinator', entity: 'Ghana', status: 'On leave' },
  { name: 'Nakato Ssempa', initials: 'NS', number: 'EMP-00174', department: 'Programmes', position: 'Field Officer', entity: 'Uganda', status: 'Active' },
  { name: 'Mwila Chanda', initials: 'MC', number: 'EMP-00256', department: 'Technology', position: 'Systems Analyst', entity: 'Zambia', status: 'Probation' },
  { name: 'Akosua Boateng', initials: 'AB', number: 'EMP-00198', department: 'Finance', position: 'Accountant', entity: 'Ghana', status: 'Active' },
];

export const employeeStatusTone: Record<string, Tone> = {
  Active: 'success',
  'On leave': 'info',
  Probation: 'warning',
};

export const profile = {
  name: 'Amani Otieno',
  initials: 'AO',
  position: 'Finance Officer',
  department: 'Finance',
  number: 'EMP-00142',
  fields: [
    ['Entity', 'Kenya'],
    ['Reports to', 'Head of Finance'],
    ['Contract', 'Permanent'],
    ['Start date', '14 Mar 2022'],
    ['Grade', 'G6 · Step 3'],
    ['Pay', 'KES · Monthly'],
    ['Leave balance', '14.5 days'],
    ['Bank account', '•••• 4821'],
  ],
};

export const payrollRun = {
  title: 'October 2026 · Kenya',
  currency: 'KES',
  employees: 102,
  gross: 21_480_500,
  deductions: 5_612_300,
  net: 15_868_200,
  employerCost: 1_594_000,
  lines: [
    { component: 'Basic salary', type: 'Earning', count: 102, amount: 15_940_000, change: 0.9 },
    { component: 'Housing allowance', type: 'Earning', count: 102, amount: 3_188_000, change: 0.9 },
    { component: 'Transport allowance', type: 'Earning', count: 96, amount: 1_152_000, change: 0 },
    { component: 'Overtime', type: 'Earning', count: 18, amount: 1_200_500, change: 12.4, flag: true },
    { component: 'Income tax (PAYE)', type: 'Statutory', count: 102, amount: 4_102_800, change: 1.6 },
    { component: 'Pension contribution', type: 'Statutory', count: 102, amount: 797_000, change: 0.9 },
    { component: 'Loan repayments', type: 'Third-party', count: 23, amount: 512_500, change: -3.1 },
    { component: 'Salary advance recovery', type: 'Recovery', count: 6, amount: 200_000, change: null },
  ] as { component: string; type: string; count: number; amount: number; change: number | null; flag?: boolean }[],
  approvals: [
    { role: 'Payroll Officer', action: 'Prepared', when: '6 Oct, 14:20', state: 'done' },
    { role: 'HR Manager', action: 'Reviewed', when: '7 Oct, 09:05', state: 'done' },
    { role: 'Finance Director', action: 'Approval pending', when: 'Due 24 Oct', state: 'pending' },
  ] as { role: string; action: string; when: string; state: 'done' | 'pending' }[],
  checks: { passed: 46, warnings: 2 },
};

export const payslip = {
  employee: 'Amani Otieno',
  number: 'EMP-00142',
  position: 'Finance Officer',
  department: 'Finance',
  entity: 'Demo Organisation · Kenya',
  period: 'October 2026',
  payDate: '27 Oct 2026',
  currency: 'KES',
  payment: 'Bank transfer · •••• 4821',
  earnings: [
    ['Basic salary', 148_000],
    ['Housing allowance', 29_600],
    ['Transport allowance', 12_000],
  ] as [string, number][],
  deductions: [
    ['Income tax (PAYE)', 38_960],
    ['Pension contribution (5%)', 7_400],
    ['Medical scheme', 2_500],
    ['Staff loan repayment', 6_000],
  ] as [string, number][],
  employer: [['Pension contribution (10%)', 14_800]] as [string, number][],
  yearToDate: [
    ['Gross pay', 1_896_000],
    ['Income tax', 389_600],
    ['Pension (employee)', 74_000],
  ] as [string, number][],
  leaveBalance: '14.5 days',
};

export const analytics = {
  kpis: [
    { label: 'Headcount', value: '248', delta: '+12 since January', tone: 'success' as Tone },
    { label: 'Annualised turnover', value: '7.2%', delta: '−0.8 pts on last year', tone: 'success' as Tone },
    { label: 'Avg. leave taken (YTD)', value: '11.4 days', delta: 'Per employee', tone: 'neutral' as Tone },
    { label: 'Overtime share of gross', value: '2.9%', delta: '+0.6 pts on September', tone: 'warning' as Tone },
  ],
  departments: [
    ['Programmes', 92],
    ['Operations', 61],
    ['Finance', 34],
    ['Technology', 25],
    ['Human Resources', 21],
    ['Executive office', 15],
  ] as [string, number][],
  costTrend: {
    months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    values: [384.1, 401.7, 389.0, 391.2, 393.4, 395.0, 396.2, 398.9, 401.5, 404.0, 405.6, 412.9],
  },
  insight: {
    title: 'Overtime in Operations (Kenya) is 38% above its six-month average',
    text: 'Three employees account for 61% of the increase. Review before the October run is approved?',
  },
};

export const rule = {
  name: 'Pension contribution (employee)',
  version: 'v3',
  fields: [
    ['Applies to', 'Permanent staff · All entities'],
    ['Calculation', '5.0% × Basic salary'],
    ['Rounding', 'Nearest 0.01'],
    ['Effective from', '1 Jan 2027'],
  ],
  history: [
    { version: 'v3', text: 'Rate 4.5% → 5.0%', meta: 'Approved by Finance Director', current: true },
    { version: 'v2', text: 'Contract staff excluded', meta: 'Approved by HR Manager', current: false },
    { version: 'v1', text: 'Rule created', meta: 'Payroll Administrator', current: false },
  ],
  currencies: ['KES', 'UGX', 'ZMW', 'GHS', 'USD'],
};
