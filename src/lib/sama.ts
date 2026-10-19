/**
 * حاسبة القدرة التمويلية وفق مبادئ الإقراض المسؤول (SAMA)
 * مصادر: Responsible Lending Principles + Consumer Financing Regulations
 */

export type EmploymentStatus = "employee" | "retired";

export interface ObligationItem {
  id: string;
  name: string;
  monthlyAmount: number;
  kind: "consumer" | "mortgage" | "credit_card" | "other";
  salaryLinked: boolean;
}

export interface SamaInput {
  grossSalary: number;
  totalMonthlyIncome: number;
  employmentStatus: EmploymentStatus;
  obligations: ObligationItem[];
  /** معدل ربح سنوي تقديري لحساب مبلغ التمويل */
  assumedApr?: number;
  /** مدة التمويل بالأشهر (حد أقصى 60 للتمويل الاستهلاكي) */
  tenureMonths?: number;
}

export interface SamaLimits {
  /** حد استقطاع الراتب للتمويل المرتبط بالراتب: 33.33% موظف / 25% متقاعد */
  salaryDeductionCapPct: number;
  salaryDeductionCapAmount: number;
  /** حد الالتزامات دون العقاري: 45% من إجمالي الدخل */
  nonMortgageCapPct: number;
  nonMortgageCapAmount: number;
  /** حد إجمالي الالتزامات التمويلية حسب شريحة الدخل */
  totalFinanceCapPct: number;
  totalFinanceCapAmount: number;
  incomeBracket: "≤15k" | "15–25k" | "≥25k";
}

export interface SamaCapacityResult {
  limits: SamaLimits;
  usedSalaryLinked: number;
  usedNonMortgage: number;
  usedTotalFinance: number;
  remainingSalaryLinked: number;
  remainingNonMortgage: number;
  remainingTotalFinance: number;
  /** القسط الشهري الأقصى المسموح (أضيق القيود) */
  maxNewInstallment: number;
  /** مبلغ تمويل تقديري وفق القسط والمدة والمعدل */
  estimatedFinanceAmount: number;
  utilization: {
    salaryLinkedPct: number;
    nonMortgagePct: number;
    totalFinancePct: number;
  };
  notes: string[];
}

function incomeBracket(income: number): SamaLimits["incomeBracket"] {
  if (income <= 15000) return "≤15k";
  if (income < 25000) return "15–25k";
  return "≥25k";
}

function totalFinanceCapPct(income: number): number {
  // مبادئ الإقراض المسؤول: ≤15k → 55%، >15k → 65% (مع استثناءات الإسكان)
  if (income <= 15000) return 55;
  return 65;
}

/** تحويل قسط شهري إلى أصل تمويل تقريبي (مرابحة مبسطة) */
export function installmentToPrincipal(
  monthlyInstallment: number,
  tenureMonths: number,
  annualRate: number
): number {
  if (monthlyInstallment <= 0 || tenureMonths <= 0) return 0;
  const years = tenureMonths / 12;
  const totalPay = monthlyInstallment * tenureMonths;
  const principal = totalPay / (1 + (annualRate / 100) * years);
  return Math.max(0, Math.round(principal));
}

export function calcSamaCapacity(input: SamaInput): SamaCapacityResult {
  const salaryCapPct = input.employmentStatus === "retired" ? 25 : 33.33;
  const bracket = incomeBracket(input.totalMonthlyIncome);
  const totalCapPct = totalFinanceCapPct(input.totalMonthlyIncome);
  const nonMortgageCapPct = 45;

  const limits: SamaLimits = {
    salaryDeductionCapPct: salaryCapPct,
    salaryDeductionCapAmount: Math.round((input.grossSalary * salaryCapPct) / 100),
    nonMortgageCapPct,
    nonMortgageCapAmount: Math.round((input.totalMonthlyIncome * nonMortgageCapPct) / 100),
    totalFinanceCapPct: totalCapPct,
    totalFinanceCapAmount: Math.round((input.totalMonthlyIncome * totalCapPct) / 100),
    incomeBracket: bracket,
  };

  const usedSalaryLinked = input.obligations
    .filter((o) => o.salaryLinked)
    .reduce((a, o) => a + o.monthlyAmount, 0);

  const usedNonMortgage = input.obligations
    .filter((o) => o.kind !== "mortgage")
    .reduce((a, o) => a + o.monthlyAmount, 0);

  const usedTotalFinance = input.obligations.reduce((a, o) => a + o.monthlyAmount, 0);

  const remainingSalaryLinked = Math.max(0, limits.salaryDeductionCapAmount - usedSalaryLinked);
  const remainingNonMortgage = Math.max(0, limits.nonMortgageCapAmount - usedNonMortgage);
  const remainingTotalFinance = Math.max(0, limits.totalFinanceCapAmount - usedTotalFinance);

  const maxNewInstallment = Math.min(
    remainingSalaryLinked,
    remainingNonMortgage,
    remainingTotalFinance
  );

  const tenure = Math.min(input.tenureMonths ?? 60, 60);
  const apr = input.assumedApr ?? 4.9;
  const estimatedFinanceAmount = installmentToPrincipal(maxNewInstallment, tenure, apr);

  const notes: string[] = [
    `حد استقطاع الراتب للتمويل الاستهلاكي: ${salaryCapPct}% من الراتب الإجمالي (موظف/متقاعد وفق أنظمة التمويل الاستهلاكي).`,
    `حد الالتزامات غير العقارية: 45% من إجمالي الدخل الشهري.`,
    `حد إجمالي الالتزامات التمويلية لشريحة ${bracket}: ${totalCapPct}% من إجمالي الدخل.`,
    `الحد الأقصى لمدة التمويل الاستهلاكي: 60 شهراً.`,
  ];

  if (maxNewInstallment <= 0) {
    notes.push("لا تتوفر قدرة استقطاع إضافية حالياً — يُنصح بخفض الالتزامات أو إعادة هيكلة الديون.");
  }

  return {
    limits,
    usedSalaryLinked,
    usedNonMortgage,
    usedTotalFinance,
    remainingSalaryLinked,
    remainingNonMortgage,
    remainingTotalFinance,
    maxNewInstallment,
    estimatedFinanceAmount,
    utilization: {
      salaryLinkedPct:
        limits.salaryDeductionCapAmount === 0
          ? 0
          : Math.round((usedSalaryLinked / limits.salaryDeductionCapAmount) * 1000) / 10,
      nonMortgagePct:
        limits.nonMortgageCapAmount === 0
          ? 0
          : Math.round((usedNonMortgage / limits.nonMortgageCapAmount) * 1000) / 10,
      totalFinancePct:
        limits.totalFinanceCapAmount === 0
          ? 0
          : Math.round((usedTotalFinance / limits.totalFinanceCapAmount) * 1000) / 10,
    },
    notes,
  };
}

export const DEFAULT_OBLIGATIONS: ObligationItem[] = [
  {
    id: "ob-1",
    name: "تمويل شخصي قائم",
    monthlyAmount: 2450,
    kind: "consumer",
    salaryLinked: true,
  },
  {
    id: "ob-2",
    name: "الحد الأدنى لبطاقة الائتمان",
    monthlyAmount: 850,
    kind: "credit_card",
    salaryLinked: true,
  },
  {
    id: "ob-3",
    name: "قسط تمويل سيارة",
    monthlyAmount: 1200,
    kind: "consumer",
    salaryLinked: true,
  },
];
