import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Shield, Eye, EyeOff, ArrowRight, Check, Activity, 
  Lock, Mail, Sparkles, AlertCircle
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function Login() {
  const [mode, setMode]           = useState('login'); // 'login' | 'register'
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);
  const navigate                  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await axios.post(`${API_BASE_URL}/register`, { email, password });
        setSuccess('Account created! Authenticating workspace…');
        const form = new URLSearchParams();
        form.append('username', email);
        form.append('password', password);
        const res = await axios.post(`${API_BASE_URL}/token`, form, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        localStorage.setItem('token', res.data.access_token);
        setTimeout(() => navigate('/dashboard'), 600);
      } else {
        const form = new URLSearchParams();
        form.append('username', email);
        form.append('password', password);
        const res = await axios.post(`${API_BASE_URL}/token`, form, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        localStorage.setItem('token', res.data.access_token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || (mode === 'login' ? 'Invalid credentials' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#1E293B] flex flex-col justify-between items-center relative overflow-hidden font-sans p-4 sm:p-6 lg:p-8 bg-aurora-pattern selection:bg-[#0EA5A4]/20 selection:text-[#0EA5A4]">
      
      {/* Top Header */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0EA5A4] flex items-center justify-center text-white shadow-sm shadow-[#0EA5A4]/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-[#1E293B] text-lg tracking-tight">AuditAI</span>
            <span className="ml-2 text-[10px] uppercase font-bold tracking-widest text-[#0EA5A4] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Mission Control OS
            </span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')} 
          className="btn-aurora-secondary text-xs"
        >
          ← Back to Home
        </button>
      </header>

      {/* Center Auth Card */}
      <main className="w-full max-w-md z-10 my-auto py-8">
        
        <div className="aurora-card p-8 shadow-floating bg-white border border-slate-200/90 relative overflow-hidden">
          
          {/* Top Teal Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-[#0EA5A4]" />

          {/* Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0EA5A4] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Aurora Light Portal
            </div>
            <h1 className="font-heading text-2xl font-extrabold text-[#1E293B] tracking-tight">
              {mode === 'login' ? 'Sign in to Mission Control' : 'Create Enterprise Account'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login' ? 'Access your AI decision path auditor workspace' : 'Start auditing AI agents with 1,000 free sessions'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
                mode === 'login' ? 'bg-[#0EA5A4] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
                mode === 'register' ? 'bg-[#0EA5A4] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  className="aurora-input pl-10"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                {mode === 'login' && (
                  <button type="button" className="text-xs text-[#0EA5A4] hover:underline font-semibold">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="aurora-input pl-10 pr-11"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={mode === 'register' ? 8 : undefined}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-aurora w-full py-3 text-sm mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating…</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{mode === 'login' ? 'Continue to Mission Control' : 'Create Free Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>

          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl z-10 py-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <span>SOC-2 Type II Certified · 256-bit AES Encryption</span>
        <span>© 2025 AuditAI Platform Inc.</span>
      </footer>

    </div>
  );
}
