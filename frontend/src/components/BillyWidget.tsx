import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '../hooks/use-mobile';

const NAVY   = '#003DA5';
const SCARLET = '#C41230';

interface EmailDraft {
  department: string;
  to: string;
  subject: string;
  body: string;
}

interface Message {
  role: 'billy' | 'user' | 'loading';
  text: string;
  sources?: string[];
  emailDraft?: EmailDraft;
}

function sanitizeEmailDraft(raw: unknown): EmailDraft | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const d = raw as Record<string, unknown>;
  if (typeof d.department !== 'string' || typeof d.to !== 'string' || typeof d.subject !== 'string' || typeof d.body !== 'string') return undefined;
  return { department: d.department, to: d.to, subject: d.subject, body: d.body };
}

function sanitizeSources(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((s): s is string => {
    if (typeof s !== 'string') return false;
    try {
      const url = new URL(s);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch { return false; }
  });
}

function formatBillyText(text: string) {
  if (!text) return null;
  const lines = text.split('\n').filter(l => l.trim());

  return (
    <div style={{ fontSize: '13px', lineHeight: '1.65', color: '#222' }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Only treat as bullet if line explicitly starts with bullet character
        if (trimmed.startsWith('•')) {
          return (
            <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'flex-start' }}>
              <span style={{ color: '#003DA5', fontWeight: 'bold', flexShrink: 0 }}>•</span>
              <span>{trimmed.replace(/^•\s*/, '')}</span>
            </div>
          );
        }

        // Only treat as numbered if line starts with digit+period+space
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'flex-start' }}>
              <span style={{ color: '#003DA5', fontWeight: 'bold', flexShrink: 0 }}>{trimmed.match(/^\d+\./)![0]}</span>
              <span>{trimmed.replace(/^\d+\.\s*/, '')}</span>
            </div>
          );
        }

        // Bold header — short line ending with colon
        if (trimmed.endsWith(':') && trimmed.length < 55 && !trimmed.includes(',')) {
          return (
            <p key={i} style={{ fontWeight: '700', color: '#003DA5', margin: i === 0 ? '0' : '10px 0 3px' }}>{trimmed}</p>
          );
        }

        // Regular paragraph — no bullet
        return (
          <p key={i} style={{ margin: i === 0 ? '0' : '6px 0 0' }}>{trimmed}</p>
        );
      })}
    </div>
  );
}

