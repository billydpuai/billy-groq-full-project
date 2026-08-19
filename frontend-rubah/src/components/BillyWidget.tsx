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

const URL_REGEX = /(https?:\/\/[^\s]+[^\s.,;:!?)\]'"])/g;

function linkify(text: string, keyPrefix: string) {
  const parts = text.split(URL_REGEX);
  return parts.map((part, idx) => {
    if (/^https?:\/\//.test(part)) {
      return (
       <a 
          key={keyPrefix + '-' + idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: NAVY, textDecoration: 'underline', wordBreak: 'break-word', overflowWrap: 'anywhere' }}
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={keyPrefix + '-' + idx}>{part}</React.Fragment>;
  });
}

function formatBillyText(text: string) {
  if (!text) return null;
  const lines = text.split('\n').filter(l => l.trim());

  return (
    <div style={{ fontSize: '13px', lineHeight: '1.65', color: '#222', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('•')) {
          return (
            <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'flex-start' }}>
              <span style={{ color: '#003DA5', fontWeight: 'bold', flexShrink: 0 }}>•</span>
              <span>{linkify(trimmed.replace(/^•\s*/, ''), 'b' + i)}</span>
            </div>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'flex-start' }}>
              <span style={{ color: '#003DA5', fontWeight: 'bold', flexShrink: 0 }}>{trimmed.match(/^\d+\./)![0]}</span>
              <span>{linkify(trimmed.replace(/^\d+\.\s*/, ''), 'n' + i)}</span>
            </div>
          );
        }

        if (trimmed.endsWith(':') && trimmed.length < 55 && !trimmed.includes(',')) {
          return (
            <p key={i} style={{ fontWeight: '700', color: '#003DA5', margin: i === 0 ? '0' : '10px 0 3px' }}>{trimmed}</p>
          );
        }

        return (
          <p key={i} style={{ margin: i === 0 ? '0' : '6px 0 0' }}>{linkify(trimmed, 'p' + i)}</p>
        );
      })}
    </div>
  );
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.random() * 16 | 0;
    const value = character === 'x' ? random : (random & 0x3 | 0x8);
    return value.toString(16);
  });
}

