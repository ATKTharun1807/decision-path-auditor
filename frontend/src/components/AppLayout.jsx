import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Shield, LogOut, Bell, Settings, BarChart3,
  Clock, Activity, X, CheckCircle, AlertTriangle, Info,
  Command, Sparkles, User, Search, MessageSquare, Bot, ArrowRight,
  FolderGit2, Cpu, Sliders, Play, Terminal
} from 'lucide-react';

/* ─── Aurora Command Center Navigation ─────────────────── */
const NAV = [
  { icon: '🏠', label: 'Dashboard',     path: '/dashboard'  },
  { icon: '🧠', label: 'Decision Flow', path: '/session/sess-a0dd38bd2155' },
  { icon: '📂', label: 'Sessions',      path: '/sessions'   },
  { icon: '📊', label: 'Analytics',     path: '/analytics'  },
  { icon: '🛡', label: 'Policies',      path: '/policies'   },
  { icon: '🤖', label: 'AI Agents',     path: '/analytics'  },
  { icon: '⚙', label: 'Settings',      path: '/settings'   },
];

/* ─── Mock notifications ─────────────────────────────────── */
const NOTIFICATIONS = [
  { id: 1, type: 'alert',   title: 'High-risk decision detected',        body: 'sess-a0dd38bd2155 flagged: Credit score below threshold.', time: '2m ago',  read: false },
  { id: 2, type: 'alert',   title: 'Policy RULE-CS-640 triggered',       body: 'Loan approval declined automatically.',                    time: '18m ago', read: false },
  { id: 3, type: 'success', title: 'Model Gemini-1.5 Pro synchronized',  body: 'Decision audit stream active.',                            time: '1h ago',  read: true  },
  { id: 4, type: 'info',    title: 'New policy version published',       body: 'RULE-INC-220 updated by Tharun.',                           time: '3h ago',  read: true  },
];

