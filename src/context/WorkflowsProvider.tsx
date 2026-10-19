"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { currentCustomer } from "@/src/lib/mock-data";
import {
  BankDocumentRequest,
  DocRequestType,
  DOC_TYPE_META,
  SalaryCertificate,
  SalaryTransferRequest,
  WORKFLOWS_STORAGE_KEY,
  WorkflowStatus,
  createId,
  seedWorkflows,
} from "@/src/lib/workflows";

interface WorkflowsContextValue {
  documentRequests: BankDocumentRequest[];
  salaryTransfers: SalaryTransferRequest[];
  salaryCertificates: SalaryCertificate[];
  loading: boolean;
  createDocumentRequest: (input: {
    type: DocRequestType;
    customerId: string;
    customerName: string;
    bankId: string;
    bankName: string;
    counterpartyBankId?: string;
    counterpartyBankName?: string;
    notes?: string;
  }) => BankDocumentRequest;
  respondDocumentRequest: (id: string, status: "approved" | "rejected", note?: string) => void;
  createSalaryTransfer: (input: {
    customerId: string;
    customerName: string;
    bankId: string;
    bankName: string;
    monthlySalary: number;
    employeeId?: string;
    employerId?: string;
    employerName?: string;
  }) => SalaryTransferRequest;
  decideSalaryTransfer: (id: string, status: "approved" | "rejected", note?: string) => void;
  createSalaryCertificate: (input: {
    customerId: string;
    customerName: string;
    requestedBy: "bank" | "customer" | "employer";
    bankName?: string;
    jobTitle?: string;
    monthlySalary?: number;
    employerId?: string;
    employerName?: string;
  }) => SalaryCertificate;
  issueSalaryCertificate: (id: string) => void;
  rejectSalaryCertificate: (id: string) => void;
  stats: {
    pendingDocs: number;
    pendingTransfers: number;
    pendingCertificates: number;
    issuedCertificates: number;
  };
}

const WorkflowsContext = createContext<WorkflowsContextValue | null>(null);

