import React, { useState } from 'react';
import {
  User, Building2, Key, Webhook, Bell, Moon, Sun, Shield,
  Copy, Check, Eye, EyeOff, Save, Trash2, Plus, Globe, Mail, Lock, Sparkles
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const TABS = [
  { id: 'profile',        label: 'Profile',        icon: User      },
  { id: 'organization',   label: 'Organization',   icon: Building2 },
  { id: 'api',            label: 'API Keys',        icon: Key       },
  { id: 'notifications',  label: 'Notifications',  icon: Bell      },
  { id: 'appearance',     label: 'Appearance',      icon: Sun       },
];

const API_KEYS = [
  { id: 'sk-audit-prod-8a9d4f2a',  name: 'Production Server Key', created: '2025-07-01', lastUsed: '2 min ago', active: true  },
  { id: 'sk-audit-dev-3c8b1e4f',   name: 'Local Dev SDK Key',     created: '2025-07-10', lastUsed: '1 hour ago', active: true  },
  { id: 'sk-audit-test-9f4a2b1c',  name: 'CI/CD Test Runner',     created: '2025-06-20', lastUsed: '3 days ago', active: false },
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="btn-aurora-ghost p-1.5" title="Copy Key">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
    </button>
  );
}

function ProfileTab() {
  const [name, setName]   = useState('Tharun Workspace');
  const [email, setEmail] = useState('admin@auditai.dev');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      
      {/* Personal Info */}
      <div className="p-6 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-4">
        <h3 className="font-heading font-extrabold text-sm text-[#1E293B] border-b border-slate-200 pb-2">
          Personal Profile
        </h3>
        
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Display Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input className="aurora-input pl-10" value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input className="aurora-input pl-10" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Account Role</label>
          <div className="relative">
            <Shield className="w-4 h-4 text-[#0EA5A4] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input className="aurora-input pl-10 bg-slate-100/80 font-mono text-xs cursor-not-allowed opacity-80" value="Enterprise Admin" disabled />
          </div>
        </div>
      </div>

      {/* Security & Password */}
      <div className="p-6 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-4">
        <h3 className="font-heading font-extrabold text-sm text-[#1E293B] border-b border-slate-200 pb-2">
          Change Security Password
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input className="aurora-input pl-10" type="password" placeholder="••••••••••••" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input className="aurora-input pl-10" type="password" placeholder="••••••••••••" />
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="btn-aurora text-xs px-6 py-2.5">
        {saved ? <><Check className="w-4 h-4" /> Profile Saved!</> : <><Save className="w-4 h-4" /> Save Profile Changes</>}
      </button>

    </div>
  );
}

function OrgTab() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="p-6 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-4">
        <h3 className="font-heading font-extrabold text-sm text-[#1E293B] border-b border-slate-200 pb-2">
          Organization & Compliance Settings
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Organization Name</label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input className="aurora-input pl-10" defaultValue="Tharun AI Labs" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Domain</label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input className="aurora-input pl-10 font-mono text-xs" defaultValue="https://auditai.dev" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Compliance Framework</label>
          <select className="aurora-input font-medium">
            <option>EU AI Act Article 13 & ISO 42001</option>
            <option>NIST AI Risk Management Framework (RMF)</option>
            <option>US CCPA & HIPAA Privacy Shield</option>
            <option>Global Custom Compliance Rules</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Audit Log Retention Policy</label>
          <select className="aurora-input font-medium">
            <option>90 days (Standard)</option>
            <option>180 days (Enhanced)</option>
            <option>1 Year (Enterprise Compliance)</option>
            <option>Indefinite Immutable Storage</option>
          </select>
        </div>
      </div>

      <button onClick={handleSave} className="btn-aurora text-xs px-6 py-2.5">
        {saved ? <><Check className="w-4 h-4" /> Settings Saved!</> : <><Save className="w-4 h-4" /> Save Organization Settings</>}
      </button>
    </div>
  );
}