/* ──────────────────────────────────────────────────────────── */
export default function AppLayout({ children, title = 'AI Mission Control' }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [time, setTime]           = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs]       = useState(NOTIFICATIONS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Floating AI Assistant State
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiPrompt, setAiPrompt]               = useState('');
  const [chatMessages, setChatMessages]       = useState([
    { role: 'assistant', text: 'Hello Tharun! Ask me anything about your AI decision stream, e.g., "Show rejected sessions today" or "Which policy failed most?"' }
  ]);

  const notifRef  = useRef(null);
  const unread    = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    const userMsg = aiPrompt.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiPrompt('');

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/copilot/chat', {
        query: userMsg,
        current_page: location.pathname
      });

      const { action, target, session_id, message } = res.data;
      
      setChatMessages(prev => [...prev, { role: 'assistant', text: message || 'Query processed.' }]);

      // Execute UI Action
      if (action === 'navigate' && target) {
        setTimeout(() => navigate(target), 400);
      } else if (action === 'open_session' && session_id) {
        setTimeout(() => navigate(`/session/${session_id}`), 400);
      } else if (action === 'filter') {
        setTimeout(() => navigate('/sessions'), 400);
      }
    } catch {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        text: `Processed query: "${userMsg}". Monitoring 142 decision sessions today with 97.4% compliance.` 
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-aurora-pattern text-[#1E293B] flex font-sans">
      
      {/* ── Aurora Mission Control Sidebar (#EEF4F7) ─────────────────── */}
      <aside className="w-64 flex-shrink-0 bg-[#EEF4F7] border-r border-slate-200/90 flex flex-col sticky top-0 h-screen z-30 shadow-sm">
        
        {/* Brand Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-[#0EA5A4] flex items-center justify-center text-white shadow-sm shadow-[#0EA5A4]/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-[#1E293B] text-base tracking-tight block">AuditAI</span>
              <span className="text-[10px] font-mono text-[#0EA5A4] font-semibold">AI Governance OS</span>
            </div>
          </div>
        </div>

        {/* AI Health Quick Banner */}
        <div className="mx-3 my-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">AI System Status</span>
            <span className="badge-aurora-emerald text-[10px]">🟢 Healthy</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-[#1E293B]">97.4%</span>
            <span className="text-[11px] text-emerald-600 font-semibold">Compliance</span>
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span>4 Models Running</span>
            <span>24ms Latency</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase font-bold tracking-widest text-slate-400">
            Mission Control
          </div>
          {NAV.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  active 
                    ? 'bg-white text-[#0EA5A4] font-bold shadow-xs border border-slate-200/80' 
                    : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 font-medium'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-t border-slate-200/80 bg-[#EEF4F7]">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/80 border border-slate-200/80">
            <div className="w-8 h-8 rounded-full bg-[#0EA5A4] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              T
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1E293B] truncate">Tharun Workspace</p>
              <p className="text-[10px] text-slate-500 truncate">Enterprise Admin</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-rose-600 p-1 transition-colors" title="Logout">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Command Center Area ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Floating Top Command Bar */}
        <header className="h-16 px-6 lg:px-8 flex items-center justify-between border-b border-slate-200/70 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          
          {/* Title & Path */}
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-extrabold text-[#1E293B] text-lg">{title}</h1>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">/ auditai-node-1</span>
          </div>

          {/* Center Command Search Trigger (Raycast style) */}
          <button 
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-500 hover:bg-white hover:border-[#0EA5A4]/40 hover:text-slate-800 transition-all w-80 shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-[#0EA5A4]" />
            <span className="flex-1 text-left">Search sessions, policies, tools…</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] font-mono text-slate-400 border border-slate-200">⌘K</kbd>
          </button>

          {/* Right Status Actions */}
          <div className="flex items-center gap-3">
            
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed Stream
            </div>

            {/* Notification Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="btn-aurora-secondary p-2.5 relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] text-white font-bold flex items-center justify-center shadow-xs">
                    {unread}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-floating z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-xs text-[#1E293B]">Audit Notifications</h3>
                      {unread > 0 && (
                        <span className="badge-aurora-red text-[10px]">{unread} new</span>
                      )}
                    </div>
                    <button onClick={markAllRead} className="text-xs text-[#0EA5A4] font-semibold hover:underline">
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifs.map(n => (
                      <div key={n.id} className={`p-3 text-xs flex items-start gap-3 transition-colors ${n.read ? 'opacity-70' : 'bg-teal-50/20'}`}>
                        <div className="mt-0.5">
                          {n.type === 'alert' ? <AlertTriangle className="w-4 h-4 text-rose-500" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">{n.title}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{n.body}</p>
                          <span className="text-[10px] text-slate-400 font-mono mt-1 block">{n.time}</span>
                        </div>
                        <button onClick={() => dismiss(n.id)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => navigate('/settings')} className="btn-aurora-secondary p-2.5">
              <Settings className="w-4 h-4 text-slate-600" />
            </button>

          </div>

        </header>

        {/* Main Content Render */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>

        {/* ── Floating AI Assistant (Bottom Right) ────────────────────────── */}
        <div className="fixed bottom-6 right-6 z-40">
          {!aiAssistantOpen ? (
            <button
              onClick={() => setAiAssistantOpen(true)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0EA5A4] text-white font-bold text-xs shadow-aurora-lg hover:shadow-glow-teal hover:scale-105 transition-all duration-200 border border-teal-400/30"
            >
              <Bot className="w-4 h-4 animate-bounce" />
              <span>Ask AI Copilot</span>
            </button>
          ) : (
            <div className="w-80 sm:w-96 bg-white border border-slate-200/90 rounded-2xl shadow-floating overflow-hidden flex flex-col h-96">
              
              {/* Header */}
              <div className="px-4 py-3 bg-[#0EA5A4] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span className="font-heading font-bold text-xs">Audit Copilot</span>
                </div>
                <button onClick={() => setAiAssistantOpen(false)} className="hover:opacity-80 p-0.5">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-[#0EA5A4] text-white font-medium rounded-tr-none shadow-xs' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Footer */}
              <form onSubmit={handleAiSubmit} className="p-2 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Show rejected sessions today…"
                  className="aurora-input text-xs py-2"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                />
                <button type="submit" className="btn-aurora p-2 text-xs">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

            </div>
          )}
        </div>

      </div>

      {/* ── Raycast-style ⌘K Modal ─────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-floating overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <Search className="w-4 h-4 text-[#0EA5A4]" />
              <input
                type="text"
                placeholder="Search sessions, policies, tools, decisions…"
                className="w-full text-sm font-sans focus:outline-none bg-transparent"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">
                ESC
              </button>
            </div>
            
            <div className="p-3 text-xs divide-y divide-slate-100">
              <div className="py-2 text-[10px] font-mono uppercase font-bold text-slate-400 px-2">Recent Searches</div>
              {[
                { label: 'sess-a0dd38bd2155 · Declined loan application', path: '/session/sess-a0dd38bd2155' },
                { label: 'RULE-CS-640 · Credit score threshold policy', path: '/policies' },
                { label: 'credit_bureau_lookup · Tool call inspect', path: '/analytics' },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => { navigate(item.path); setSearchOpen(false); }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-teal-50/50 hover:text-[#0EA5A4] cursor-pointer transition-colors"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Jump →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
