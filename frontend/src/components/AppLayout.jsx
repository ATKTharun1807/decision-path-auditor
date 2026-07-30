import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Shield, LogOut, Bell, Settings, BarChart3,
  Clock, Activity, X, CheckCircle, AlertTriangle, Info
} from 'lucide-react';

/* ─── Nav items ─────────────────────────────────────────── */
const NAV = [
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard'  },
  { icon: Clock,     label: 'Sessions',  path: '/sessions'   },
  { icon: Activity,  label: 'Analytics', path: '/analytics'  },
  { icon: Shield,    label: 'Policies',  path: '/policies'   },
  { icon: Settings,  label: 'Settings',  path: '/settings'   },
];

/* ─── Mock notifications ─────────────────────────────────── */
const NOTIFICATIONS = [
  { id: 1, type: 'alert',   title: 'High-risk decision detected',        body: 'sess-a0dd38bd2155 flagged as high risk.',     time: '2m ago',  read: false },
  { id: 2, type: 'alert',   title: 'Compliance threshold breached',      body: 'NIST AI RMF score dropped below 85%.',       time: '18m ago', read: false },
  { id: 3, type: 'success', title: 'Demo agent completed',               body: 'sess-8b9487775caf audit trail generated.',   time: '1h ago',  read: true  },
  { id: 4, type: 'info',    title: 'New policy RULE-INC-220 published',  body: 'Income verification threshold updated.',     time: '3h ago',  read: true  },
];

const notifIcon = {
  alert:   <AlertTriangle className="w-4 h-4 text-red-500" />,
  success: <CheckCircle className="w-4 h-4 text-green-500" />,
  info:    <Info className="w-4 h-4 text-indigo-500" />,
};

/* ──────────────────────────────────────────────────────────── */
export default function AppLayout({ children, title = 'Overview' }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [time, setTime]           = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs]       = useState(NOTIFICATIONS);
  const notifRef                  = useRef(null);
  const unread                    = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const dismiss = (id) => setNotifs(n => n.filter(x => x.id !== id));

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 border-r border-border bg-white flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-semibold text-foreground tracking-tight">AuditAI</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(item => {
            const Icon    = item.icon;
            const active  = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full text-left ${active ? 'sidebar-link-active' : 'sidebar-link'}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User card */}
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              T
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Tharun</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors p-1" title="Logout">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
          <h1 className="font-heading font-semibold text-foreground text-base">{title}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Last synced {time.toLocaleTimeString()}
            </div>

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="btn-ghost p-2 relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white font-bold flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-border shadow-card-hover z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-sm text-foreground">Notifications</h3>
                      {unread > 0 && (
                        <span className="badge-red text-[10px]">{unread} new</span>
                      )}
                    </div>
                    <button onClick={markAllRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <div className="py-10 text-center text-sm text-muted-foreground">
                        No notifications
                      </div>
                    ) : notifs.map(n => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors ${n.read ? '' : 'bg-indigo-50/40'}`}
                      >
                        <div className="mt-0.5 flex-shrink-0">{notifIcon[n.type]}</div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold text-foreground mb-0.5 ${n.read ? '' : 'text-indigo-900'}`}>{n.title}</p>
                          <p className="text-xs text-muted-foreground leading-snug">{n.body}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                        </div>
                        <button onClick={() => dismiss(n.id)} className="text-muted-foreground hover:text-foreground p-0.5 flex-shrink-0">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-border text-center">
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => navigate('/settings')} className="btn-ghost p-2" aria-label="Settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
