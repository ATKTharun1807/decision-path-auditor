import React, { useState } from 'react';
import {
  User, Building2, Key, Webhook, Bell, Moon, Sun, Shield,
  Copy, Check, Eye, EyeOff, Save, Trash2, Plus, Globe, Mail
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const TABS = [
  { id: 'profile',        label: 'Profile',        icon: User      },
  { id: 'organization',   label: 'Organization',   icon: Building2 },
  { id: 'api',            label: 'API Keys',        icon: Key       },
  { id: 'notifications',  label: 'Notifications',  icon: Bell      },
  { id: 'appearance',     label: 'Appearance',      icon: Moon      },
];

const API_KEYS = [
  { id: 'sk-audit-prod-...a4f9',  name: 'Production',  created: '2025-07-01', lastUsed: '2 min ago', active: true  },
  { id: 'sk-audit-dev-...c2e1',   name: 'Development', created: '2025-07-10', lastUsed: '1 day ago', active: true  },
  { id: 'sk-audit-test-...88b3',  name: 'Testing',     created: '2025-06-20', lastUsed: 'Never',     active: false },
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="btn-ghost p-1.5" title="Copy">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function ProfileTab() {
  const [name, setName]   = useState('Tharun');
  const [email, setEmail] = useState('tharun@company.com');
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h3 className="font-heading font-semibold text-base text-foreground mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Display name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
            <input className="input" value="Admin" disabled className="opacity-60 cursor-not-allowed" />
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-heading font-semibold text-base text-foreground mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Current password</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">New password</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
        </div>
      </div>
      <button onClick={save} className="btn-primary text-sm">
        {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save changes</>}
      </button>
    </div>
  );
}

function OrgTab() {
  return (
    <div className="space-y-6 max-w-lg">
      <h3 className="font-heading font-semibold text-base text-foreground mb-4">Organization Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Organization name</label>
          <input className="input" defaultValue="Tharun AI Labs" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website</div>
          </label>
          <input className="input" defaultValue="https://auditai.dev" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Compliance region</label>
          <select className="input">
            <option>European Union (GDPR)</option>
            <option>United States (CCPA)</option>
            <option>United Kingdom</option>
            <option>Global</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Data retention</label>
          <select className="input">
            <option>90 days</option>
            <option>180 days</option>
            <option>1 year</option>
            <option>Forever</option>
          </select>
        </div>
      </div>
      <button className="btn-primary text-sm"><Save className="w-4 h-4" /> Save changes</button>
    </div>
  );
}

function ApiKeysTab() {
  const [keys, setKeys] = useState(API_KEYS);
  const [show, setShow] = useState({});
  const addKey = () => {
    const id = `sk-audit-new-...${Math.random().toString(16).slice(2,6)}`;
    setKeys(k => [...k, { id, name: 'New key', created: new Date().toISOString().slice(0,10), lastUsed: 'Never', active: true }]);
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold text-base text-foreground">API Keys</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Use these keys to authenticate requests to the AuditAI API.</p>
        </div>
        <button onClick={addKey} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Generate key</button>
      </div>
      <div className="card overflow-hidden">
        {keys.map((k, i) => (
          <div key={k.id} className={`flex items-center gap-4 px-5 py-4 ${i < keys.length-1 ? 'border-b border-border' : ''}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-medium text-sm text-foreground">{k.name}</span>
                {k.active ? <span className="badge-green">Active</span> : <span className="badge-gray">Inactive</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {show[k.id] ? k.id : k.id.replace(/[^.]/g, '•').slice(0, 16) + '...'}
                </span>
                <button onClick={() => setShow(s => ({ ...s, [k.id]: !s[k.id] }))} className="btn-ghost p-0.5">
                  {show[k.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
                <CopyBtn text={k.id} />
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Created {k.created}</p>
              <p>Last used {k.lastUsed}</p>
            </div>
            <button onClick={() => setKeys(ks => ks.filter(x => x.id !== k.id))} className="btn-ghost p-2 text-muted-foreground hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
        <strong>Important:</strong> Store your API keys securely. They will not be shown again after creation.
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
    email_digest: false,
  });
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));
  const items = [
    { key: 'high_risk',     label: 'High-risk decisions',      desc: 'Alert when a decision is flagged as high risk.'           },
    { key: 'compliance',    label: 'Compliance threshold',      desc: 'Alert when compliance score drops below 90%.'            },
    { key: 'session_end',   label: 'Session completed',         desc: 'Notify when each audit session finishes.'               },
    { key: 'weekly_report', label: 'Weekly digest report',      desc: 'Receive a weekly summary of decision analytics.'        },
    { key: 'email_digest',  label: 'Email digest',              desc: 'Get daily summaries in your inbox.'                     },
  ];
  return (
    <div className="space-y-3 max-w-lg">
      <h3 className="font-heading font-semibold text-base text-foreground mb-4">Notification Preferences</h3>
      {items.map(item => (
        <div key={item.key} className="card p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
          <button
            onClick={() => toggle(item.key)}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${prefs[item.key] ? 'bg-indigo-600' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${prefs[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      ))}
    </div>
  );
}

function AppearanceTab() {
  const [theme, setTheme] = useState('light');
  const [density, setDensity] = useState('comfortable');
  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h3 className="font-heading font-semibold text-base text-foreground mb-4">Theme</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'light', icon: Sun,  label: 'Light' },
            { id: 'dark',  icon: Moon, label: 'Dark (coming soon)', disabled: true },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => !t.disabled && setTheme(t.id)}
                disabled={t.disabled}
                className={`card p-4 flex items-center gap-3 border-2 transition-all ${theme === t.id ? 'border-indigo-500 bg-indigo-50/30' : 'border-transparent'} ${t.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-indigo-200'}`}
              >
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="font-heading font-semibold text-base text-foreground mb-4">Density</h3>
        <div className="grid grid-cols-3 gap-3">
          {['compact', 'comfortable', 'spacious'].map(d => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={`card p-3 text-xs font-semibold capitalize transition-all border-2 ${density === d ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-transparent text-muted-foreground hover:border-indigo-200'}`}
            >
              {d}
            </button>
          ))}
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
  const [active, setActive] = useState('profile');
  return (
    <AppLayout title="Settings">
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account, organization, and preferences.</p>
      </div>
      <div className="flex gap-8">
        {/* Sidebar tabs */}
        <nav className="w-44 flex-shrink-0">
          <div className="space-y-0.5">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active === t.id ? 'bg-indigo-50 text-indigo-700' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </nav>
        {/* Content */}
        <div className="flex-1 min-w-0">
          {TAB_CONTENT[active]}
        </div>
      </div>
    </AppLayout>
  );
}
