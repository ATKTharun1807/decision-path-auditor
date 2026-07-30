import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock, Shield, Zap } from 'lucide-react';
import AppLayout from '../components/AppLayout';

/* ─── Chart data ─────────────────────────────────────────── */
const DAILY_DECISIONS = [
  { day: 'Mon', approve: 420, decline: 180, review: 40 },
  { day: 'Tue', approve: 380, decline: 210, review: 55 },
  { day: 'Wed', approve: 510, decline: 160, review: 38 },
  { day: 'Thu', approve: 460, decline: 195, review: 62 },
  { day: 'Fri', approve: 540, decline: 140, review: 45 },
  { day: 'Sat', approve: 290, decline: 110, review: 28 },
  { day: 'Sun', approve: 210, decline: 90,  review: 20 },
];

const LATENCY = [
  { time: '00:00', p50: 8,  p95: 24 },
  { time: '04:00', p50: 6,  p95: 18 },
  { time: '08:00', p50: 14, p95: 42 },
  { time: '12:00', p50: 18, p95: 55 },
  { time: '16:00', p50: 12, p95: 38 },
  { time: '20:00', p50: 9,  p95: 28 },
  { time: '23:59', p50: 7,  p95: 20 },
];

const TOOL_USAGE = [
  { name: 'credit_bureau_lookup', calls: 847, fill: '#6366f1' },
  { name: 'income_verification',  calls: 712, fill: '#8b5cf6' },
  { name: 'policy_engine_check',  calls: 923, fill: '#06b6d4' },
  { name: 'employment_check',     calls: 431, fill: '#10b981' },
  { name: 'fraud_score_api',      calls: 298, fill: '#f59e0b' },
];

const DECISION_PIE = [
  { name: 'Approve', value: 62, color: '#22c55e' },
  { name: 'Decline', value: 29, color: '#ef4444' },
  { name: 'Review',  value: 9,  color: '#f59e0b' },
];

const COMPLIANCE_TREND = [
  { week: 'W1', score: 91 },
  { week: 'W2', score: 93 },
  { week: 'W3', score: 94 },
  { week: 'W4', score: 96 },
  { week: 'W5', score: 95 },
  { week: 'W6', score: 98 },
];

const RANGE_OPTIONS = ['Last 7 days', 'Last 30 days', 'Last 90 days'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-card-hover px-3 py-2.5 text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [range, setRange] = useState('Last 7 days');

  return (
    <AppLayout title="Analytics">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Decision trends, tool usage, and compliance metrics.</p>
        </div>
        <div className="flex rounded-xl border border-border overflow-hidden">
          {RANGE_OPTIONS.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${range === r ? 'bg-indigo-600 text-white' : 'bg-white text-muted-foreground hover:bg-muted'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Avg decisions/day', value: '401',   change: '+14%', up: true,  icon: Activity  },
          { label: 'Avg latency (p95)', value: '32ms',  change: '-8%',  up: true,  icon: Clock     },
          { label: 'Compliance score',  value: '98%',   change: '+2pt', up: true,  icon: Shield    },
          { label: 'Tool calls/session', value: '4.2',  change: '+0.3', up: true,  icon: Zap       },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-4 h-4 text-indigo-500" />
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${k.up ? 'text-green-600' : 'text-red-500'}`}>
                  {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {k.change}
                </span>
              </div>
              <p className="font-heading text-2xl font-bold text-foreground">{k.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Row 1: Decision trend + Pie */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Decision Trend (Daily)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DAILY_DECISIONS} barSize={14} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="approve" name="Approve" fill="#22c55e" radius={[3,3,0,0]} />
              <Bar dataKey="decline" name="Decline" fill="#ef4444" radius={[3,3,0,0]} />
              <Bar dataKey="review"  name="Review"  fill="#f59e0b" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5 flex flex-col">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Decision Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={DECISION_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {DECISION_PIE.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-auto space-y-2 pt-3">
            {DECISION_PIE.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-semibold text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Latency + Tool usage */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="card p-5">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Latency (ms) — Today</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={LATENCY}>
              <defs>
                <linearGradient id="p50" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="p95" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="ms" />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="p50" name="p50" stroke="#6366f1" fill="url(#p50)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="p95" name="p95" stroke="#8b5cf6" fill="url(#p95)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Top Tool Calls</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TOOL_USAGE} layout="vertical" barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calls" name="Calls" radius={[0,4,4,0]}>
                {TOOL_USAGE.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Compliance trend */}
      <div className="card p-5">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Compliance Score Trend (6 weeks)</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={COMPLIANCE_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="score" name="Score" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AppLayout>
  );
}
