"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  BankOffer,
  BankOfferStatus,
  calcApprovalProbability,
  calcMonthlyInstallment,
  createId,
  FINANCING_PRODUCTS,
  FinancingProductType,
  OfferRequest,
  OfferRequestStatus,
  OFFERS_STORAGE_KEY,
} from "@/src/lib/financing";
import { currentCustomer } from "@/src/lib/mock-data";

interface CreateRequestInput {
  productType: FinancingProductType;
  amount: number;
  tenureMonths: number;
  purpose: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  creditScore?: number;
  monthlyIncome?: number;
  commitmentRatio?: number;
  employer?: string;
}

interface SubmitOfferInput {
  requestId: string;
  bankId: string;
  bankName: string;
  amount: number;
  tenureMonths: number;
  profitRate: number;
  conditions: string[];
  notes?: string;
}

interface OffersContextValue {
  requests: OfferRequest[];
  offers: BankOffer[];
  loading: boolean;
  createRequest: (input: CreateRequestInput) => OfferRequest;
  cancelRequest: (id: string) => void;
  submitOffer: (input: SubmitOfferInput) => BankOffer | null;
  respondToOffer: (offerId: string, status: "accepted" | "rejected") => void;
  openRequests: OfferRequest[];
  customerRequests: (customerId: string) => OfferRequest[];
  offersForRequest: (requestId: string) => BankOffer[];
  offersForCustomer: (customerId: string) => BankOffer[];
  stats: {
    openRequests: number;
    pendingOffers: number;
    acceptedOffers: number;
    avgOfferRate: number;
    totalRequestedAmount: number;
    conversionRate: number;
  };
}

const OffersContext = createContext<OffersContextValue | null>(null);

