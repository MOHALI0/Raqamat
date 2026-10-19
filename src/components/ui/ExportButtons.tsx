"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "./Button";
import { useToast } from "@/src/context/ToastProvider";

interface ExportButtonsProps {
  filename?: string;
}

export function ExportButtons({ filename = "تقرير" }: ExportButtonsProps) {
  const { toast } = useToast();

  const exportAs = (type: string) => {
    toast(`تم تصدير "${filename}" كـ ${type}`, "success");
  };

  return (
    <div className="flex items-center gap-1.5">
      <Button variant="ghost" size="sm" onClick={() => exportAs("PDF")} title="تصدير PDF">
        <FileText size={14} />
        <span className="hidden sm:inline">PDF</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={() => exportAs("Excel")} title="تصدير Excel">
        <FileSpreadsheet size={14} />
        <span className="hidden sm:inline">Excel</span>
      </Button>
      <Button variant="secondary" size="sm" onClick={() => exportAs("ملف")} title="تصدير">
        <Download size={14} />
      </Button>
    </div>
  );
}
