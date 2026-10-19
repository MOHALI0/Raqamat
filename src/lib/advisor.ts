import { currentCustomer } from "@/src/lib/mock-data";
import { calcSamaCapacity, DEFAULT_OBLIGATIONS } from "@/src/lib/sama";
import type { AdvisorTip } from "@/src/lib/workflows";

export function buildAdvisorTips(): AdvisorTip[] {
  const capacity = calcSamaCapacity({
    grossSalary: currentCustomer.monthlyIncome,
    totalMonthlyIncome: currentCustomer.monthlyIncome + currentCustomer.otherIncome,
    employmentStatus: "employee",
    obligations: DEFAULT_OBLIGATIONS,
    assumedApr: 4.9,
    tenureMonths: 60,
  });

  const tips: AdvisorTip[] = [];

  if (capacity.utilization.salaryLinkedPct > 70) {
    tips.push({
      id: "tip-dbr",
      priority: "high",
      category: "القدرة الائتمانية",
      title: "استقطاع الراتب مرتفع نسبياً",
      advice:
        "نسبة الالتزامات المرتبطة بالراتب تقترب من حد SAMA (33.33%). سداد جزء من التمويل الشخصي أو شراء المديونية بمعدل أقل يحرر قدرة تمويلية.",
      impact: `متبقي للاستقطاع ≈ ${capacity.remainingSalaryLinked.toLocaleString("ar-SA")} ر.س شهرياً`,
      actionLabel: "حاسبة القدرة",
      href: "/dashboard/capacity",
    });
  } else {
    tips.push({
      id: "tip-capacity-ok",
      priority: "medium",
      category: "القدرة الائتمانية",
      title: "لديك مساحة تمويلية متاحة",
      advice:
        "وفق حدود الإقراض المسؤول، يمكنك تحمل قسطاً إضافياً ضمن السقف المتبقي. قارن عروض البنوك قبل الالتزام.",
      impact: `تمويل تقديري حتى ${capacity.estimatedFinanceAmount.toLocaleString("ar-SA")} ر.س`,
      actionLabel: "اطلب عروضاً",
      href: "/dashboard/offers",
    });
  }

  if (currentCustomer.utilizationRate > 35) {
    tips.push({
      id: "tip-card",
      priority: "high",
      category: "البطاقات",
      title: "خفض استخدام بطاقة الائتمان",
      advice:
        "الاستخدام الحالي أعلى من 35%. تخفيض الرصيد المستخدم يحسّن درجة SIMAH ويزيد احتمال الموافقة على التمويل.",
      impact: `الاستخدام الحالي ${currentCustomer.utilizationRate}%`,
    });
  }

  if (currentCustomer.spendingRatio > 55) {
    tips.push({
      id: "tip-spend",
      priority: "medium",
      category: "الإنفاق",
      title: "رفع معدل الادخار الشهري",
      advice:
        "حوّل تلقائياً 10–15% من الراتب لحساب ادخار مباشرة بعد الإيداع. ذلك يرفع درجة الهوية المالية ويظهر استقراراً للبنوك.",
      impact: `نسبة الإنفاق ${currentCustomer.spendingRatio}%`,
    });
  }

  if (currentCustomer.creditScore < 750) {
    tips.push({
      id: "tip-score",
      priority: "medium",
      category: "التصنيف الائتماني",
      title: "حافظ على سجل سداد منتظم",
      advice:
        "استمر في السداد قبل تاريخ الاستحقاق وتجنب فتح التزامات متعددة خلال 90 يوماً. كل تحسن 20–30 نقطة يرفع شريحة التسعير.",
      impact: `SIMAH الحالي ${currentCustomer.creditScore} (${currentCustomer.simahScoreBand})`,
    });
  }

  tips.push({
    id: "tip-docs",
    priority: "low",
    category: "اكتمال الملف",
    title: "استجب لطلبات المستندات بسرعة",
    advice:
      "الموافقة على المخالصات وإخلاء الطرف وشهادات الراتب تسرّع قرارات البنوك وتقلل زمن دورة التمويل.",
    impact: "اكتمال الملف يدعم سرعة الموافقة",
    actionLabel: "مستنداتي",
    href: "/dashboard/documents",
  });

  tips.push({
    id: "tip-salary",
    priority: "medium",
    category: "تحويل الراتب",
    title: "تفعيل تحويل الراتب يعزز الأهلية",
    advice:
      "البنوك تفضّل العملاء بتحويل راتب معتمد من جهة العمل. اطلب من جهة عملك اعتماد التحويل عبر المنصة.",
    impact: "يرفع احتمالية الموافقة والتسعير الأفضل",
  });

  return tips.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
}
