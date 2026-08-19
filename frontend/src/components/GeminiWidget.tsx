import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '../hooks/use-mobile';

const NAVY   = '#003DA5';
const SCARLET = '#C41230';
const PURPLE = '#8B5CF6';

interface Message {
  role: 'billy' | 'user' | 'loading';
  text: string;
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

export function GeminiWidget() {
  const isMobile = useIsMobile();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'billy', text: "Hi! I'm Billy, running on Gemini (test build). I can answer questions about admissions, financial aid, programs, campus life, and more. 😊" },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'gemini-keyframes';
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
      '}\n';
    if (!document.getElementById('gemini-keyframes')) {
      document.head.appendChild(style);
    }
    return () => { document.getElementById('gemini-keyframes')?.remove(); };
  }, []);

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
      // NOTE: Eman's tunnel URL changes whenever she restarts it (running
      // locally on her laptop, no hosting yet) -- update this if it breaks.
      const res = await fetch('https://pulp-penny-tumbling.ngrok-free.dev/inference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg, context: '', intent: 'precision' }),
      });

      if (!res.ok) {
        throw new Error('Request failed with status ' + res.status);
      }

      const data = await res.json() as {
        answer?: string;
        success?: boolean;
        response_time_ms?: number;
        source?: string;
      };

      if (!data.success) {
        setMessages(prev =>
          prev.filter(m => m.role !== 'loading').concat({
            role: 'billy',
            text: "Sorry, I couldn't get an answer from Gemini right now.",
          })
        );
      } else {
        setMessages(prev =>
          prev.filter(m => m.role !== 'loading').concat({
            role: 'billy',
            text: data.answer || "Sorry, I could not find an answer.",
          })
        );
      }
    } catch {
      setMessages(prev =>
        prev.filter(m => m.role !== 'loading').concat({
          role: 'billy',
          text: 'Sorry, something went wrong. Please try again in a moment.',
        })
      );
    }
    setLoading(false);
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
                <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 14 }}>Gemini</p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                aria-label="Close chat"
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', opacity: 0.8, lineHeight: 1 }}
              >✕</button>
            </div>

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
            </div>

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
            <p style={{ margin: '0 16px 10px', fontSize: 10.5, color: '#999', textAlign: 'center' }}>
              Gemini test build. Response times may be slow.
            </p>
          </div>
        )}

        {!chatOpen && (
          <div
            onClick={() => setChatOpen(true)}
            style={{
              background: PURPLE,
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              padding: '7px 13px',
              borderRadius: '14px',
              marginBottom: '8px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              letterSpacing: '0.2px',
              boxShadow: '0 2px 10px rgba(139,92,246,0.4)',
            }}
          >
            Ask Billy (Gemini)!
          </div>
        )}

        <div
          onClick={() => setChatOpen(!chatOpen)}
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
              filter: 'drop-shadow(0 5px 14px rgba(139,92,246,0.5))',
              background: 'transparent',
            }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>
    </>
  );
}
