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

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/decision-path/session/${id}`);
        setTimeline(res.data);
      } catch (err: any) {
        setError('Could not load timeline for this session.');
      }
    };
    fetchTimeline();
  }, [id]);

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

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50 shadow-sm flex items-center space-x-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-semibold text-xl flex items-center text-foreground">
            Session Timeline
            <span className="ml-3 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full font-mono">{id}</span>
          </h1>
          <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-3">
            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {timeline.step_count} events logged</span>
            <span>User ID: {timeline.user_id}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="space-y-8">
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
                <div className="flex-1 min-w-0">
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
      </main>
    </div>
  );
}
