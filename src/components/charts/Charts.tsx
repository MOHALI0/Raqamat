"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0057B8", "#16A34A", "#F59E0B", "#8B5CF6", "#DC2626", "#06B6D4"];

const tooltipStyle = {
  backgroundColor: "var(--bg-secondary)",
  border: "1px solid var(--border-color)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--text-primary)",
};

type Row = Record<string, string | number>;

function ChartBox({ children, height = 260 }: { children: React.ReactNode; height?: number }) {
  return (
    <div style={{ width: "100%", height }} className="min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

export function AreaChartWidget({ data, dataKey }: { data: Row[]; dataKey: string }) {
  return (
    <ChartBox>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0057B8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#0057B8" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey={dataKey} stroke="#0057B8" fill="url(#areaFill)" strokeWidth={2} />
      </AreaChart>
    </ChartBox>
  );
}

export function PieChartWidget({ data }: { data: Row[] }) {
  return (
    <ChartBox>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={0} outerRadius={90} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
      </PieChart>
    </ChartBox>
  );
}

export function DonutChartWidget({ data }: { data: Row[] }) {
  return (
    <ChartBox>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
      </PieChart>
    </ChartBox>
  );
}

export function BarChartWidget({
  data,
  dataKey,
  xKey = "name",
  color = "#0057B8",
}: {
  data: Row[];
  dataKey: string;
  xKey?: string;
  color?: string;
}) {
  return (
    <ChartBox>
      <BarChart data={data}>
        <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartBox>
  );
}

export function VerticalBarChart({
  data,
  dataKey,
  xKey,
}: {
  data: Row[];
  dataKey: string;
  xKey: string;
}) {
  return (
    <ChartBox>
      <BarChart data={data} layout="vertical" margin={{ right: 16 }}>
        <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <YAxis type="category" dataKey={xKey} width={90} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey={dataKey} fill="#0057B8" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ChartBox>
  );
}

export function LineChartWidget({
  data,
  dataKey,
  color = "#0057B8",
}: {
  data: Row[];
  dataKey: string;
  color?: string;
}) {
  return (
    <ChartBox>
      <LineChart data={data}>
        <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ChartBox>
  );
}

export function MultiLineChart({
  data,
  lines,
}: {
  data: Row[];
  lines: { key: string; color: string; name: string }[];
}) {
  return (
    <ChartBox>
      <LineChart data={data}>
        <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        {lines.map((line) => (
          <Line key={line.key} type="monotone" dataKey={line.key} name={line.name} stroke={line.color} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ChartBox>
  );
}

export function FunnelChartWidget({ data }: { data: Row[] }) {
  return (
    <ChartBox>
      <FunnelChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Funnel dataKey="value" data={data} isAnimationActive>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
          <LabelList position="right" fill="var(--text-primary)" stroke="none" dataKey="name" fontSize={12} />
        </Funnel>
      </FunnelChart>
    </ChartBox>
  );
}

export function RadarChartWidget({ data }: { data: Row[] }) {
  return (
    <ChartBox>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--chart-grid)" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
        <Radar name="التقييم" dataKey="value" stroke="#0057B8" fill="#0057B8" fillOpacity={0.3} />
        <Tooltip contentStyle={tooltipStyle} />
      </RadarChart>
    </ChartBox>
  );
}

export function HeatMapChart({ data }: { data: { day: string; hour: string; value: number }[] }) {
  const days = [...new Set(data.map((d) => d.day))];
  const hours = [...new Set(data.map((d) => d.hour))];
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="overflow-x-auto">
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `64px repeat(${hours.length}, minmax(56px, 1fr))` }}>
        <div />
        {hours.map((h) => (
          <div key={h} className="pb-1 text-center text-[10px] text-[var(--text-muted)]">
            {h}
          </div>
        ))}
        {days.map((day) => (
          <div key={day} className="contents">
            <div className="flex items-center text-xs text-[var(--text-muted)]">{day}</div>
            {hours.map((hour) => {
              const cell = data.find((d) => d.day === day && d.hour === hour);
              const intensity = (cell?.value || 0) / max;
              return (
                <div
                  key={`${day}-${hour}`}
                  title={`${day} · ${hour}: ${cell?.value ?? 0}`}
                  className="h-10 rounded-lg"
                  style={{ backgroundColor: `rgba(0, 87, 184, ${0.12 + intensity * 0.75})` }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function NetworkGraph({
  nodes,
  links,
}: {
  nodes: { id: string; label: string; group?: string }[];
  links: { source: string; target: string; value?: number }[];
}) {
  const positions: Record<string, { x: number; y: number }> = {};
  const cx = 180;
  const cy = 130;
  const r = 90;
  nodes.forEach((node, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    positions[node.id] = {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    };
  });

  return (
    <svg viewBox="0 0 360 260" className="h-[260px] w-full">
      {links.map((link, i) => {
        const a = positions[link.source];
        const b = positions[link.target];
        if (!a || !b) return null;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="var(--border-color)"
            strokeWidth={(link.value || 1) + 1}
          />
        );
      })}
      {nodes.map((node) => {
        const p = positions[node.id];
        return (
          <g key={node.id}>
            <circle cx={p.x} cy={p.y} r={18} fill="#0057B8" />
            <text x={p.x} y={p.y + 32} textAnchor="middle" fontSize="11" fill="var(--text-secondary)">
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

interface TimelineItem {
  title: string;
  description?: string;
  date: string;
  status?: "completed" | "current" | "upcoming";
}

export function TimelineWidget({ items }: { items: TimelineItem[] }) {
  const color = {
    completed: "bg-[#16A34A]",
    current: "bg-[#0057B8]",
    upcoming: "bg-[var(--border-color)]",
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="relative flex gap-3 ps-2">
          {i < items.length - 1 && (
            <div className="absolute top-6 bottom-[-16px] right-[11px] w-px bg-[var(--border-color)]" />
          )}
          <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${color[item.status || "completed"]}`} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
              <span className="text-[11px] text-[var(--text-muted)]">{item.date}</span>
            </div>
            {item.description && (
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScoreRing({ score = 0, label = "النتيجة" }: { score?: number; label?: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} stroke="var(--border-color)" strokeWidth="10" fill="none" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#0057B8"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="-mt-[88px] mb-10 text-center">
        <p className="text-2xl font-bold text-[var(--text-primary)]">{score}</p>
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
      </div>
    </div>
  );
}
