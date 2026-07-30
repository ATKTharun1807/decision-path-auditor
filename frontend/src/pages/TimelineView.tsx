import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, ShieldAlert, CheckCircle, FileText, Bot, Activity } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const iconMap: any = {
  input: <Bot className="w-5 h-5" />,
  context_retrieved: <FileText className="w-5 h-5" />,
  tool_call: <Activity className="w-5 h-5" />,
  tool_response: <CheckCircle className="w-5 h-5" />,
  reasoning_step: <Activity className="w-5 h-5" />,
  decision: <ShieldAlert className="w-5 h-5 text-destructive" />,
  output: <FileText className="w-5 h-5" />
};

export default function TimelineView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState<any>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'timeline' | 'summary' | 'regulatory'>('timeline');

  // Summary State
  const [summaryData, setSummaryData] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Regulatory State
  const [challengeText, setChallengeText] = useState('');
  const [regulatoryData, setRegulatoryData] = useState<string | null>(null);
  const [regulatoryError, setRegulatoryError] = useState<string | null>(null);
  const [isGeneratingRegulatory, setIsGeneratingRegulatory] = useState(false);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${API_BASE_URL}/decision-path/session/${id}`, { headers });
        setTimeline(res.data);
      } catch (err: any) {
        setError('Could not load timeline for this session.');
      }
    };
    fetchTimeline();
  }, [id]);

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummaryError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API_BASE_URL}/decision-path/session/${id}/summary`, {}, { headers });
      setSummaryData(res.data.summary);
    } catch (err: any) {
      setSummaryError(err.response?.data?.detail || err.message);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const generateRegulatoryResponse = async () => {
    setIsGeneratingRegulatory(true);
    setRegulatoryError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API_BASE_URL}/decision-path/session/${id}/challenge-response`, { challenge_text: challengeText }, { headers });
      setRegulatoryData(res.data.challenge_response);
    } catch (err: any) {
      setRegulatoryError(err.response?.data?.detail || err.message);
    } finally {
      setIsGeneratingRegulatory(false);
    }
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-destructive bg-background">
        {error}
      </div>
    );
  }

  if (!timeline) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground bg-background">
        Loading timeline...
      </div>
    );
  }

  const decisionEvent = timeline.timeline.find((e: any) => e.event_type === 'decision');
  const decisionValue = decisionEvent?.payload?.decision || 'UNKNOWN';
  const ruleApplied = decisionEvent?.payload?.rule_id || 'N/A';
  const toolCallsCount = timeline.timeline.filter((e: any) => e.event_type === 'tool_call').length;
  const redactedCount = timeline.timeline.filter((e: any) => e.redacted).length;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <nav className="border-b border-border bg-card/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50 shadow-sm flex items-center space-x-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-semibold text-xl flex items-center text-foreground">
            Session Timeline
            <span className="ml-3 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full font-mono">{id}</span>
          </h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-8 px-6">
        
        {/* Top Summary Dashboard */}
        <div className="bg-card border border-border shadow-sm rounded-xl p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Session</h3>
                <p className="font-mono text-sm">{id}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">User</h3>
                <p className="font-mono text-sm">{timeline.user_id}</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Decision</h3>
              <span className="px-3 py-1 bg-destructive/10 text-destructive font-bold text-sm rounded-full tracking-wider">
                {decisionValue}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="text-xs text-muted-foreground mb-1">Steps captured</h4>
              <p className="text-2xl font-semibold">{timeline.step_count}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="text-xs text-muted-foreground mb-1">Tool calls</h4>
              <p className="text-2xl font-semibold">{toolCallsCount}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="text-xs text-muted-foreground mb-1">Events redacted</h4>
              <p className="text-2xl font-semibold">{redactedCount}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="text-xs text-muted-foreground mb-1">Rule applied</h4>
              <p className="text-xl font-semibold">{ruleApplied}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-6 border-b border-border mt-8">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'timeline' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'summary' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Plain-English summary
            </button>
            <button
              onClick={() => setActiveTab('regulatory')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'regulatory' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Regulatory response
            </button>
          </div>
        </div>

        {/* Tab Content */}
        
        {activeTab === 'timeline' && (
          <div className="space-y-8 pl-4">
            {timeline.timeline.map((evt: any, index: number) => {
              const isLast = index === timeline.timeline.length - 1;
              const isRedacted = evt.redacted;

              return (
                <div key={evt.event_id} className="relative flex items-start group">
                  {/* Vertical Line connecting steps */}
                  {!isLast && (
                    <div className="absolute top-10 left-[1.1875rem] bottom-[-2rem] w-px bg-border group-hover:bg-primary/50 transition-colors" />
                  )}
                  
                  {/* Step Circle */}
                  <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 border-border bg-card flex items-center justify-center text-muted-foreground font-mono text-sm mr-6 group-hover:border-primary group-hover:text-primary transition-colors">
                    {index}
                  </div>

                  {/* Event Card */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase flex items-center">
                        {evt.event_type.replace(/_/g, ' ')}
                      </span>
                      {isRedacted && (
                        <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-destructive text-destructive-foreground rounded-sm shadow-sm">
                          Redacted
                        </span>
                      )}
                      <span className="ml-auto text-xs text-muted-foreground/60 font-mono">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <h3 className="text-base font-medium text-foreground mb-4">
                      {evt.summary}
                    </h3>

                    <div className="rounded-lg border border-border bg-muted/50 overflow-hidden shadow-inner">
                      <div className="px-4 py-2 bg-muted border-b border-border flex items-center">
                        <div className="flex space-x-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-border" />
                          <div className="w-2.5 h-2.5 rounded-full bg-border" />
                          <div className="w-2.5 h-2.5 rounded-full bg-border" />
                        </div>
                      </div>
                      <div className="p-4 overflow-x-auto text-sm text-foreground/80 font-mono bg-[#0d0d0d] whitespace-pre-wrap">
                        {JSON.stringify(evt.payload, null, 2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="bg-card border border-border shadow-sm rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Generated by Claude from the reconstructed timeline above — grounded only in what actually happened during this decision.
            </p>
            <button
              onClick={generateSummary}
              disabled={isGeneratingSummary}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors mb-6"
            >
              {isGeneratingSummary ? 'Generating...' : 'Generate summary'}
            </button>

            {summaryError && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm whitespace-pre-wrap">
                Could not generate summary: {summaryError}
              </div>
            )}
            
            {summaryData && (
              <div className="bg-muted p-6 rounded-lg text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed shadow-inner border border-border">
                {summaryData}
              </div>
            )}
          </div>
        )}

        {activeTab === 'regulatory' && (
          <div className="bg-card border border-border shadow-sm rounded-xl p-6">
            <label className="block text-sm text-muted-foreground mb-2">
              Optional: paste the customer's or regulator's challenge text
            </label>
            <textarea
              className="w-full bg-background border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              rows={4}
              placeholder="e.g. The applicant disputes the decline..."
              value={challengeText}
              onChange={(e) => setChallengeText(e.target.value)}
            />
            <button
              onClick={generateRegulatoryResponse}
              disabled={isGeneratingRegulatory}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors mb-6"
            >
              {isGeneratingRegulatory ? 'Drafting...' : 'Draft response'}
            </button>

            {regulatoryError && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm whitespace-pre-wrap">
                Could not draft response: {regulatoryError}
              </div>
            )}
            
            {regulatoryData && (
              <div className="bg-muted p-6 rounded-lg text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed shadow-inner border border-border">
                {regulatoryData}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
