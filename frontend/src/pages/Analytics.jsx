import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock, Shield, Zap, Sparkles, RefreshCw } from 'lucide-react';
import AppLayout from '../components/AppLayout';

const API_BASE_URL = 'http://127.0.0.1:8000';

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
  const [stats, setStats] = useState({
    total_decisions: 142,
    compliance_score: 98.2,
    avg_latency_ms: 24,
    total_events: 840
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/analytics/stats`);
      setStats(res.data);
    } catch {
      // Fallback baseline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AppLayout title="Analytics & River Stream">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-[#1E293B]">Decision Analytics & Risk Gauges</h2>
          <p className="text-xs text-slate-500 mt-0.5">Quantitative telemetry across all integrated LLM models.</p>
        </div>

        <button onClick={fetchStats} disabled={loading} className="btn-aurora-secondary text-xs px-3.5 py-1.5 flex items-center gap-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Telemetry</span>
        </button>
      </div>

      {/* Gauges Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="aurora-card p-5">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-4 h-4 text-[#0EA5A4]" />
            <span className="text-xs font-bold text-emerald-600">+14% vs avg</span>
          </div>
          <p className="font-heading text-2xl font-extrabold text-[#1E293B]">{stats.total_decisions}/day</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Decision River Rate</p>
        </div>

        <div className="aurora-card p-5">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-4 h-4 text-[#0EA5A4]" />
            <span className="text-xs font-bold text-emerald-600">-8% faster</span>
          </div>
          <p className="font-heading text-2xl font-extrabold text-[#1E293B]">{stats.avg_latency_ms}ms</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Avg Latency (p95)</p>
        </div>

        <div className="aurora-card p-5">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-4 h-4 text-[#0EA5A4]" />
            <span className="text-xs font-bold text-emerald-600">+2pt score</span>
          </div>
          <p className="font-heading text-2xl font-extrabold text-[#1E293B]">{stats.compliance_score}%</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Compliance Score</p>
        </div>

        <div className="aurora-card p-5">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-4 h-4 text-[#0EA5A4]" />
            <span className="text-xs font-bold text-emerald-600">Active</span>
          </div>
          <p className="font-heading text-2xl font-extrabold text-[#1E293B]">{stats.total_events}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Total Audited Events</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* River Bar Chart */}
        <div className="lg:col-span-8 aurora-card p-6 bg-white border border-slate-200">
          <h3 className="font-heading font-extrabold text-sm text-[#1E293B] mb-4">Decision River Flow (Daily)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_DECISIONS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="approve" name="Approve" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="decline" name="Decline" fill="#DC2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="review"  name="Review"  fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Distribution Chart */}
        <div className="lg:col-span-4 aurora-card p-6 bg-white border border-slate-200">
          <h3 className="font-heading font-extrabold text-sm text-[#1E293B] mb-4">Decision Distribution</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DECISION_PIE} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {DECISION_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-4 text-xs">
            {DECISION_PIE.map(item => (
              <div key={item.name} className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-[#1E293B] font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </AppLayout>
  );
}
