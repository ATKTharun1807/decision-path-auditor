import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegister) {
        await axios.post(`${API_BASE_URL}/register`, { email, password });
        setIsRegister(false);
        setError('Registration successful! Please log in.');
      } else {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        
        const response = await axios.post(`${API_BASE_URL}/token`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        localStorage.setItem('token', response.data.access_token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-background to-background" />
      </div>
      <div className="z-10 w-full max-w-md p-8 space-y-8 bg-card border border-border/50 rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="p-3 bg-primary/10 rounded-full">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">AI Decision Auditor</h2>
          <p className="text-sm text-muted-foreground">Every AI Decision Should Be Explainable.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {error && <div className="p-3 text-sm text-destructive-foreground bg-destructive/20 rounded-md border border-destructive/50">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-200"
          >
            {isRegister ? 'Sign up' : 'Sign in'}
          </button>
        </form>
        <div className="text-center mt-6">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
