import React, { useState } from 'react';
import { PageId } from '../App';
import { useIsMobile } from '../hooks/use-mobile';

const NAVY    = '#003DA5';
const SCARLET = '#C41230';
const LIGHT_GRAY = '#E6ECF6';
const TEXT_GRAY  = '#555555';
const WHITE   = '#FFFFFF';

const btnNavy: React.CSSProperties = {
  backgroundColor: NAVY, color: WHITE, fontWeight: 700, fontSize: 15,
  padding: '14px 28px', borderRadius: 4, border: 'none', cursor: 'pointer',
};

type TabId = 'overview' | 'leadership' | 'mission' | 'rankings';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview',    label: 'Overview' },
  { id: 'leadership',  label: 'Leadership' },
  { id: 'mission',     label: 'Mission & History' },
  { id: 'rankings',    label: 'Rankings' },
];

export function AboutPage({ navigate }: { navigate: (p: PageId) => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const isMobile = useIsMobile();

  return (
    <div style={{ marginTop: 72 }}>

      {/* Hero */}
      <section style={{ backgroundColor: NAVY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
          <button
            onClick={() => navigate('home')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', padding: 0 }}
          >Home</button>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }} aria-hidden="true">›</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>About DePaul</span>
        </nav>
        <h1 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 32 : 56, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, lineHeight: 1.2 }}>
          About DePaul
        </h1>
        <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? 16 : 20 }}>
          Chicago's university since 1898 — rooted in mission, driven by impact.
        </p>
      </section>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="About DePaul sections"
        style={{ backgroundColor: WHITE, borderBottom: '1px solid #eee', padding: isMobile ? '0 12px' : '0 120px', display: 'flex', overflowX: isMobile ? 'auto' : 'visible' }}
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            id={`tab-${id}`}
            aria-selected={id === activeTab}
            aria-controls={`panel-${id}`}
            onClick={() => setActiveTab(id)}
            style={{
              padding: isMobile ? '16px 14px' : '16px 24px', color: NAVY, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderBottom: `3px solid ${id === activeTab ? SCARLET : 'transparent'}`,
              background: 'none', border: 'none',
              borderBottomStyle: 'solid', borderBottomWidth: 3,
              borderBottomColor: id === activeTab ? SCARLET : 'transparent',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => { if (id !== activeTab) e.currentTarget.style.borderBottomColor = 'rgba(196,18,48,0.3)'; }}
            onMouseLeave={e => { if (id !== activeTab) e.currentTarget.style.borderBottomColor = 'transparent'; }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW panel ── */}
      <div
        role="tabpanel"
        id="panel-overview"
        aria-labelledby="tab-overview"
        hidden={activeTab !== 'overview'}
      >
        <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '48px 24px' : '80px 120px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 32 : 80, alignItems: 'center' }}>
          <div style={{ flex: isMobile ? '0 0 auto' : '0 0 48%', width: isMobile ? '100%' : 'auto' }}>
            <img src="/images/layered.png" alt="DePaul students" style={{ width: '100%', height: isMobile ? 240 : 400, objectFit: 'cover', borderRadius: 16, display: 'block', backgroundColor: '#ccc' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>DePaul University</h2>
            <p style={{ margin: '20px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17, lineHeight: 1.75 }}>
              DePaul University is the largest Catholic university in the United States and one of the largest private universities in the country, with nearly 21,000 students.
            </p>
            <p style={{ margin: '16px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17, lineHeight: 1.75 }}>
              Founded in 1898 by the Vincentian Fathers, DePaul's mission centers on access to education, social justice and service to others. Today, DePaul is a comprehensive urban research university with 10 colleges and schools offering more than 300 undergraduate and graduate programs.
            </p>
            <button style={{ ...btnNavy, marginTop: 28 }}>Learn Our History →</button>
          </div>
        </section>

        {/* By the Numbers */}
        <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px' }}>
          <h2 style={{ margin: '0 auto', color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, textAlign: 'center' }}>DePaul by the Numbers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', marginTop: 48, border: '1px solid #eee' }}>
            {[
              { val: '21,210', label: 'Students' },
              { val: '300+',   label: 'Programs' },
              { val: '10',     label: 'Colleges & Schools' },
              { val: '1898',   label: 'Founded' },
            ].map(({ val, label }, i) => (
              <div key={label} style={{ padding: isMobile ? 24 : 40, textAlign: 'center', borderRight: !isMobile && i < 3 ? '1px solid #eee' : 'none' }}>
                <p style={{ margin: 0, color: NAVY, fontSize: isMobile ? 34 : 52, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>{val}</p>
                <p style={{ margin: '8px 0 0', color: '#888', fontSize: isMobile ? 14 : 16 }}>{label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── LEADERSHIP panel ── */}
      <div
        role="tabpanel"
        id="panel-leadership"
        aria-labelledby="tab-leadership"
        hidden={activeTab !== 'leadership'}
      >
        <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
          <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Leadership and Administration</h2>
          <p style={{ margin: '16px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17 }}>DePaul is led by a team committed to academic excellence and the university's Vincentian mission.</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24, marginTop: 40 }}>
            {[
              { name: 'Robert L. Manuel', title: 'President', img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/4db69bc80b894c4c8d7aaf99ab2405df' },
              { name: 'Salma Ghanem',     title: 'Provost',   img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/46140678bd494e85a3bb077e24fa260b' },
              { name: 'Robert Kozoman',   title: 'CFO',       img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/2df7ca78398e41d5b100dfbeb89b22ad' },
            ].map(({ name, title, img }) => (
              <div key={name} style={{ backgroundColor: WHITE, borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <img src={img} alt={name} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block', backgroundColor: '#ddd' }} />
                <div style={{ padding: 20 }}>
                  <h3 style={{ margin: 0, color: NAVY, fontWeight: 700, fontSize: 18 }}>{name}</h3>
                  <p style={{ margin: '4px 0 0', color: '#888', fontSize: 14 }}>{title}</p>
                  <button style={{ background: 'none', border: 'none', color: NAVY, fontSize: 13, cursor: 'pointer', padding: '12px 0 0', display: 'block', fontWeight: 700 }}>
                    Read Bio →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── MISSION panel ── */}
      <div
        role="tabpanel"
        id="panel-mission"
        aria-labelledby="tab-mission"
        hidden={activeTab !== 'mission'}
      >
        <section style={{ backgroundColor: NAVY, padding: isMobile ? '48px 24px' : '80px 120px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Our Vincentian Mission</h2>
          <p style={{ margin: '24px auto', color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? 16 : 19, lineHeight: 1.8, maxWidth: 800 }}>
            DePaul University is committed to the belief that all people, regardless of their economic or social status, deserve access to a high-quality education. As an institution founded on Vincentian principles, we believe that education is the great equalizer — a path to dignity, purpose, and meaningful contribution to society.
          </p>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 32, justifyContent: 'center', alignItems: 'center', marginTop: 48, flexWrap: 'wrap' }}>
            {[
              { icon: '🤝', title: 'Service',  desc: 'Commitment to helping others' },
              { icon: '📚', title: 'Education',desc: 'Access to quality learning for all' },
              { icon: '✝️', title: 'Faith',    desc: 'Rooted in Catholic Vincentian values' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 32, width: isMobile ? '100%' : 220, maxWidth: isMobile ? 320 : 220 }}>
                <span style={{ fontSize: 36 }}>{icon}</span>
                <p style={{ margin: '12px 0 0', color: WHITE, fontWeight: 700, fontSize: 18 }}>{title}</p>
                <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px' }}>
          <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Founded in 1898</h2>
          <p style={{ margin: '20px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17, lineHeight: 1.8, maxWidth: 760 }}>
            DePaul was founded on Chicago's North Side by the Congregation of the Mission (Vincentians), a Roman Catholic order
            dedicated to serving the poor. The university was named after St. Vincent de Paul, the 17th-century French priest
            who championed service to the marginalized.
          </p>
          <p style={{ margin: '16px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17, lineHeight: 1.8, maxWidth: 760 }}>
            From those humble beginnings, DePaul has grown into one of the largest and most diverse private universities
            in the United States while staying true to its founding values of inclusion, service, and social justice.
          </p>
        </section>
      </div>

      {/* ── RANKINGS panel ── */}
      <div
        role="tabpanel"
        id="panel-rankings"
        aria-labelledby="tab-rankings"
        hidden={activeTab !== 'rankings'}
      >
        <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px' }}>
          <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Rankings & Accolades</h2>
          <p style={{ margin: '16px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17 }}>DePaul consistently earns recognition for academic excellence, diversity, and student outcomes.</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24, marginTop: 40 }}>
            {[
              { icon: '🏆', val: '#1',    desc: 'Most Diverse University in the Midwest',   source: 'U.S. News & World Report' },
              { icon: '⭐', val: 'Top 10',desc: 'Best Value Universities in Illinois',       source: 'Forbes' },
              { icon: '🎓', val: '92%',   desc: 'Graduate Employment Rate',                 source: 'DePaul Career Center' },
              { icon: '🌍', val: '100+',  desc: 'Countries Represented in Student Body',    source: 'International Programs' },
              { icon: '💼', val: '250+',  desc: 'Corporate & Nonprofit Partners',           source: 'Career Center' },
              { icon: '📖', val: '300+',  desc: 'Academic Programs Available',              source: 'Academic Affairs' },
            ].map(({ icon, val, desc, source }) => (
              <RankingCard key={val + desc} icon={icon} val={val} desc={desc} source={source} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function RankingCard({ icon, val, desc, source }: { icon: string; val: string; desc: string; source: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: '#E6ECF6', borderRadius: 8, padding: 32, textAlign: 'center',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.1)' : 'none', transition: 'box-shadow 0.2s',
      }}>
      <span style={{ fontSize: 40 }}>{icon}</span>
      <p style={{ margin: '12px 0 0', color: '#003DA5', fontSize: 48, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>{val}</p>
      <p style={{ margin: '8px 0 0', color: '#555', fontSize: 15, lineHeight: 1.5 }}>{desc}</p>
      <p style={{ margin: '8px 0 0', color: '#888', fontSize: 12, fontStyle: 'italic' }}>{source}</p>
    </div>
  );
}
