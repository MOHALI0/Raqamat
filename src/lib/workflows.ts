import { createId, formatDateAr } from "@/src/lib/financing";

export type DocRequestType =
  | "clearance_letter"
  | "debt_purchase"
  | "liability_clearance"
  | "salary_certificate"
  | "iban_letter";

export type WorkflowStatus = "pending" | "approved" | "rejected" | "issued" | "cancelled";

export type DocAudience = "customer" | "employer" | "bank";

export interface BankDocumentRequest {
  id: string;
  type: DocRequestType;
  title: string;
  description: string;
  /** البنك المرسل (ثابت من جلسة البنك) */
  bankId: string;
  bankName: string;
  customerId: string;
  customerName: string;
  /** للشراء بين البنوك: البنك الحالي الحامل للمديونية */
  counterpartyBankId?: string;
  counterpartyBankName?: string;
  status: WorkflowStatus;
  createdAt: string;
  respondedAt?: string;
  notes?: string;
  responseNote?: string;
}

export interface SalaryTransferRequest {
  id: string;
  customerId: string;
  customerName: string;
  employerId: string;
  employerName: string;
  bankId: string;
  bankName: string;
  employeeId: string;
  monthlySalary: number;
  status: WorkflowStatus;
  createdAt: string;
  decidedAt?: string;
  decisionNote?: string;
}

export interface SalaryCertificate {
  id: string;
  customerId: string;
  customerName: string;
  employerId: string;
  employerName: string;
  requestedBy: "bank" | "customer" | "employer";
  bankName?: string;
  jobTitle: string;
  monthlySalary: number;
  hireDate: string;
  status: WorkflowStatus;
  createdAt: string;
  issuedAt?: string;
  certificateNo?: string;
}

export const DOC_TYPE_META: Record<
  DocRequestType,
  { title: string; description: string; audience: DocAudience; routeLabel: string }
> = {
  clearance_letter: {
    title: "مخالصة / إخلاء طرف",
    description: "طلب من البنك إلى العميل لإصدار مخالصة أو إخلاء طرف للالتزامات القائمة",
    audience: "customer",
    routeLabel: "بنك → عميل",
  },
  debt_purchase: {
    title: "شراء مديونية",
    description: "طلب بين البنوك: البنك المرسل يطلب شراء المديونية من البنك الحالي الحامل لها",
    audience: "bank",
    routeLabel: "بنك → بنك",
  },
  liability_clearance: {
    title: "الموافقة على إخلاء الطرف",
    description: "طلب من البنك إلى العميل للموافقة على إخلاء الطرف بعد سداد/نقل الالتزام",
    audience: "customer",
    routeLabel: "بنك → عميل",
  },
  salary_certificate: {
    title: "شهادة تعريف بالراتب",
    description: "طلب من البنك إلى جهة العمل لإصدار شهادة راتب رسمية لصالح البنك",
    audience: "employer",
    routeLabel: "بنك → جهة عمل",
  },
  iban_letter: {
    title: "تحويل الراتب / IBAN",
    description: "طلب من البنك إلى جهة العمل لاعتماد تحويل راتب الموظف إلى حساب البنك",
    audience: "employer",
    routeLabel: "بنك → جهة عمل",
  },
};

export const WORKFLOWS_STORAGE_KEY = "ufi-workflows-v2";

export { createId, formatDateAr };

export function seedWorkflows() {
  const now = Date.now();
  const documentRequests: BankDocumentRequest[] = [
    {
      id: "DOC-8801",
      type: "debt_purchase",
      title: "شراء مديونية",
      description:
        "طلب شراء مديونية العميل من البنك الأهلي إلى بنك رقمات — يُرجى تزويدنا بكشف المديونية ومتطلبات النقل",
      bankId: "bank-raqmat",
      bankName: "بنك رقمات",
      counterpartyBankId: "bank-ahli",
      counterpartyBankName: "البنك الأهلي",
      customerId: "C-10482",
      customerName: "أحمد بن محمد العتيبي",
      status: "pending",
      createdAt: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
      notes: "يتطلب كشف التزامات + موافقة العميل",
    },
    {
      id: "DOC-8795",
      type: "liability_clearance",
      title: "الموافقة على إخلاء الطرف",
      description: "يرجى الموافقة على إخلاء الطرف بعد إتمام سداد بطاقة الائتمان القديمة",
      bankId: "bank-raqmat",
      bankName: "بنك رقمات",
      customerId: "C-10482",
      customerName: "أحمد بن محمد العتيبي",
      status: "pending",
      createdAt: new Date(now - 1000 * 60 * 60 * 30).toISOString(),
    },
  ];

  const salaryTransfers: SalaryTransferRequest[] = [
    {
      id: "SAL-501",
      customerId: "C-10482",
      customerName: "أحمد بن محمد العتيبي",
      employerId: "emp-1",
      employerName: "شركة النخبة للتجارة",
      bankId: "bank-raqmat",
      bankName: "بنك رقمات",
      employeeId: "EMP-2048",
      monthlySalary: 28500,
      status: "pending",
      createdAt: new Date(now - 1000 * 60 * 60 * 10).toISOString(),
    },
    {
      id: "SAL-498",
      customerId: "C-10524",
      customerName: "فهد ناصر الدوسري",
      employerId: "emp-1",
      employerName: "شركة النخبة للتجارة",
      bankId: "bank-rajhi",
      bankName: "مصرف الراجحي",
      employeeId: "EMP-1988",
      monthlySalary: 42000,
      status: "approved",
      createdAt: new Date(now - 1000 * 60 * 60 * 80).toISOString(),
      decidedAt: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
      decisionNote: "تم اعتماد التحويل ابتداءً من دورة أغسطس",
    },
  ];

  const salaryCertificates: SalaryCertificate[] = [
    {
      id: "CERT-301",
      customerId: "C-10482",
      customerName: "أحمد بن محمد العتيبي",
      employerId: "emp-1",
      employerName: "شركة النخبة للتجارة",
      requestedBy: "bank",
      bankName: "بنك رقمات",
      jobTitle: "مدير مالي أول",
      monthlySalary: 28500,
      hireDate: "2020-03-01",
      status: "pending",
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
    },
  ];

  return { documentRequests, salaryTransfers, salaryCertificates };
}

export interface AdvisorTip {
  id: string;
  priority: "high" | "medium" | "low";
  category: string;
  title: string;
  advice: string;
  impact: string;
  actionLabel?: string;
  href?: string;
}
