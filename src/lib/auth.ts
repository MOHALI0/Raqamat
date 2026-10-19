export type UserRole = "bank" | "customer" | "employer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  orgName?: string;
}

export const DEMO_USERS: AuthUser[] = [
  {
    id: "bank-1",
    name: "فريق رقمات",
    email: "admin@ufi.sa",
    role: "bank",
    roleLabel: "موظف البنك",
    orgName: "بنك رقمات",
  },
  {
    id: "cust-1",
    name: "أحمد بن محمد العتيبي",
    email: "ahmed.otaibi@email.sa",
    role: "customer",
    roleLabel: "عميل",
  },
  {
    id: "emp-1",
    name: "نورة السبيعي",
    email: "hr@alnokhba.sa",
    role: "employer",
    roleLabel: "جهة العمل",
    orgName: "شركة النخبة للتجارة",
  },
];

export const ROLE_HOME: Record<UserRole, string> = {
  bank: "/dashboard",
  customer: "/dashboard/customer",
  employer: "/dashboard/employer",
};

export const ROLE_ROUTE_PREFIXES: Record<UserRole, string[]> = {
  bank: [
    "/dashboard",
    "/dashboard/customers",
    "/dashboard/sales",
    "/dashboard/marketing",
    "/dashboard/aml",
    "/dashboard/requests",
    "/dashboard/documents",
    "/dashboard/reports",
    "/dashboard/notifications",
    "/dashboard/permissions",
    "/dashboard/settings",
  ],
  customer: [
    "/dashboard/customer",
    "/dashboard/offers",
    "/dashboard/documents",
    "/dashboard/advisor",
    "/dashboard/capacity",
    "/dashboard/notifications",
    "/dashboard/settings",
  ],
  employer: [
    "/dashboard/employer",
    "/dashboard/employer/salary",
    "/dashboard/employer/certificates",
    "/dashboard/notifications",
    "/dashboard/settings",
  ],
};

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const prefixes = ROLE_ROUTE_PREFIXES[role];

  return prefixes.some((prefix) => {
    if (prefix === "/dashboard") {
      return pathname === "/dashboard";
    }
    if (prefix === "/dashboard/customer") {
      return pathname === "/dashboard/customer";
    }
    if (prefix === "/dashboard/employer") {
      return pathname === "/dashboard/employer";
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}

export function findDemoUser(email: string): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  return DEMO_USERS.find((u) => u.email.toLowerCase() === normalized) ?? null;
}

/** هوية البنك المرتبطة بحساب الموظف المسجّل — ثابتة ولا تُختار يدوياً */
export function resolveSessionBank(user: AuthUser | null | undefined): {
  id: string;
  name: string;
} {
  if (user?.role === "bank") {
    return {
      id: user.id === "bank-1" ? "bank-raqmat" : user.id,
      name: user.orgName || "بنك رقمات",
    };
  }
  return { id: "bank-raqmat", name: "بنك رقمات" };
}

export const AUTH_STORAGE_KEY = "ufi-auth-user";
