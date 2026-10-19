/** بيانات تجريبية أدق لمحاكاة منصة هوية مالية سعودية */

export const currentCustomer = {
  id: "C-10482",
  name: "أحمد بن محمد العتيبي",
  job: "مدير مالي أول",
  email: "ahmed.otaibi@email.sa",
  phone: "+966 50 123 4567",
  nationalIdMasked: "1***********84",
  employer: "شركة النخبة للتجارة",
  employmentType: "موظف قطاع خاص",
  yearsAtEmployer: 6,
  city: "الرياض",
  monthlyIncome: 28500,
  annualIncome: 342000,
  otherIncome: 4200,
  availableBalance: 124580,
  totalWealth: 892400,
  purchasingPower: 156750,
  creditScore: 742,
  simahScoreBand: "جيد جداً",
  identityScore: 91,
  commitmentRatio: 34.2,
  spendingRatio: 61.8,
  debtToIncome: 34.2,
  familyMembers: 4,
  dependents: 2,
  financialStatus: "مستقر",
  riskLevel: "منخفض",
  products: ["حساب جاري", "بطاقة ائتمان", "تمويل شخصي"],
  eligibleProducts: 5,
  acceptanceRate: 87,
  expectedCreditLimit: 148000,
  utilizationRate: 41.3,
  onTimePaymentRate: 98.6,
  lastReviewDate: "12 يوليو 2026",
};

export const mainKpis = [
  { title: "العملاء المفعّلون", value: "12,486", icon: "users" as const, trend: "up" as const, change: "+6.4%" },
  { title: "طلبات تمويل مفتوحة", value: "318", icon: "files" as const, trend: "up" as const, change: "+14%" },
  { title: "تنبيهات AML مفتوحة", value: "17", icon: "alert" as const, trend: "down" as const, change: "-9%" },
  { title: "متوسط SIMAH", value: "724", icon: "score" as const, trend: "up" as const, change: "+5" },
  { title: "حجم العروض/شهر", value: "١٨٦ م", icon: "income" as const, trend: "up" as const, change: "+7.8%" },
  { title: "متوسط DTI", value: "36.4%", icon: "percent" as const, trend: "down" as const, change: "-1.1%" },
];

const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

export const customerGrowthData = [
  { month: "يناير", customers: 9840 },
  { month: "فبراير", customers: 10012 },
  { month: "مارس", customers: 10340 },
  { month: "أبريل", customers: 10680 },
  { month: "مايو", customers: 10995 },
  { month: "يونيو", customers: 11340 },
  { month: "يوليو", customers: 11720 },
  { month: "أغسطس", customers: 11980 },
  { month: "سبتمبر", customers: 12110 },
  { month: "أكتوبر", customers: 12240 },
  { month: "نوفمبر", customers: 12355 },
  { month: "ديسمبر", customers: 12486 },
];

export const incomeSourceData = [
  { name: "راتب أساسي", value: 68 },
  { name: "بدلات", value: 14 },
  { name: "استثمارات", value: 11 },
  { name: "دخل إضافي", value: 7 },
];

export const commitmentRatioData = [
  { name: "تمويل سكني", ratio: 18.4 },
  { name: "تمويل شخصي", ratio: 8.1 },
  { name: "بطاقة ائتمان", ratio: 4.6 },
  { name: "تمويل سيارة", ratio: 2.1 },
  { name: "أخرى", ratio: 1.0 },
];

export const riskIndexData = months.map((month, i) => ({
  month,
  risk: Math.round(22 + Math.sin(i / 2.2) * 5 + (i % 3) * 1.4),
}));

export const bankProductsData = [
  { name: "حسابات جارية", value: 4280 },
  { name: "بطاقات ائتمان", value: 2915 },
  { name: "تمويل شخصي", value: 1640 },
  { name: "تمويل عقاري", value: 980 },
  { name: "تمويل سيارات", value: 720 },
  { name: "تمويل أعمال", value: 410 },
];