export function BillyWidget() {
  const isMobile = useIsMobile();
  const [chatOpen, setChatOpen] = useState(false);
  const [view, setView] = useState<'chat' | 'confirm-close' | 'rating'>('chat');
  const conversationId = useRef(generateUUID());
  const [ratingVal, setRatingVal] = useState<'up' | 'down' | null>(null);
  const [feedbackVal, setFeedbackVal] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const activeRequestRef = useRef<AbortController | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'billy', text: "Hi! I'm Billy, DePaul's AI assistant. I can answer questions about admissions, financial aid, programs, campus life, and more. If I can't answer something, I'll draft an email to the right DePaul department for you! 😊" },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'billy-keyframes';
    style.textContent =
      '@keyframes billyJump {\n' +
      '  0%, 100% { transform: translateY(0px) rotate(0deg); }\n' +
      '  20% { transform: translateY(-16px) rotate(-3deg); }\n' +
      '  40% { transform: translateY(-8px) rotate(2deg); }\n' +
      '  60% { transform: translateY(-14px) rotate(-2deg); }\n' +
      '  80% { transform: translateY(-4px) rotate(1deg); }\n' +
      '}\n' +
      '@keyframes dotBounce {\n' +
      '  0%, 80%, 100% { transform: translateY(0); opacity: 1; }\n' +
      '  40%            { transform: translateY(-6px); opacity: 0.5; }\n' +
      '}\n' +
      '@keyframes labelPulse {\n' +
      '  0%, 100% { transform: scale(1); opacity: 1; }\n' +
      '  50% { transform: scale(1.04); opacity: 0.92; }\n' +
      '}\n';
    if (!document.getElementById('billy-keyframes')) {
      document.head.appendChild(style);
    }
    return () => { document.getElementById('billy-keyframes')?.remove(); };
  }, []);

  useEffect(() => {
    if (view === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, view]);

  const resetSession = () => {
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
    conversationId.current = generateUUID();
    setMessages([
      { role: 'billy', text: "Hi! I'm Billy, DePaul's AI assistant. I can answer questions about admissions, financial aid, programs, campus life, and more. If I can't answer something, I'll draft an email to the right DePaul department for you! 😊" },
    ]);
    setInputVal('');
    setLoading(false);
    setView('chat');
    setRatingVal(null);
    setFeedbackVal('');
    setFeedbackStatus('idle');
  };

  const submitFeedback = async (skip: boolean) => {
    if (skip || !ratingVal) {
      resetSession();
      setChatOpen(false);
      return;
    }

    activeRequestRef.current?.abort();
    const controller = new AbortController();
    const feedbackConversationId = conversationId.current;
    activeRequestRef.current = controller;
    setFeedbackStatus('submitting');
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);

    try {
      const response = await fetch('https://hurried-gazing-harmonize.ngrok-free.dev/api/conversation-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: feedbackConversationId,
          rating: ratingVal,
          feedback: feedbackVal,
        }),
        signal: controller.signal,
      });
      if (
        feedbackConversationId !== conversationId.current ||
        activeRequestRef.current !== controller
      ) return;
      if (!response.ok) throw new Error('Feedback request failed');
      resetSession();
      setChatOpen(false);
    } catch {
      if (
        feedbackConversationId === conversationId.current &&
        activeRequestRef.current === controller &&
        (timedOut || !controller.signal.aborted)
      ) {
        setFeedbackStatus('error');
      }
    } finally {
      window.clearTimeout(timeout);
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
      }
    }
  };

  const sendMessage = async () => {
    if (!inputVal.trim() || loading) return;
    const userMsg = inputVal.trim();
    const requestConversationId = conversationId.current;
    const controller = new AbortController();
    setInputVal('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setMessages(prev => [...prev, { role: 'loading', text: '' }]);
    setLoading(true);
    activeRequestRef.current = controller;
    try {
      const res = await fetch('https://hurried-gazing-harmonize.ngrok-free.dev/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg, user_id: 'anonymous', conversation_id: requestConversationId }),
        signal: controller.signal,
      });

      if (requestConversationId !== conversationId.current) return;
      if (!res.ok) {
        throw new Error('Request failed with status ' + res.status);
      }

      const data = await res.json() as {
        success: boolean;
        response?: string;
        intent?: string;
        num_documents?: number;
        documents?: unknown;
        no_answer?: boolean;
        error?: string;
      };
      if (requestConversationId !== conversationId.current) return;

      if (!data.success) {
        setMessages(prev =>
          prev.filter(m => m.role !== 'loading').concat({
            role: 'billy',
            text: data.error || "I'm having trouble finding an answer right now. Please try again.",
          })
        );
      } else if (data.no_answer === true) {
        try {
          const draftRes = await fetch('https://hurried-gazing-harmonize.ngrok-free.dev/api/draft-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: userMsg, user_id: 'anonymous', conversation_id: requestConversationId }),
            signal: controller.signal,
          });

          if (requestConversationId !== conversationId.current) return;
          if (!draftRes.ok) {
            throw new Error('Draft request failed with status ' + draftRes.status);
          }

          const draftData = await draftRes.json() as {
            success: boolean;
            recipient?: string;
            department_label?: string;
            subject?: string;
            body?: string;
          };
          if (requestConversationId !== conversationId.current) return;
          if (draftData.success) {
            setMessages(prev =>
              prev.filter(m => m.role !== 'loading').concat({
                role: 'billy',
                text: "I wasn't able to find a specific answer, but I've drafted an email to the right DePaul department for you:",
                emailDraft: sanitizeEmailDraft({
                  department: draftData.department_label || 'DePaul',
                  to: draftData.recipient || '',
                  subject: draftData.subject || '',
                  body: draftData.body || '',
                }),
              })
            );
          } else {
            setMessages(prev =>
              prev.filter(m => m.role !== 'loading').concat({
                role: 'billy',
                text: data.response || "I couldn't find an answer to that.",
              })
            );
          }
        } catch {
          if (requestConversationId === conversationId.current) {
            setMessages(prev =>
              prev.filter(m => m.role !== 'loading').concat({
                role: 'billy',
                text: data.response || "I couldn't find an answer to that.",
              })
            );
          }
        }
      } else {
        if (requestConversationId !== conversationId.current) return;
        setMessages(prev =>
          prev.filter(m => m.role !== 'loading').concat({
            role: 'billy',
            text: data.response || "I couldn't find an answer to that.",
            sources: sanitizeSources(data.documents),
          })
        );
      }
    } catch {
      if (requestConversationId === conversationId.current) {
        setMessages(prev =>
          prev.filter(m => m.role !== 'loading').concat({
            role: 'billy',
            text: "I'm having trouble connecting right now. Please try again in a moment.",
          })
        );
      }
    } finally {
      if (requestConversationId === conversationId.current) {
        setLoading(false);
      }
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
      }
    }
  };

  return (
    <>
      <div style={{ position: 'fixed', bottom: isMobile ? 16 : 28, right: isMobile ? 16 : 28, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>

        {chatOpen && (
          <div style={{
            position: 'absolute', bottom: 100, right: 0,
            width: isMobile ? 'calc(100vw - 32px)' : 390,
            height: isMobile ? 'min(540px, calc(100vh - 160px))' : 540,
            background: '#fff', borderRadius: 20,
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div style={{
              background: NAVY, padding: '14px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/billy-v3.png" alt="Billy mascot" width={40} height={40} style={{ objectFit: 'contain', borderRadius: '50%', background: '#ffffff', padding: 2 }} />
                <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 14 }}>Billy — DePaul's AI Assistant</p>
              </div>
              <button
                onClick={() => {
                  if (view === 'chat') {
                    setView('confirm-close');
                  } else if (view === 'confirm-close') {
                    setView('chat');
                  } else {
                    resetSession();
                    setChatOpen(false);
                  }
                }}
                aria-label="Close chat"
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', opacity: 0.8, lineHeight: 1 }}
              >✕</button>
            </div>

            <div style={{
              flex: 1, overflowY: 'auto', padding: 16,
              display: 'flex', flexDirection: 'column', gap: 12,
              background: '#FAFAFA',
            }}>
              {view === 'confirm-close' ? (
                <div style={{ margin: 'auto 0', textAlign: 'center', padding: '8px 4px' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>👋</div>
                  <h3 style={{ margin: '0 0 8px', color: NAVY, fontSize: 20 }}>End conversation?</h3>
                  <p style={{ margin: '0 0 24px', color: '#666', fontSize: 14, lineHeight: 1.5 }}>
                    Are you ready to finish chatting with Billy?
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" onClick={() => setView('chat')} style={{ flex: 1, padding: 12, background: '#f2f2f2', color: '#333', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}>No, keep chatting</button>
                    <button type="button" onClick={() => {
                      if (messages.some((message) => message.role === 'user')) {
                        setView('rating');
                      } else {
                        resetSession();
                        setChatOpen(false);
                      }
                    }} style={{ flex: 1, padding: 12, background: SCARLET, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}>Yes, end</button>
                  </div>
                </div>
              ) : view === 'rating' ? (
                <div style={{ margin: 'auto 0', textAlign: 'center', padding: '0 4px' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                  <h3 style={{ margin: '0 0 6px', color: NAVY, fontSize: 20 }}>How did Billy do?</h3>
                  <p style={{ margin: '0 0 18px', color: '#666', fontSize: 13, lineHeight: 1.5 }}>Your feedback helps us improve DePaul AI assistance.</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                    <button type="button" onClick={() => { setRatingVal('up'); setFeedbackStatus('idle'); }} aria-label="Thumbs up — helpful" style={{ width: 78, minHeight: 72, borderRadius: 12, border: ratingVal === 'up' ? `2px solid ${NAVY}` : '1px solid #ddd', background: ratingVal === 'up' ? '#eaf1fb' : '#fff', color: NAVY, cursor: 'pointer', fontSize: 25 }}>👍<span style={{ display: 'block', fontSize: 11, marginTop: 3 }}>Helpful</span></button>
                    <button type="button" onClick={() => { setRatingVal('down'); setFeedbackStatus('idle'); }} aria-label="Thumbs down — not helpful" style={{ width: 78, minHeight: 72, borderRadius: 12, border: ratingVal === 'down' ? `2px solid ${SCARLET}` : '1px solid #ddd', background: ratingVal === 'down' ? '#fcecef' : '#fff', color: SCARLET, cursor: 'pointer', fontSize: 25 }}>👎<span style={{ display: 'block', fontSize: 11, marginTop: 3 }}>Not helpful</span></button>
                  </div>
                  {ratingVal && (
                    <textarea
                      value={feedbackVal}
                      onChange={(event) => setFeedbackVal(event.target.value)}
                      placeholder="Tell us more (optional)"
                      maxLength={2000}
                      aria-label="Optional feedback"
                      style={{ width: '100%', height: 82, padding: 12, boxSizing: 'border-box', borderRadius: 12, borderWidth: 1, borderStyle: 'solid', borderColor: '#ddd', fontSize: 13, resize: 'none', fontFamily: 'inherit', outline: 'none' }}
                    />
                  )}
                  {feedbackStatus === 'error' && <p style={{ margin: '8px 0 0', color: SCARLET, fontSize: 12 }}>Could not submit feedback. Please try again.</p>}
                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    <button type="button" onClick={() => submitFeedback(true)} disabled={feedbackStatus === 'submitting'} style={{ flex: 1, padding: 11, background: '#f2f2f2', color: '#555', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}>Skip</button>
                    <button type="button" onClick={() => submitFeedback(false)} disabled={!ratingVal || feedbackStatus === 'submitting'} style={{ flex: 1.4, padding: 11, background: !ratingVal || feedbackStatus === 'submitting' ? '#e0a0a9' : SCARLET, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, cursor: !ratingVal || feedbackStatus === 'submitting' ? 'not-allowed' : 'pointer' }}>{feedbackStatus === 'submitting' ? 'Submitting…' : feedbackStatus === 'error' ? 'Retry' : 'Submit feedback'}</button>
                  </div>
                </div>
              ) : (
                <>
              {messages.map((msg, i) => {
                if (msg.role === 'loading') {
                  return (
                    <div key={i} style={{ alignSelf: 'flex-start' }}>
                      <div style={{ background: '#fff', borderRadius: 18, padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: 6, alignItems: 'center' }}>
                        {[0, 1, 2].map((d) => (
                          <div key={d} style={{
                            width: 6, height: 6, borderRadius: '50%', background: '#999',
                            animation: 'dotBounce 1.2s ease-in-out ' + (d * 0.2) + 's infinite',
                          }} />
                        ))}
                      </div>
                    </div>
                  );
                }
                if (msg.role === 'billy') {
                  return (
                    <div key={i} style={{ alignSelf: 'flex-start', maxWidth: '78%', minWidth: 0 }}>
                      <div style={{
                        background: '#fff', borderRadius: '18px 18px 18px 4px', padding: '12px 16px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        wordBreak: 'break-word', overflowWrap: 'anywhere',
                      }}>
                        <div>{formatBillyText(msg.text)}</div>
                        {msg.sources && msg.sources.length > 0 && (
                          <div style={{ marginTop: 8, borderTop: '1px solid #eee', paddingTop: 8 }}>
                            {msg.sources.map((src, si) => (
                              <a key={si} href={src} target="_blank" rel="noopener noreferrer"
                                style={{
                                  display: 'block', color: '#999', fontSize: 10.5, textDecoration: 'none',
                                  wordBreak: 'break-word', overflowWrap: 'anywhere',
                                }}>
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
                            <div style={{ fontSize: 12, color: '#555', marginBottom: 6, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                              <span style={{ fontWeight: 700, color: NAVY }}>To: </span>{msg.emailDraft.department}
                            </div>
                            <div style={{ fontSize: 12, color: '#555', marginBottom: 6, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                              <span style={{ fontWeight: 700, color: NAVY }}>Email: </span>
                              <a href={'mailto:' + msg.emailDraft.to} style={{ color: SCARLET }}>{msg.emailDraft.to}</a>
                            </div>
                            <div style={{ fontSize: 12, color: '#555', marginBottom: 10, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                              <span style={{ fontWeight: 700, color: NAVY }}>Subject: </span>{msg.emailDraft.subject}
                            </div>
                            <div style={{
                              background: '#fff', borderRadius: 8, padding: 12, fontSize: 12, color: '#333',
                              lineHeight: 1.7, whiteSpace: 'pre-wrap', border: '1px solid #ddd', maxHeight: 140, overflowY: 'auto',
                              wordBreak: 'break-word', overflowWrap: 'anywhere',
                            }}>
                              {msg.emailDraft.body}
                            </div>
                            <button
                              onClick={() => {
                                const draft = msg.emailDraft!;
                                const mailto = 'mailto:' + draft.to + '?subject=' + encodeURIComponent(draft.subject) + '&body=' + encodeURIComponent(draft.body);
                                window.open(mailto);
                              }}
                              style={{ marginTop: 10, background: NAVY, color: '#fff', border: 'none', borderRadius: 20, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%' }}
                            >
                              📧 Open in Email App
                            </button>
                            <button
                              onClick={() => {
                                const draft = msg.emailDraft!;
                                navigator.clipboard.writeText('To: ' + draft.to + '\nSubject: ' + draft.subject + '\n\n' + draft.body);
                              }}
                              style={{ marginTop: 6, background: 'transparent', color: NAVY, border: '1px solid ' + NAVY, borderRadius: 20, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%' }}
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
                  <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '78%', minWidth: 0 }}>
                    <div style={{
                      background: SCARLET, borderRadius: '18px 18px 4px 18px', padding: '12px 16px',
                      wordBreak: 'break-word', overflowWrap: 'anywhere',
                    }}>
                      <p style={{ margin: 0, color: '#fff', fontSize: 13.5, lineHeight: 1.65 }}>{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {view === 'chat' && <div style={{ padding: '12px 16px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                placeholder="Ask me anything..."
                disabled={loading}
                style={{
                  flex: 1, borderWidth: 1.5, borderStyle: 'solid', borderColor: '#ddd', borderRadius: 24,
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
            </div>}
            <p style={{ margin: '0 16px 10px', fontSize: 10.5, color: '#999', textAlign: 'center', display: view === 'chat' ? 'block' : 'none' }}>
              Billy can make mistakes. Please double-check important information.
            </p>
          </div>
        )}

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

        <div
          onClick={() => {
            if (!chatOpen) {
              setChatOpen(true);
            } else if (view === 'chat') {
              setView('confirm-close');
            } else if (view === 'confirm-close') {
              setView('chat');
            } else {
              resetSession();
              setChatOpen(false);
            }
          }}
          style={{ cursor: 'pointer', width: '68px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', padding: 0 }}
        >
          <img
            src="/billy-v3.png"
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