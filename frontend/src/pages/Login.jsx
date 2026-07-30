import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Eye, EyeOff, ArrowRight, Check, Activity } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const FEATURES = [
  'Full decision timeline reconstruction',
  'EU AI Act & ISO 42001 compliance',
  'PII redaction & data privacy',
  'Plain-English AI explainability',
];

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
        setSuccess('Account created! Signing you in…');
        // Auto-login after register
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
    <div className="min-h-screen flex">
      {/* ── Left panel ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-700 to-indigo-900">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full bg-violet-500/20 blur-3xl" />
          {/* Grid overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-semibold text-white text-xl tracking-tight">AuditAI</span>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-4">Enterprise AI Governance</p>
            <h1 className="font-heading text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
              See every AI decision<br />
              before your users do.
            </h1>
            <p className="text-indigo-200 text-lg leading-relaxed max-w-md">
              AuditAI captures every reasoning step, tool call, and data retrieval — and turns it into a complete compliance-ready audit trail.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3 text-indigo-100 text-sm font-medium">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                {f}
              </li>
            ))}
          </ul>

          {/* Mini timeline animation */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
            <p className="text-white/60 text-xs font-mono mb-4">live_audit · sess-a0dd38bd</p>
            <div className="space-y-3">
              {[
                { step: 0, label: 'Input received',    done: true  },
                { step: 1, label: 'Tool call executed', done: true  },
                { step: 2, label: 'PII redacted',       done: true  },
                { step: 3, label: 'Decision logged',    done: false },
              ].map(s => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-green-400' : 'bg-white/20 animate-pulse'}`}>
                    {s.done ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 rounded-full bg-white/60" />}
                  </div>
                  <span className={`text-xs font-mono ${s.done ? 'text-white' : 'text-white/40'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="relative z-10 text-indigo-400 text-xs">© 2025 AuditAI · Enterprise AI Governance</p>
      </div>

      {/* ── Right panel ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-semibold text-foreground text-lg">AuditAI</span>
          </div>

          {/* Mode toggle */}
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                {mode === 'login' && (
                  <button type="button" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-11"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={mode === 'register' ? 8 : undefined}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'register' && (
                <p className="mt-1.5 text-xs text-muted-foreground">Must be at least 8 characters.</p>
              )}
            </div>

            {/* Remember me */}
            {mode === 'login' && (
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-indigo-600" />
                <span className="text-sm text-muted-foreground">Remember me for 30 days</span>
              </label>
            )}

            {/* Error / success */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                <Activity className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
                <Check className="w-4 h-4 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Google', icon: 'G' },
              { name: 'GitHub',  icon: (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
              )},
            ].map(s => (
              <button
                key={s.name}
                type="button"
                className="btn-secondary justify-center py-2.5 text-sm font-medium gap-2 opacity-60 cursor-not-allowed"
                disabled
                title="Coming soon"
              >
                <span className="font-bold text-base leading-none">{typeof s.icon === 'string' ? s.icon : ''}</span>
                {typeof s.icon !== 'string' && s.icon}
                {s.name}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8">
            By continuing, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