export const monthlyActivityData = [
  { month: "يناير", deposits: 412, withdrawals: 268, transfers: 184 },
  { month: "فبراير", deposits: 438, withdrawals: 274, transfers: 191 },
  { month: "مارس", deposits: 465, withdrawals: 289, transfers: 205 },
  { month: "أبريل", deposits: 451, withdrawals: 301, transfers: 198 },
  { month: "مايو", deposits: 492, withdrawals: 312, transfers: 220 },
  { month: "يونيو", deposits: 518, withdrawals: 328, transfers: 236 },
  { month: "يوليو", deposits: 540, withdrawals: 335, transfers: 248 },
  { month: "أغسطس", deposits: 556, withdrawals: 341, transfers: 255 },
];

export const recentTransactions = [
  { id: "TX-90241", customer: "أحمد العتيبي", type: "تحويل محلي", amount: 12500, status: "مكتمل", date: "15 يوليو 2026", risk: "منخفض" },
  { id: "TX-90238", customer: "سارة القحطاني", type: "إيداع راتب", amount: 19200, status: "مكتمل", date: "15 يوليو 2026", risk: "منخفض" },
  { id: "TX-90231", customer: "خالد الشمري", type: "سحب صراف", amount: 3500, status: "قيد المراجعة", date: "14 يوليو 2026", risk: "متوسط" },
  { id: "TX-90222", customer: "نورة الحربي", type: "تحويل دولي", amount: 28500, status: "معلق", date: "14 يوليو 2026", risk: "مرتفع" },
  { id: "TX-90215", customer: "فهد الدوسري", type: "سداد قسط", amount: 4850, status: "مكتمل", date: "13 يوليو 2026", risk: "منخفض" },
  { id: "TX-90208", customer: "لمياء العنزي", type: "مشتريات بطاقة", amount: 1670, status: "مكتمل", date: "13 يوليو 2026", risk: "منخفض" },
  { id: "TX-90197", customer: "هند الغامدي", type: "تحويل ادخاري", amount: 10000, status: "مكتمل", date: "12 يوليو 2026", risk: "منخفض" },
];

export const notifications = [
  { id: 1, title: "تنبيه AML", message: "تحويل دولي لـ نورة الحربي يتجاوز حد المراقبة اليومي", time: "منذ 12 دقيقة", type: "danger" as const, read: false },
  { id: 2, title: "طلب تمويل جديد", message: "هند الغامدي طلبت عروضاً لتمويل عقاري بقيمة 850,000 ر.س", time: "منذ 45 دقيقة", type: "success" as const, read: false },
  { id: 3, title: "عرض بانتظار العميل", message: "عرض بنك رقمات لأحمد العتيبي بانتظار القبول", time: "منذ ساعتين", type: "info" as const, read: false },
  { id: 4, title: "تحديث ملف", message: "تم التحقق من مستندات KYC لـ 5 عملاء اليوم", time: "منذ 3 ساعات", type: "info" as const, read: true },
  { id: 5, title: "انخفاض مؤشر المخاطر", message: "مؤشر المخاطر التشغيلي انخفض إلى 24 نقطة", time: "أمس", type: "warning" as const, read: true },
  { id: 6, title: "تقرير جاهز", message: "تقرير تحويل الطلبات إلى عروض — يوليو 2026", time: "أمس", type: "success" as const, read: false },
];

