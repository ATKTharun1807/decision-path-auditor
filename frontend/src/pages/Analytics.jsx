import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock, Shield, Zap, Sparkles } from 'lucide-react';
import AppLayout from '../components/AppLayout';

const DAILY_DECISIONS = [
  { day: 'Mon', approve: 420, decline: 180, review: 40 },
  { day: 'Tue', approve: 380, decline: 210, review: 55 },
  { day: 'Wed', approve: 510, decline: 160, review: 38 },
  { day: 'Thu', approve: 460, decline: 195, review: 62 },
  { day: 'Fri', approve: 540, decline: 140, review: 45 },
  { day: 'Sat', approve: 290, decline: 110, review: 28 },
  { day: 'Sun', approve: 210, decline: 90,  review: 20 },
];

const TOOL_USAGE = [
  { name: 'credit_bureau_lookup', calls: 847, fill: '#0EA5A4' },
  { name: 'income_verification',  calls: 712, fill: '#3B82F6' },
  { name: 'policy_engine_check',  calls: 923, fill: '#10B981' },
  { name: 'fraud_score_api',      calls: 298, fill: '#F59E0B' },
];

const DECISION_PIE = [
  { name: 'Approve', value: 62, color: '#10B981' },
  { name: 'Decline', value: 29, color: '#DC2626' },
  { name: 'Review',  value: 9,  color: '#F59E0B' },
];

export default function Analytics() {
  return (
    <AppLayout title="Analytics & River Stream">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-[#1E293B]">Decision Analytics & Risk Gauges</h2>
          <p className="text-xs text-slate-500 mt-0.5">Quantitative telemetry across all integrated LLM models.</p>
        </div>
      </div>

      {/* Gauges Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Decision River Rate', value: '401/day', change: '+14%', icon: Activity },
          { label: 'Avg Latency (p95)',    value: '24ms',    change: '-8%',  icon: Clock    },
          { label: 'Compliance Score',    value: '98.2%',   change: '+2pt', icon: Shield   },
          { label: 'Tool Calls/Session',  value: '4.2',     change: '+0.3', icon: Zap      },
        ].map(k => (
          <div key={k.label} className="aurora-card p-5">
            <div className="flex items-center justify-between mb-2">
              <k.icon className="w-4 h-4 text-[#0EA5A4]" />
              <span className="text-xs font-bold text-emerald-600">{k.change}</span>
            </div>
            <p className="font-heading text-2xl font-extrabold text-[#1E293B]">{k.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 aurora-card p-6">
          <h3 className="font-heading font-bold text-sm text-[#1E293B] mb-4">Decision River Flow (Daily)</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={DAILY_DECISIONS} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="approve" name="Approve" fill="#10B981" radius={[4,4,0,0]} />
              <Bar dataKey="decline" name="Decline" fill="#DC2626" radius={[4,4,0,0]} />
              <Bar dataKey="review"  name="Review"  fill="#F59E0B" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="aurora-card p-6 flex flex-col justify-between">
          <h3 className="font-heading font-bold text-sm text-[#1E293B] mb-2">Decision Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={DECISION_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {DECISION_PIE.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {DECISION_PIE.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">{d.name}</span>
                <span className="font-bold text-[#1E293B]">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </AppLayout>
  );
}