function ApiKeysTab() {
  const [keys, setKeys] = useState(API_KEYS);
  const [showKey, setShowKey] = useState({});

  const generateKey = () => {
    const id = `sk-audit-${Math.random().toString(16).slice(2, 10)}`;
    setKeys(k => [...k, { id, name: 'New SDK Agent Key', created: new Date().toISOString().slice(0, 10), lastUsed: 'Never', active: true }]);
  };

  const toggleKey = (id) => {
    setKeys(ks => ks.map(k => k.id === id ? { ...k, active: !k.active } : k));
  };

  const removeKey = (id) => {
    setKeys(ks => ks.filter(k => k.id !== id));
  };

  return (
    <div className="space-y-5 max-w-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-extrabold text-base text-[#1E293B]">API Access Keys</h3>
          <p className="text-xs text-slate-500 mt-0.5">Use these keys to authenticate requests from the Python InstrumentedAgent SDK.</p>
        </div>
        <button onClick={generateKey} className="btn-aurora text-xs">
          <Plus className="w-3.5 h-3.5" /> Generate Key
        </button>
      </div>

      <div className="aurora-card overflow-hidden divide-y divide-slate-100">
        {keys.map((k) => (
          <div key={k.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-xs text-[#1E293B]">{k.name}</span>
                <span className={k.active ? 'badge-aurora-emerald text-[10px]' : 'badge-aurora-red text-[10px]'}>
                  {k.active ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#0EA5A4] bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                  {showKey[k.id] ? k.id : k.id.slice(0, 14) + '••••••••'}
                </span>
                <button onClick={() => setShowKey(s => ({ ...s, [k.id]: !s[k.id] }))} className="btn-aurora-ghost p-1" title="Show Key">
                  {showKey[k.id] ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                <CopyBtn text={k.id} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => toggleKey(k.id)} className="btn-aurora-secondary text-[11px] px-2.5 py-1">
                {k.active ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => removeKey(k.id)} className="btn-aurora-ghost p-1.5 text-rose-500 hover:bg-rose-50">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <span><strong>Security Note:</strong> API keys grant full read/write access to your decision logs. Never commit keys to public GitHub repositories.</span>
      </div>
    </div>
  );
}

function NotifTab() {
  const [prefs, setPrefs] = useState({
    high_risk:   true,
    compliance:  true,
    session_end: false,
    weekly_report: true,
  });

  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  const items = [
    { key: 'high_risk',     label: 'High-Risk Decision Alerts', desc: 'Trigger instant notification when a decision is flagged as high risk.' },
    { key: 'compliance',    label: 'Compliance Threshold Warnings', desc: 'Alert when compliance accuracy drops below 95%.' },
    { key: 'session_end',   label: 'Session Stream Real-time Toast', desc: 'Show toast popups for every incoming decision session.' },
    { key: 'weekly_report', label: 'Weekly Decision Analytics Digest', desc: 'Receive a consolidated summary email every Monday morning.' },
  ];

  return (
    <div className="space-y-4 max-w-xl">
      <h3 className="font-heading font-extrabold text-base text-[#1E293B] mb-2">Notification Preferences</h3>
      
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.key} className="aurora-card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#1E293B]">{item.label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                prefs[item.key] ? 'bg-[#0EA5A4]' : 'bg-slate-300'
              }`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                prefs[item.key] ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppearanceTab() {
  const [theme, setTheme] = useState('aurora');

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h3 className="font-heading font-extrabold text-base text-[#1E293B] mb-4">Workspace UI Theme</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => setTheme('aurora')}
            className={`aurora-card p-4 cursor-pointer border-2 transition-all ${
              theme === 'aurora' ? 'border-[#0EA5A4] bg-teal-50/20 ring-2 ring-[#0EA5A4]/20 shadow-aurora-lg' : 'hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#0EA5A4] text-white flex items-center justify-center mb-3 font-bold text-xs">
              ✦
            </div>
            <h4 className="font-heading font-bold text-xs text-[#1E293B]">Aurora Light (Active)</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Warm white background with Teal accents</p>
          </div>

          <div 
            className="aurora-card p-4 opacity-50 cursor-not-allowed border-2 border-transparent"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3 font-bold text-xs">
              ☾
            </div>
            <h4 className="font-heading font-bold text-xs text-[#1E293B]">Obsidian Dark Mode</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Coming in v2.5 release</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const TAB_CONTENT = {
  profile:       <ProfileTab />,
  organization:  <OrgTab />,
  api:           <ApiKeysTab />,
  notifications: <NotifTab />,
  appearance:    <AppearanceTab />,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <AppLayout title="Settings Workspace">
      
      {/* Top Title Bar */}
      <div className="mb-6">
        <h2 className="font-heading text-xl font-extrabold text-[#1E293B]">Settings Workspace</h2>
        <p className="text-xs text-slate-500 mt-0.5">Configure your account, compliance policies, API keys, and notifications.</p>
      </div>

      {/* Main Settings Card Container */}
      <div className="aurora-card p-6 lg:p-8 bg-white border border-slate-200/90 shadow-aurora">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Vertical Nav Strip (3 cols) */}
          <div className="lg:col-span-3">
            <nav className="space-y-1">
              {TABS.map(t => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                      active
                        ? 'bg-teal-50 text-[#0EA5A4] border border-teal-200/80 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#0EA5A4]' : 'text-slate-400'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Content Area (9 cols) */}
          <div className="lg:col-span-9">
            {TAB_CONTENT[activeTab]}
          </div>

        </div>
      </div>

    </AppLayout>
  );
}