export const customersList = [
  { id: "C-10482", name: "محسن بن مانع ال حبان", score: 742, income: 28500, risk: "منخفض" as const, status: "نشط" as const, city: "الرياض", dti: 34.2, employer: "شركة النخبة للتجارة", employerId: "emp-1" },
  { id: "C-10491", name: "عبدالمانع عبدالله اليامي", score: 698, income: 19200, risk: "منخفض" as const, status: "نشط" as const, city: "جدة", dti: 31.0, employer: "أرامكو السعودية", employerId: "emp-2" },
  { id: "C-10503", name: "خالد سعد الشمري", score: 612, income: 15400, risk: "متوسط" as const, status: "مراجعة" as const, city: "الدمام", dti: 42.5, employer: "شركة النخبة للتجارة", employerId: "emp-1" },
  { id: "C-10517", name: "نورة فهد الحربي", score: 521, income: 9800, risk: "مرتفع" as const, status: "معلق" as const, city: "المدينة", dti: 51.8, employer: "وزارة التعليم", employerId: "emp-3" },
  { id: "C-10524", name: "فهد ناصر الدوسري", score: 771, income: 42000, risk: "منخفض" as const, status: "نشط" as const, city: "الظهران", dti: 28.0, employer: "شركة النخبة للتجارة", employerId: "emp-1" },
  { id: "C-10531", name: "لمياء حسن العنزي", score: 655, income: 16800, risk: "متوسط" as const, status: "نشط" as const, city: "الرياض", dti: 38.4, employer: "شركة تقنية وطنية", employerId: "emp-4" },
  { id: "C-10538", name: "عمر يوسف المطيري", score: 589, income: 11200, risk: "متوسط" as const, status: "مراجعة" as const, city: "بريدة", dti: 44.1, employer: "شركة النخبة للتجارة", employerId: "emp-1" },
  { id: "C-10545", name: "هند راشد الغامدي", score: 804, income: 51000, risk: "منخفض" as const, status: "نشط" as const, city: "الرياض", dti: 22.0, employer: "أرامكو السعودية", employerId: "emp-2" },
  { id: "C-10552", name: "ماجد علي الزهراني", score: 710, income: 24500, risk: "منخفض" as const, status: "نشط" as const, city: "أبها", dti: 29.6, employer: "شركة النخبة للتجارة", employerId: "emp-1" },
  { id: "C-10560", name: "ريم سعد الشهري", score: 634, income: 13900, risk: "متوسط" as const, status: "نشط" as const, city: "الطائف", dti: 36.9, employer: "وزارة التعليم", employerId: "emp-3" },
];

export const salesFunnelData = [
  { name: "طلبات تلقي عروض", value: 1280 },
  { name: "ملفات مكتملة", value: 940 },
  { name: "عروض مقدمة", value: 610 },
  { name: "عروض قيد القرار", value: 265 },
  { name: "عقود مُغلقة", value: 118 },
];

export const topProductsData = [
  { product: "تمويل شخصي", count: 186 },
  { product: "تمويل سيارة", count: 124 },
  { product: "بطاقة ائتمان", count: 98 },
  { product: "تمويل عقاري", count: 67 },
  { product: "تمويل أعمال", count: 41 },
];

export const approvalProbabilityData = [
  { month: "يناير", probability: 71 },
  { month: "فبراير", probability: 73 },
  { month: "مارس", probability: 74 },
  { month: "أبريل", probability: 76 },
  { month: "مايو", probability: 78 },
  { month: "يونيو", probability: 81 },
  { month: "يوليو", probability: 84 },
  { month: "أغسطس", probability: 86 },
];

export const closeRateData = [
  { month: "يناير", rate: 16.2 },
  { month: "فبراير", rate: 17.1 },
  { month: "مارس", rate: 18.4 },
  { month: "أبريل", rate: 19.0 },
  { month: "مايو", rate: 20.5 },
  { month: "يونيو", rate: 21.8 },
  { month: "يوليو", rate: 22.9 },
  { month: "أغسطس", rate: 24.1 },
];

export const salesRecommendations = [
  { product: "تمويل شخصي", match: 92, reason: "DTI 34% وتصنيف 742 ضمن شريحة الموافقة العالية" },
  { product: "بطاقة بلاتينية", match: 84, reason: "معدل استخدام البطاقة الحالي 41% مع سجل سداد ممتاز" },
  { product: "تمويل سيارة", match: 79, reason: "قدرة قسط تقديري ضمن 25% من الدخل الشهري" },
];

