import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Search, Play, FileText, Activity } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsLoading(true);
    setError('');
    try {
      if (searchQuery.startsWith('sess-')) {
        navigate(`/session/${searchQuery}`);
      } else {
        // Assume user_id search for simplicity in Phase 1 MVP
        const res = await axios.get(`${API_BASE_URL}/decision-path/user/${searchQuery}`);
        const sessions = Object.keys(res.data);
        if (sessions.length > 0) {
          navigate(`/session/${sessions[0]}`);
        } else {
          setError('No sessions found for this query.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to search for session');
    } finally {
      setIsLoading(false);
    }
  };

  const runDemo = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/demo/run`);
      navigate(`/session/${res.data.session_id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Demo run failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-semibold tracking-tight">AI Auditor Dashboard</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Audit an AI Decision</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Inspect the exact timeline of events, tools used, data retrieved, and reasoning behind any AI agent's decision.
            </p>
          </div>

          {error && (
            <div className="p-4 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-center">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-border transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Search className="w-24 h-24" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Look up a session</h2>
              <p className="text-sm text-muted-foreground mb-6">Enter a Session ID or User ID to reconstruct its decision path.</p>
              
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm transition-all"
                    placeholder="sess-123 or user-456"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background disabled:opacity-50 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-border transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Play className="w-24 h-24" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Simulate a decision</h2>
              <p className="text-sm text-muted-foreground mb-6">Run a fresh AI loan decision and instantly view its audit trail.</p>
              
              <button
                onClick={runDemo}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-secondary-foreground bg-secondary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary focus:ring-offset-background disabled:opacity-50 transition-all"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Demo Agent
              </button>
            </div>
          </div>
          
          <div className="mt-12 bg-card/50 border border-border rounded-xl p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">Recent Audit Logs</h3>
            <p className="text-sm text-muted-foreground mt-2">Global timeline analytics and reports will appear here in Phase 2.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