export function BillyWidget() {
  const isMobile = useIsMobile();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'billy', text: "Hi! I'm Billy, DePaul's AI assistant. I can answer questions about admissions, financial aid, programs, campus life, and more. If I can't answer something, I'll draft an email to the right DePaul department for you! 😊" },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inject keyframes for Billy's jump + dot bounce
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'billy-keyframes';
    style.textContent = `
      @keyframes billyJump {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        20% { transform: translateY(-16px) rotate(-3deg); }
        40% { transform: translateY(-8px) rotate(2deg); }
        60% { transform: translateY(-14px) rotate(-2deg); }
        80% { transform: translateY(-4px) rotate(1deg); }
      }
      @keyframes dotBounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 1; }
        40%            { transform: translateY(-6px); opacity: 0.5; }
      }
      @keyframes labelPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.04); opacity: 0.92; }
      }
    `;
    if (!document.getElementById('billy-keyframes')) {
      document.head.appendChild(style);
    }
    return () => { document.getElementById('billy-keyframes')?.remove(); };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!inputVal.trim() || loading) return;
    const userMsg = inputVal.trim();
    setInputVal('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setMessages(prev => [...prev, { role: 'loading', text: '' }]);
    setLoading(true);
    try {
      const res = await fetch('https://chemicals-freefall-grueling.ngrok-free.dev/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg }),
      });
      const data = await res.json() as {
        answer?: string; sources?: unknown;
        status?: string; email_draft?: unknown;
      };

      if (data.status === 'not_depaul_related') {
        setMessages(prev =>
          prev.filter(m => m.role !== 'loading').concat({
            role: 'billy',
            text: "I'm sorry, I can only answer questions about DePaul University. Try asking me about admissions, financial aid, programs, campus life, or anything else DePaul-related! 😊",
          })
        );
      } else if (data.status === 'email_generated') {
        setMessages(prev =>
          prev.filter(m => m.role !== 'loading').concat({
            role: 'billy',
            text: "I don't have a confident answer for that specific question, but I've drafted an email to the right DePaul department for you:",
            emailDraft: sanitizeEmailDraft(data.email_draft),
          })
        );
      } else {
        setMessages(prev =>
          prev.filter(m => m.role !== 'loading').concat({
            role: 'billy',
            text: data.answer || 'Sorry, I could not find an answer.',
            sources: sanitizeSources(data.sources),
          })
        );
      }
    } catch {
      setMessages(prev =>
        prev.filter(m => m.role !== 'loading').concat({
          role: 'billy',
          text: 'Sorry, Billy is unavailable right now. Please try again in a moment.',
        })
      );
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating widget */}
      <div style={{ position: 'fixed', bottom: isMobile ? 16 : 28, right: isMobile ? 16 : 28, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>

        {/* Chat window */}
        {chatOpen && (
          <div style={{
            position: 'absolute', bottom: 100, right: 0,
            width: isMobile ? 'calc(100vw - 32px)' : 390,
            height: isMobile ? 'min(540px, calc(100vh - 160px))' : 540,
            background: '#fff', borderRadius: 20,
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              background: NAVY, padding: '14px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/billy.png" alt="Billy mascot" width={32} height={32} style={{ objectFit: 'contain', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 14 }}>Billy — DePaul's AI Assistant</p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                aria-label="Close chat"
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', opacity: 0.8, lineHeight: 1 }}
              >✕</button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: 16,
              display: 'flex', flexDirection: 'column', gap: 12,
              background: '#FAFAFA',
            }}>
              {messages.map((msg, i) => {
                if (msg.role === 'loading') {
                  return (
                    <div key={i} style={{ alignSelf: 'flex-start' }}>
                      <div style={{ background: '#fff', borderRadius: 18, padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: 6, alignItems: 'center' }}>
                        {[0, 1, 2].map((d) => (
                          <div key={d} style={{
                            width: 6, height: 6, borderRadius: '50%', background: '#999',
                            animation: `dotBounce 1.2s ease-in-out ${d * 0.2}s infinite`,
                          }} />
                        ))}
                      </div>
                    </div>
                  );
                }
                if (msg.role === 'billy') {
                  return (
                    <div key={i} style={{ alignSelf: 'flex-start', maxWidth: '78%' }}>
                      <div style={{ background: '#fff', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                        <div>{formatBillyText(msg.text)}</div>
                        {msg.sources && msg.sources.length > 0 && (
                          <div style={{ marginTop: 8, borderTop: '1px solid #eee', paddingTop: 8 }}>
                            {msg.sources.map((src, si) => (
                              <a key={si} href={src} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'block', color: '#999', fontSize: 10.5, textDecoration: 'none' }}>
                                ↗ {src}
                              </a>
                            ))}
                          </div>
                        )}
                        {msg.emailDraft && (
                          <div style={{ marginTop: 12, background: '#E6ECF6', borderRadius: 12, padding: 16, border: '1px solid #d0d8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                              <span style={{ fontSize: 16 }}>✉️</span>
                              <span style={{ color: NAVY, fontWeight: 700, fontSize: 13 }}>Email Draft Ready</span>
                            </div>
                            <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>
                              <span style={{ fontWeight: 700, color: NAVY }}>To: </span>{msg.emailDraft.department}
                            </div>
                            <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>
                              <span style={{ fontWeight: 700, color: NAVY }}>Email: </span>
                              <a href={`mailto:${msg.emailDraft.to}`} style={{ color: SCARLET }}>{msg.emailDraft.to}</a>
                            </div>
                            <div style={{ fontSize: 12, color: '#555', marginBottom: 10 }}>
                              <span style={{ fontWeight: 700, color: NAVY }}>Subject: </span>{msg.emailDraft.subject}
                            </div>
                            <div style={{ background: '#fff', borderRadius: 8, padding: 12, fontSize: 12, color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap', border: '1px solid #ddd', maxHeight: 140, overflowY: 'auto' }}>
                              {msg.emailDraft.body}
                            </div>
                            <button
                              onClick={() => {
                                const draft = msg.emailDraft!;
                                const mailto = `mailto:${draft.to}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
                                window.open(mailto);
                              }}
                              style={{ marginTop: 10, background: NAVY, color: '#fff', border: 'none', borderRadius: 20, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%' }}
                            >
                              📧 Open in Email App
                            </button>
                            <button
                              onClick={() => {
                                const draft = msg.emailDraft!;
                                navigator.clipboard.writeText(`To: ${draft.to}\nSubject: ${draft.subject}\n\n${draft.body}`);
                              }}
                              style={{ marginTop: 6, background: 'transparent', color: NAVY, border: `1px solid ${NAVY}`, borderRadius: 20, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%' }}
                            >
                              📋 Copy to Clipboard
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '78%' }}>
                    <div style={{ background: SCARLET, borderRadius: '18px 18px 4px 18px', padding: '12px 16px' }}>
                      <p style={{ margin: 0, color: '#fff', fontSize: 13.5, lineHeight: 1.65 }}>{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                placeholder="Ask me anything..."
                disabled={loading}
                style={{
                  flex: 1, border: '1.5px solid #ddd', borderRadius: 24,
                  padding: '11px 18px', fontSize: 14, outline: 'none',
                  backgroundColor: '#fff',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = NAVY)}
                onBlur={e  => (e.currentTarget.style.borderColor = '#ddd')}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !inputVal.trim()}
                style={{
                  background: loading || !inputVal.trim() ? '#e0a0a9' : SCARLET,
                  color: '#fff', border: 'none', borderRadius: 24,
                  padding: '11px 20px', fontSize: 14, fontWeight: 700,
                  cursor: loading || !inputVal.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s', flexShrink: 0,
                }}
                onMouseEnter={e => { if (!loading && inputVal.trim()) (e.currentTarget as HTMLButtonElement).style.background = '#a01025'; }}
                onMouseLeave={e => { if (!loading && inputVal.trim()) (e.currentTarget as HTMLButtonElement).style.background = SCARLET; }}
              >Send</button>
            </div>
          </div>
        )}

        {/* "Ask Billy" label — only when closed */}
        {!chatOpen && (
          <div
            onClick={() => setChatOpen(true)}
            style={{
              background: '#003DA5',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              padding: '7px 13px',
              borderRadius: '14px',
              marginBottom: '8px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              letterSpacing: '0.2px',
              boxShadow: '0 2px 10px rgba(0,61,165,0.3)',
            }}
          >
            Ask Billy!
          </div>
        )}

        {/* Billy image button */}
        <div
          onClick={() => setChatOpen(!chatOpen)}
          style={{ cursor: 'pointer', width: '68px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', padding: 0 }}
        >
          <img
            src="/billy.png"
            alt="Billy"
            style={{
              width: '68px',
              height: '68px',
              objectFit: 'contain',
              animation: 'billyJump 1.7s ease-in-out infinite',
              filter: 'drop-shadow(0 5px 14px rgba(0,61,165,0.45))',
              background: 'transparent',
            }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>
    </>
  );
}