export const marketingRecommendations = [
  { product: "تمويل عقاري", match: 81, reason: "ثروة صافية مرتفعة واستقرار وظيفي 6 سنوات" },
  { product: "بطاقة سفر", match: 76, reason: "نمط إنفاق على السفر/الترفيه أعلى من المتوسط" },
  { product: "تأمين عائلي", match: 74, reason: "4 أفراد أسرة ودخل شهري مستقر" },
  { product: "محفظة استثمار", match: 70, reason: "رصيد متاح > 100 ألف مع ملف مخاطر منخفض" },
];

export const customerJourney = [
  { title: "فتح الحساب الجاري", description: "تفعيل الهوية المالية الموحدة", date: "يناير 2024", status: "completed" as const },
  { title: "إصدار بطاقة ائتمان", description: "حد ابتدائي 25,000 ر.س", date: "مارس 2024", status: "completed" as const },
  { title: "تمويل شخصي", description: "80,000 ر.س / 36 شهراً", date: "سبتمبر 2024", status: "completed" as const },
  { title: "طلب تلقي عروض", description: "تمويل شخصي 120,000 ر.س", date: "يوليو 2026", status: "current" as const },
  { title: "مقارنة العروض", description: "عروض من بنكين بانتظار القرار", date: "جارٍ", status: "upcoming" as const },
];

export const amlKpis = [
  { title: "AML Score", value: "91%", status: "نظيف", color: "success" as const },
  { title: "تنبيهات نشطة", value: "1", status: "مراجعة", color: "warning" as const },
  { title: "عمليات عالية المخاطر", value: "0", status: "آمن", color: "success" as const },
  { title: "شبكات مرتبطة", value: "3", status: "طبيعي", color: "primary" as const },
  { title: "توثيق الهوية", value: "100%", status: "موثق", color: "success" as const },
  { title: "آخر مراجعة", value: "3 أيام", status: "حديث", color: "primary" as const },
];

export const amlTimeline = [
  { title: "تحويل محلي", description: "12,500 ر.س إلى حساب محلي", date: "15 يوليو 09:20", status: "completed" as const },
  { title: "إيداع راتب", description: "28,500 ر.س من جهة العمل", date: "01 يوليو 08:00", status: "completed" as const },
  { title: "تنبيه مراجعة", description: "تحويل دولي فوق الحد اليومي", date: "28 يونيو 14:45", status: "current" as const },
  { title: "سحب نقدي", description: "5,000 ر.س من جهاز صراف", date: "25 يونيو 19:10", status: "completed" as const },
];

export const heatMapData = [
  { day: "أحد", hour: "صباح", value: 12 },
  { day: "أحد", hour: "ظهر", value: 28 },
  { day: "أحد", hour: "مساء", value: 45 },
  { day: "اثنين", hour: "صباح", value: 35 },
  { day: "اثنين", hour: "ظهر", value: 52 },
  { day: "اثنين", hour: "مساء", value: 38 },
  { day: "ثلاثاء", hour: "صباح", value: 30 },
  { day: "ثلاثاء", hour: "ظهر", value: 48 },
  { day: "ثلاثاء", hour: "مساء", value: 41 },
  { day: "أربعاء", hour: "صباح", value: 33 },
  { day: "أربعاء", hour: "ظهر", value: 55 },
  { day: "أربعاء", hour: "مساء", value: 36 },
  { day: "خميس", hour: "صباح", value: 40 },
  { day: "خميس", hour: "ظهر", value: 62 },
  { day: "خميس", hour: "مساء", value: 50 },
  { day: "جمعة", hour: "صباح", value: 18 },
  { day: "جمعة", hour: "ظهر", value: 22 },
  { day: "جمعة", hour: "مساء", value: 70 },
  { day: "سبت", hour: "صباح", value: 25 },
  { day: "سبت", hour: "ظهر", value: 44 },
  { day: "سبت", hour: "مساء", value: 58 },
];