export function WorkflowsProvider({ children }: { children: React.ReactNode }) {
  const [documentRequests, setDocumentRequests] = useState<BankDocumentRequest[]>([]);
  const [salaryTransfers, setSalaryTransfers] = useState<SalaryTransferRequest[]>([]);
  const [salaryCertificates, setSalaryCertificates] = useState<SalaryCertificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WORKFLOWS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setDocumentRequests(parsed.documentRequests ?? []);
        setSalaryTransfers(parsed.salaryTransfers ?? []);
        setSalaryCertificates(parsed.salaryCertificates ?? []);
      } else {
        const seed = seedWorkflows();
        setDocumentRequests(seed.documentRequests);
        setSalaryTransfers(seed.salaryTransfers);
        setSalaryCertificates(seed.salaryCertificates);
        localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(seed));
      }
    } catch {
      const seed = seedWorkflows();
      setDocumentRequests(seed.documentRequests);
      setSalaryTransfers(seed.salaryTransfers);
      setSalaryCertificates(seed.salaryCertificates);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback(
    (
      docs: BankDocumentRequest[],
      transfers: SalaryTransferRequest[],
      certs: SalaryCertificate[]
    ) => {
      setDocumentRequests(docs);
      setSalaryTransfers(transfers);
      setSalaryCertificates(certs);
      localStorage.setItem(
        WORKFLOWS_STORAGE_KEY,
        JSON.stringify({
          documentRequests: docs,
          salaryTransfers: transfers,
          salaryCertificates: certs,
        })
      );
    },
    []
  );

  const createDocumentRequest: WorkflowsContextValue["createDocumentRequest"] = useCallback(
    (input) => {
      const meta = DOC_TYPE_META[input.type];
      const isDebtPurchase = input.type === "debt_purchase";
      const description =
        isDebtPurchase && input.counterpartyBankName
          ? `طلب شراء مديونية العميل من ${input.counterpartyBankName} لصالح ${input.bankName}`
          : meta.description;
      const req: BankDocumentRequest = {
        id: createId("DOC"),
        type: input.type,
        title: meta.title,
        description,
        bankId: input.bankId,
        bankName: input.bankName,
        counterpartyBankId: input.counterpartyBankId,
        counterpartyBankName: input.counterpartyBankName,
        customerId: input.customerId,
        customerName: input.customerName,
        status: "pending",
        createdAt: new Date().toISOString(),
        notes: input.notes,
      };
      persist([req, ...documentRequests], salaryTransfers, salaryCertificates);
      return req;
    },
    [documentRequests, persist, salaryCertificates, salaryTransfers]
  );

  const respondDocumentRequest = useCallback(
    (id: string, status: "approved" | "rejected", note?: string) => {
      const next = documentRequests.map((d) =>
        d.id === id
          ? {
              ...d,
              status: status as WorkflowStatus,
              respondedAt: new Date().toISOString(),
              responseNote: note,
            }
          : d
      );
      persist(next, salaryTransfers, salaryCertificates);
    },
    [documentRequests, persist, salaryCertificates, salaryTransfers]
  );

  const createSalaryTransfer: WorkflowsContextValue["createSalaryTransfer"] = useCallback(
    (input) => {
      const req: SalaryTransferRequest = {
        id: createId("SAL"),
        customerId: input.customerId,
        customerName: input.customerName,
        employerId: input.employerId || "emp-1",
        employerName: input.employerName || "شركة النخبة للتجارة",
        bankId: input.bankId,
        bankName: input.bankName,
        employeeId: input.employeeId || "EMP-2048",
        monthlySalary: input.monthlySalary,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      persist(documentRequests, [req, ...salaryTransfers], salaryCertificates);
      return req;
    },
    [documentRequests, persist, salaryCertificates, salaryTransfers]
  );

  const decideSalaryTransfer = useCallback(
    (id: string, status: "approved" | "rejected", note?: string) => {
      const next = salaryTransfers.map((s) =>
        s.id === id
          ? {
              ...s,
              status: status as WorkflowStatus,
              decidedAt: new Date().toISOString(),
              decisionNote: note,
            }
          : s
      );
      persist(documentRequests, next, salaryCertificates);
    },
    [documentRequests, persist, salaryCertificates, salaryTransfers]
  );

  const createSalaryCertificate: WorkflowsContextValue["createSalaryCertificate"] = useCallback(
    (input) => {
      const cert: SalaryCertificate = {
        id: createId("CERT"),
        customerId: input.customerId,
        customerName: input.customerName,
        employerId: input.employerId || "emp-1",
        employerName: input.employerName || "شركة النخبة للتجارة",
        requestedBy: input.requestedBy,
        bankName: input.bankName,
        jobTitle: input.jobTitle || currentCustomer.job,
        monthlySalary: input.monthlySalary || currentCustomer.monthlyIncome,
        hireDate: "2020-03-01",
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      persist(documentRequests, salaryTransfers, [cert, ...salaryCertificates]);
      return cert;
    },
    [documentRequests, persist, salaryCertificates, salaryTransfers]
  );

  const issueSalaryCertificate = useCallback(
    (id: string) => {
      const next = salaryCertificates.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "issued" as WorkflowStatus,
              issuedAt: new Date().toISOString(),
              certificateNo: `SC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
            }
          : c
      );
      persist(documentRequests, salaryTransfers, next);
    },
    [documentRequests, persist, salaryCertificates, salaryTransfers]
  );

  const rejectSalaryCertificate = useCallback(
    (id: string) => {
      const next = salaryCertificates.map((c) =>
        c.id === id ? { ...c, status: "rejected" as WorkflowStatus } : c
      );
      persist(documentRequests, salaryTransfers, next);
    },
    [documentRequests, persist, salaryCertificates, salaryTransfers]
  );

  const stats = useMemo(
    () => ({
      pendingDocs: documentRequests.filter((d) => d.status === "pending").length,
      pendingTransfers: salaryTransfers.filter((s) => s.status === "pending").length,
      pendingCertificates: salaryCertificates.filter((c) => c.status === "pending").length,
      issuedCertificates: salaryCertificates.filter((c) => c.status === "issued").length,
    }),
    [documentRequests, salaryCertificates, salaryTransfers]
  );

  const value = useMemo(
    () => ({
      documentRequests,
      salaryTransfers,
      salaryCertificates,
      loading,
      createDocumentRequest,
      respondDocumentRequest,
      createSalaryTransfer,
      decideSalaryTransfer,
      createSalaryCertificate,
      issueSalaryCertificate,
      rejectSalaryCertificate,
      stats,
    }),
    [
      createDocumentRequest,
      createSalaryCertificate,
      createSalaryTransfer,
      decideSalaryTransfer,
      documentRequests,
      issueSalaryCertificate,
      loading,
      rejectSalaryCertificate,
      respondDocumentRequest,
      salaryCertificates,
      salaryTransfers,
      stats,
    ]
  );

  return <WorkflowsContext.Provider value={value}>{children}</WorkflowsContext.Provider>;
}

export function useWorkflows() {
  const ctx = useContext(WorkflowsContext);
  if (!ctx) throw new Error("useWorkflows must be used within WorkflowsProvider");
  return ctx;
}
