export type FinancingProductType =
  | "personal"
  | "auto"
  | "mortgage"
  | "credit_card"
  | "sme";

export type OfferRequestStatus = "open" | "matched" | "closed" | "cancelled";
export type BankOfferStatus = "pending" | "accepted" | "rejected" | "expired";

export interface FinancingProduct {
  id: string;
  type: FinancingProductType;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  typicalApr: number;
  minScore: number;
  maxDti: number;
}

export interface OfferRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productType: FinancingProductType;
  productName: string;
  amount: number;
  tenureMonths: number;
  purpose: string;
  status: OfferRequestStatus;
  createdAt: string;
  creditScore: number;
  monthlyIncome: number;
  commitmentRatio: number;
  employer: string;
}

export interface BankOffer {
  id: string;
  requestId: string;
  bankId: string;
  bankName: string;
  amount: number;
  tenureMonths: number;
  profitRate: number;
  monthlyInstallment: number;
  approvalProbability: number;
  conditions: string[];
  status: BankOfferStatus;
  createdAt: string;
  expiresAt: string;
  notes?: string;
}

export const FINANCING_PRODUCTS: FinancingProduct[] = [
  {
    id: "prod-personal",
    type: "personal",
    name: "تمويل شخصي",
    description: "تمويل نقدي مرن لتغطية الاحتياجات الشخصية مع أقساط شهرية ثابتة",
    minAmount: 10000,
    maxAmount: 300000,
    minTenure: 12,
    maxTenure: 60,
    typicalApr: 4.9,
    minScore: 620,
    maxDti: 45,
  },
  {
    id: "prod-auto",
    type: "auto",
    name: "تمويل سيارة",
    description: "تمويل شراء سيارة جديدة أو مستعملة وفق ضوابط الجهة الممولة",
    minAmount: 30000,
    maxAmount: 400000,
    minTenure: 12,
    maxTenure: 60,
    typicalApr: 3.8,
    minScore: 640,
    maxDti: 45,
  },
  {
    id: "prod-mortgage",
    type: "mortgage",
    name: "تمويل عقاري",
    description: "تمويل سكني طويل الأجل لشراء أو بناء وحدة سكنية",
    minAmount: 200000,
    maxAmount: 2500000,
    minTenure: 60,
    maxTenure: 300,
    typicalApr: 3.2,
    minScore: 680,
    maxDti: 55,
  },
  {
    id: "prod-card",
    type: "credit_card",
    name: "بطاقة ائتمان",
    description: "حد ائتماني متجدد مع مزايا استرداد ومكافآت",
    minAmount: 5000,
    maxAmount: 80000,
    minTenure: 12,
    maxTenure: 12,
    typicalApr: 18.0,
    minScore: 650,
    maxDti: 40,
  },
  {
    id: "prod-sme",
    type: "sme",
    name: "تمويل أعمال",
    description: "حلول تمويلية لأصحاب الأعمال والمنشآت الصغيرة",
    minAmount: 50000,
    maxAmount: 1000000,
    minTenure: 12,
    maxTenure: 84,
    typicalApr: 5.5,
    minScore: 660,
    maxDti: 50,
  },
];

export const PARTICIPATING_BANKS = [
  { id: "bank-raqmat", name: "بنك رقمات" },
  { id: "bank-ahli", name: "البنك الأهلي" },
  { id: "bank-rajhi", name: "مصرف الراجحي" },
  { id: "bank-riyad", name: "بنك الرياض" },
  { id: "bank-sab", name: "البنك السعودي الأول" },
];

export const OFFERS_STORAGE_KEY = "ufi-financing-offers-v1";

/** قسط شهري تقريبي (مرابحة مبسطة) */
export function calcMonthlyInstallment(amount: number, tenureMonths: number, annualRate: number): number {
  if (tenureMonths <= 0) return amount;
  const totalProfit = amount * (annualRate / 100) * (tenureMonths / 12);
  return Math.round((amount + totalProfit) / tenureMonths);
}

export function calcApprovalProbability(score: number, dti: number, amount: number, income: number): number {
  let p = 55;
  p += Math.min(30, Math.max(0, (score - 600) / 5));
  p -= Math.max(0, dti - 30) * 0.8;
  const burden = amount / Math.max(income * 12, 1);
  p -= burden * 25;
  return Math.round(Math.min(96, Math.max(18, p)));
}

export function assessEligibility(
  product: FinancingProduct,
  score: number,
  dti: number,
  amount: number
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (score < product.minScore) reasons.push(`التصنيف الائتماني أقل من الحد الأدنى (${product.minScore})`);
  if (dti > product.maxDti) reasons.push(`نسبة الالتزامات تتجاوز ${product.maxDti}%`);
  if (amount < product.minAmount) reasons.push(`المبلغ أقل من الحد الأدنى`);
  if (amount > product.maxAmount) reasons.push(`المبلغ أعلى من الحد الأقصى للمنتج`);
  return { eligible: reasons.length === 0, reasons };
}

export function formatDateAr(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