export const networkNodes = [
  { id: "c1", label: "أحمد العتيبي", group: "customer" },
  { id: "e1", label: "جهة العمل", group: "entity" },
  { id: "b1", label: "حساب فرعي", group: "account" },
  { id: "p1", label: "مستفيد 1", group: "person" },
  { id: "p2", label: "مستفيد 2", group: "person" },
];

export const networkLinks = [
  { source: "c1", target: "e1", value: 3 },
  { source: "c1", target: "b1", value: 2 },
  { source: "c1", target: "p1", value: 1 },
  { source: "b1", target: "p2", value: 1 },
];

export const incomeGrowthData = [
  { month: "يناير", income: 24800 },
  { month: "فبراير", income: 25200 },
  { month: "مارس", income: 25800 },
  { month: "أبريل", income: 26100 },
  { month: "مايو", income: 26800 },
  { month: "يونيو", income: 27400 },
  { month: "يوليو", income: 28000 },
  { month: "أغسطس", income: 28250 },
  { month: "سبتمبر", income: 28400 },
  { month: "أكتوبر", income: 28450 },
  { month: "نوفمبر", income: 28500 },
  { month: "ديسمبر", income: 28500 },
];

export const amlAlerts = [
  { id: 1, title: "تحويل دولي مرتفع", severity: "warning" as const, time: "28 يونيو", message: "تجاوز الحد اليومي للتحويلات الدولية" },
  { id: 2, title: "نشاط غير معتاد", severity: "info" as const, time: "20 يونيو", message: "زيادة في عدد العمليات المسائية" },
  { id: 3, title: "تحقق هوية", severity: "success" as const, time: "15 يونيو", message: "تم تجديد وثائق الهوية بنجاح" },
];

export const complianceStatus = [
  { label: "KYC", status: "مكتمل" as const, progress: 100 },
  { label: "PEP Check", status: "مكتمل" as const, progress: 100 },
  { label: "Sanctions", status: "مكتمل" as const, progress: 100 },
  { label: "Transaction Monitoring", status: "قيد المراجعة" as const, progress: 75 },
  { label: "Source of Funds", status: "مكتمل" as const, progress: 100 },
];

export const radarData = [
  { subject: "الائتمان", value: 85, fullMark: 100 },
  { subject: "الدخل", value: 78, fullMark: 100 },
  { subject: "الالتزام", value: 66, fullMark: 100 },
  { subject: "الادخار", value: 72, fullMark: 100 },
  { subject: "المخاطر", value: 88, fullMark: 100 },
  { subject: "النشاط", value: 70, fullMark: 100 },
];

export const customerInsights = [
  { title: "سلوك ادخاري إيجابي", description: "يزيد الرصيد المتاح بمعدل ~4,800 ر.س شهرياً", type: "positive" as const },
  { title: "فرصة تمويل سكني", description: "القدرة الشرائية تدعم تمويلاً عقارياً حتى ~850 ألف", type: "opportunity" as const },
  { title: "جاهزية لطلب عروض", description: "ملف مكتمل بنسبة 96% ومؤهل لـ 5 منتجات", type: "opportunity" as const },
];

export const spendingAnalysis = [
  { category: "سكن", amount: 6500 },
  { category: "مواصلات", amount: 1850 },
  { category: "تسوق", amount: 3120 },
  { category: "تعليم", amount: 2100 },
  { category: "ترفيه", amount: 1480 },
  { category: "فواتير", amount: 920 },
  { category: "أخرى", amount: 640 },
];

export const wealthGrowthData = [
  { month: "يناير", wealth: 712000 },
  { month: "فبراير", wealth: 728500 },
  { month: "مارس", wealth: 746200 },
  { month: "أبريل", wealth: 761800 },
  { month: "مايو", wealth: 782400 },
  { month: "يونيو", wealth: 804100 },
  { month: "يوليو", wealth: 825600 },
  { month: "أغسطس", wealth: 841200 },
  { month: "سبتمبر", wealth: 856800 },
  { month: "أكتوبر", wealth: 869400 },
  { month: "نوفمبر", wealth: 881000 },
  { month: "ديسمبر", wealth: 892400 },
];