function seedData(): { requests: OfferRequest[]; offers: BankOffer[] } {
  const now = Date.now();
  const requests: OfferRequest[] = [
    {
      id: "REQ-24081",
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerEmail: currentCustomer.email,
      productType: "personal",
      productName: "تمويل شخصي",
      amount: 120000,
      tenureMonths: 36,
      purpose: "تجديد أثاث المنزل وسداد التزامات قصيرة",
      status: "matched",
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
      creditScore: currentCustomer.creditScore,
      monthlyIncome: currentCustomer.monthlyIncome,
      commitmentRatio: currentCustomer.commitmentRatio,
      employer: currentCustomer.employer,
    },
    {
      id: "REQ-24076",
      customerId: "C-10524",
      customerName: "فهد ناصر الدوسري",
      customerEmail: "fahad.dosari@email.sa",
      productType: "auto",
      productName: "تمويل سيارة",
      amount: 185000,
      tenureMonths: 48,
      purpose: "شراء سيارة عائلية جديدة",
      status: "open",
      createdAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
      creditScore: 771,
      monthlyIncome: 42000,
      commitmentRatio: 28,
      employer: "أرامكو السعودية",
    },
    {
      id: "REQ-24071",
      customerId: "C-10491",
      customerName: "سارة عبدالله القحطاني",
      customerEmail: "sara.qahtani@email.sa",
      productType: "credit_card",
      productName: "بطاقة ائتمان",
      amount: 25000,
      tenureMonths: 12,
      purpose: "حد ائتماني للمشتريات والسفر",
      status: "open",
      createdAt: new Date(now - 1000 * 60 * 60 * 4).toISOString(),
      creditScore: 698,
      monthlyIncome: 19200,
      commitmentRatio: 31,
      employer: "وزارة التعليم",
    },
    {
      id: "REQ-24065",
      customerId: "C-10545",
      customerName: "هند راشد الغامدي",
      customerEmail: "hind.ghamdi@email.sa",
      productType: "mortgage",
      productName: "تمويل عقاري",
      amount: 850000,
      tenureMonths: 240,
      purpose: "شراء وحدة سكنية في شمال الرياض",
      status: "open",
      createdAt: new Date(now - 1000 * 60 * 90).toISOString(),
      creditScore: 804,
      monthlyIncome: 51000,
      commitmentRatio: 22,
      employer: "شركة تقنية وطنية",
    },
  ];

  const offers: BankOffer[] = [
    {
      id: "OFF-9011",
      requestId: "REQ-24081",
      bankId: "bank-raqmat",
      bankName: "بنك رقمات",
      amount: 120000,
      tenureMonths: 36,
      profitRate: 4.49,
      monthlyInstallment: calcMonthlyInstallment(120000, 36, 4.49),
      approvalProbability: 91,
      conditions: ["تحويل الراتب", "تأمين تكافلي اختياري", "بدون كفيل"],
      status: "pending",
      createdAt: new Date(now - 1000 * 60 * 60 * 20).toISOString(),
      expiresAt: new Date(now + 1000 * 60 * 60 * 72).toISOString(),
      notes: "عرض تفضيلي لعملاء الهوية المالية الموحدة",
    },
    {
      id: "OFF-9012",
      requestId: "REQ-24081",
      bankId: "bank-rajhi",
      bankName: "مصرف الراجحي",
      amount: 110000,
      tenureMonths: 36,
      profitRate: 4.99,
      monthlyInstallment: calcMonthlyInstallment(110000, 36, 4.99),
      approvalProbability: 86,
      conditions: ["تحويل الراتب", "رسوم إدارية 1%"],
      status: "pending",
      createdAt: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
      expiresAt: new Date(now + 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: "OFF-9008",
      requestId: "REQ-24076",
      bankId: "bank-ahli",
      bankName: "البنك الأهلي",
      amount: 180000,
      tenureMonths: 48,
      profitRate: 3.65,
      monthlyInstallment: calcMonthlyInstallment(180000, 48, 3.65),
      approvalProbability: 88,
      conditions: ["رهن المركبة", "تأمين شامل"],
      status: "pending",
      createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
      expiresAt: new Date(now + 1000 * 60 * 60 * 96).toISOString(),
    },
  ];

  return { requests, offers };
}

export function OffersProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<OfferRequest[]>([]);
  const [offers, setOffers] = useState<BankOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(OFFERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { requests: OfferRequest[]; offers: BankOffer[] };
        setRequests(parsed.requests ?? []);
        setOffers(parsed.offers ?? []);
      } else {
        const seed = seedData();
        setRequests(seed.requests);
        setOffers(seed.offers);
        localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(seed));
      }
    } catch {
      const seed = seedData();
      setRequests(seed.requests);
      setOffers(seed.offers);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback((nextRequests: OfferRequest[], nextOffers: BankOffer[]) => {
    setRequests(nextRequests);
    setOffers(nextOffers);
    localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify({ requests: nextRequests, offers: nextOffers }));
  }, []);

  const createRequest = useCallback(
    (input: CreateRequestInput) => {
      const product = FINANCING_PRODUCTS.find((p) => p.type === input.productType)!;
      const request: OfferRequest = {
        id: createId("REQ"),
        customerId: input.customerId ?? currentCustomer.id,
        customerName: input.customerName ?? currentCustomer.name,
        customerEmail: input.customerEmail ?? currentCustomer.email,
        productType: input.productType,
        productName: product.name,
        amount: input.amount,
        tenureMonths: input.tenureMonths,
        purpose: input.purpose,
        status: "open",
        createdAt: new Date().toISOString(),
        creditScore: input.creditScore ?? currentCustomer.creditScore,
        monthlyIncome: input.monthlyIncome ?? currentCustomer.monthlyIncome,
        commitmentRatio: input.commitmentRatio ?? currentCustomer.commitmentRatio,
        employer: input.employer ?? currentCustomer.employer,
      };
      persist([request, ...requests], offers);
      return request;
    },
    [offers, persist, requests]
  );

  const cancelRequest = useCallback(
    (id: string) => {
      const nextRequests = requests.map((r) =>
        r.id === id ? { ...r, status: "cancelled" as OfferRequestStatus } : r
      );
      const nextOffers = offers.map((o) =>
        o.requestId === id && o.status === "pending"
          ? { ...o, status: "expired" as BankOfferStatus }
          : o
      );
      persist(nextRequests, nextOffers);
    },
    [offers, persist, requests]
  );

  const submitOffer = useCallback(
    (input: SubmitOfferInput) => {
      const request = requests.find((r) => r.id === input.requestId);
      if (!request || request.status === "cancelled" || request.status === "closed") return null;

      const installment = calcMonthlyInstallment(input.amount, input.tenureMonths, input.profitRate);
      const approvalProbability = calcApprovalProbability(
        request.creditScore,
        request.commitmentRatio,
        input.amount,
        request.monthlyIncome
      );

      const offer: BankOffer = {
        id: createId("OFF"),
        requestId: input.requestId,
        bankId: input.bankId,
        bankName: input.bankName,
        amount: input.amount,
        tenureMonths: input.tenureMonths,
        profitRate: input.profitRate,
        monthlyInstallment: installment,
        approvalProbability,
        conditions: input.conditions,
        status: "pending",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
        notes: input.notes,
      };

      const nextRequests = requests.map((r) =>
        r.id === input.requestId ? { ...r, status: "matched" as OfferRequestStatus } : r
      );
      persist(nextRequests, [offer, ...offers]);
      return offer;
    },
    [offers, persist, requests]
  );

  const respondToOffer = useCallback(
    (offerId: string, status: "accepted" | "rejected") => {
      const target = offers.find((o) => o.id === offerId);
      if (!target) return;

      const nextOffers = offers.map((o) => {
        if (o.id === offerId) return { ...o, status };
        // عند القبول: رفض بقية عروض نفس الطلب تلقائياً
        if (status === "accepted" && o.requestId === target.requestId && o.status === "pending") {
          return { ...o, status: "rejected" as BankOfferStatus };
        }
        return o;
      });

      const nextRequests = requests.map((r) => {
        if (r.id !== target.requestId) return r;
        if (status === "accepted") return { ...r, status: "closed" as OfferRequestStatus };
        const stillPending = nextOffers.some(
          (o) => o.requestId === r.id && o.status === "pending"
        );
        return { ...r, status: (stillPending ? "matched" : "open") as OfferRequestStatus };
      });

      persist(nextRequests, nextOffers);
    },
    [offers, persist, requests]
  );

  const stats = useMemo(() => {
    const openRequests = requests.filter((r) => r.status === "open" || r.status === "matched").length;
    const pendingOffers = offers.filter((o) => o.status === "pending").length;
    const acceptedOffers = offers.filter((o) => o.status === "accepted").length;
    const pendingOrDone = offers.filter((o) => o.status === "pending" || o.status === "accepted" || o.status === "rejected");
    const avgOfferRate =
      pendingOrDone.length === 0
        ? 0
        : pendingOrDone.reduce((a, o) => a + o.profitRate, 0) / pendingOrDone.length;
    const totalRequestedAmount = requests
      .filter((r) => r.status !== "cancelled")
      .reduce((a, r) => a + r.amount, 0);
    const closed = requests.filter((r) => r.status === "closed").length;
    const conversionRate = requests.length === 0 ? 0 : (closed / requests.length) * 100;

    return {
      openRequests,
      pendingOffers,
      acceptedOffers,
      avgOfferRate: Math.round(avgOfferRate * 100) / 100,
      totalRequestedAmount,
      conversionRate: Math.round(conversionRate * 10) / 10,
    };
  }, [offers, requests]);

  const value = useMemo<OffersContextValue>(
    () => ({
      requests,
      offers,
      loading,
      createRequest,
      cancelRequest,
      submitOffer,
      respondToOffer,
      openRequests: requests.filter((r) => r.status === "open" || r.status === "matched"),
      customerRequests: (customerId: string) => requests.filter((r) => r.customerId === customerId),
      offersForRequest: (requestId: string) => offers.filter((o) => o.requestId === requestId),
      offersForCustomer: (customerId: string) => {
        const ids = new Set(requests.filter((r) => r.customerId === customerId).map((r) => r.id));
        return offers.filter((o) => ids.has(o.requestId));
      },
      stats,
    }),
    [cancelRequest, createRequest, loading, offers, requests, respondToOffer, stats, submitOffer]
  );

  return <OffersContext.Provider value={value}>{children}</OffersContext.Provider>;
}

export function useOffers() {
  const ctx = useContext(OffersContext);
  if (!ctx) throw new Error("useOffers must be used within OffersProvider");
  return ctx;
}