export const creditScoreHistory = [
  { month: "يناير", score: 698 },
  { month: "فبراير", score: 704 },
  { month: "مارس", score: 709 },
  { month: "أبريل", score: 715 },
  { month: "مايو", score: 721 },
  { month: "يونيو", score: 726 },
  { month: "يوليو", score: 731 },
  { month: "أغسطس", score: 734 },
  { month: "سبتمبر", score: 736 },
  { month: "أكتوبر", score: 738 },
  { month: "نوفمبر", score: 740 },
  { month: "ديسمبر", score: 742 },
];

export const documents = [
  { name: "الهوية الوطنية", date: "سارية حتى 12/2029", status: "موثق", icon: "id-card" as const },
  { name: "عنوان وطني", date: "محدّث يوليو 2026", status: "موثق", icon: "file-text" as const },
  { name: "عقد العمل", date: "ساري منذ 2020", status: "موثق", icon: "file-signature" as const },
  { name: "تعريف بالراتب", date: "يوليو 2026", status: "محدث", icon: "receipt" as const },
];

export const financialTimeline = [
  { title: "إيداع راتب", description: "28,500 ر.س", date: "1 يوليو 2026", status: "completed" as const },
  { title: "سداد قسط تمويل", description: "تمويل شخصي — 2,450 ر.س", date: "5 يوليو 2026", status: "completed" as const },
  { title: "طلب عروض تمويل", description: "تمويل شخصي 120,000 ر.س", date: "14 يوليو 2026", status: "current" as const },
  { title: "مقارنة العروض", description: "عروض بنكية بانتظار قرارك", date: "15 يوليو 2026", status: "upcoming" as const },
];

export const clientRecommendations = [
  { icon: "trending-up", title: "زيادة الادخار", description: "حوّل 10% من الراتب تلقائياً لحساب ادخار" },
  { icon: "minus-circle", title: "خفض استخدام البطاقة", description: "الاستخدام الحالي 41% — الأنسب تحت 30%" },
  { icon: "star", title: "قارن عروض التمويل", description: "لديك عروض نشطة بانتظار القرار" },
  { icon: "lightbulb", title: "فرصة استثمار", description: "محفظة منخفضة المخاطر تناسب ملفك" },
];

export const reportsList = [
  { id: "RPT-2401", name: "تقرير الامتثال الشهري", type: "امتثال", date: "1 يوليو 2026", status: "جاهز" as const },
  { id: "RPT-2402", name: "مؤشر المخاطر العام", type: "مخاطر", date: "30 يونيو 2026", status: "جاهز" as const },
  { id: "RPT-2403", name: "ملخص تنبيهات AML", type: "AML", date: "28 يونيو 2026", status: "جاهز" as const },
  { id: "RPT-2404", name: "تحويل الطلبات إلى عروض", type: "مبيعات", date: "25 يونيو 2026", status: "قيد الإعداد" as const },
  { id: "RPT-2405", name: "تحليل شريحة العملاء المؤهلين", type: "عملاء", date: "20 يونيو 2026", status: "جاهز" as const },
  { id: "RPT-2406", name: "تقرير العقوبات والقوائم", type: "AML", date: "15 يونيو 2026", status: "قيد الإعداد" as const },
];

export const permissions = [
  { role: "مدير النظام", users: 4, access: ["كامل الصلاحيات", "إدارة المستخدمين", "الإعدادات"], color: "danger" as const },
  { role: "محلل AML", users: 12, access: ["AML", "تقارير", "تنبيهات"], color: "warning" as const },
  { role: "موظف تسويق", users: 28, access: ["تسويق", "عملاء", "عروض"], color: "success" as const },
  { role: "موظف مبيعات", users: 45, access: ["مبيعات", "طلبات تمويل", "عملاء"], color: "primary" as const },
  { role: "مشاهد تقارير", users: 18, access: ["تقارير", "لوحة التحكم"], color: "primary" as const },
];
