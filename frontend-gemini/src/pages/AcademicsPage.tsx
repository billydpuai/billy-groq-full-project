import React, { useState } from 'react';
import { PageId } from '../App';
import { useIsMobile } from '../hooks/use-mobile';

const NAVY      = '#003DA5';
const SCARLET   = '#C41230';
const LIGHT_BLUE = '#4B8FE2';
const LIGHT_GRAY = '#E6ECF6';
const TEXT_GRAY  = '#555555';
const WHITE      = '#FFFFFF';

const btnNavy: React.CSSProperties = { backgroundColor: NAVY, color: WHITE, fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 4, border: 'none', cursor: 'pointer' };
const btnOutlineWhite: React.CSSProperties = { backgroundColor: 'transparent', color: WHITE, fontWeight: 700, fontSize: 15, padding: '12px 26px', borderRadius: 4, border: '2px solid white', cursor: 'pointer' };

const COLLEGES = [
  { name: 'Driehaus College of Business',              desc: 'Finance, Accounting, Management, Marketing & more' },
  { name: 'College of Liberal Arts and Social Sciences',desc: 'Psychology, Political Science, Sociology & more' },
  { name: 'Jarvis College of Computing and Digital Media', desc: 'Computer Science, Game Design, AI & more' },
  { name: 'College of Communication',                  desc: 'Journalism, PR, Media Studies & more' },
  { name: 'College of Science and Health',             desc: 'Biology, Chemistry, Nursing, Kinesiology & more' },
  { name: 'College of Education',                      desc: 'Elementary Ed, Special Ed, Counseling & more' },
  { name: 'College of Law',                            desc: 'JD, LLM programs in the Loop' },
  { name: 'School of Music',                           desc: 'Performance, Music Education, Jazz Studies' },
  { name: 'The Theatre School',                        desc: 'Acting, Directing, Theatre Management' },
  { name: 'School of Continuing and Professional Studies', desc: 'Professional certificates and adult learning' },
];

function CollegeCard({ name, desc }: { name: string; desc: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: hov ? LIGHT_GRAY : WHITE, border: `1.5px solid ${NAVY}`,
        borderRadius: 8, padding: '24px 28px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s',
      }}>
      <div>
        <h3 style={{ margin: 0, color: NAVY, fontWeight: 700, fontSize: 17 }}>{name}</h3>
        <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>{desc}</p>
      </div>
      <span style={{ color: NAVY, fontWeight: 700, fontSize: 20, marginLeft: 12 }}>→</span>
    </div>
  );
}

export function AcademicsPage({ navigate }: { navigate: (p: PageId) => void }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ marginTop: 72 }}>

      {/* Hero */}
      <section style={{ backgroundColor: NAVY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }} onClick={() => navigate('home')}>Home</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>›</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Academics</span>
        </div>
        <h1 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 32 : 56, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Academics at DePaul</h1>
        <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? 16 : 20 }}>
          Discover 300+ programs across 10 colleges and schools in the heart of Chicago.
        </p>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
          <button style={btnNavy}>Find a Program</button>
          <button style={btnOutlineWhite}>View All Colleges</button>
        </div>
      </section>

      {/* Program Search */}
      <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '40px 24px' : '60px 120px' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 24 : 36, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, textAlign: 'center' }}>Find Your Program</h2>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, maxWidth: 700, margin: '28px auto 0' }}>
          <input style={{ flex: 1, border: '1.5px solid #ddd', borderRadius: 30, padding: '14px 24px', fontSize: 15, outline: 'none' }}
            placeholder="Search programs, majors, certificates..." />
          <button style={{ backgroundColor: SCARLET, color: WHITE, fontWeight: 700, border: 'none', borderRadius: 30, padding: '14px 28px', cursor: 'pointer', fontSize: 15 }}>Search</button>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          {['Undergraduate', 'Graduate', 'Online'].map(f => (
            <FilterPill key={f} label={f} />
          ))}
        </div>
      </section>

      {/* Colleges */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Colleges and Schools</h2>
        <hr style={{ border: 'none', backgroundColor: NAVY, height: 2, margin: '20px 0 32px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
          {COLLEGES.map(c => <CollegeCard key={c.name} {...c} />)}
        </div>
      </section>

      {/* Layered Learning */}
      <section style={{ backgroundColor: NAVY, padding: isMobile ? '48px 24px' : '80px 120px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 32 : 80, alignItems: 'center' }}>
        <div style={{ flex: isMobile ? '0 0 auto' : '0 0 45%', width: isMobile ? '100%' : 'auto', backgroundColor: 'rgba(255,255,255,0.08)', height: isMobile ? 200 : 380, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 80 }}>📚</span>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 28 : 42, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Layered-Learning™</h2>
          <p style={{ margin: '20px 0 0', color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? 15 : 17, lineHeight: 1.75 }}>
            DePaul's distinctive educational approach integrates classroom instruction, hands-on project work,
            and community-based service learning to create a richer, more meaningful degree experience.
          </p>
          <div style={{ marginTop: 28 }}>
            {[
              'Classroom Learning — Deep theoretical foundations',
              'Project-Based Learning — Real-world problem solving',
              'Service Learning — Community impact and giving back',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                <span style={{ color: LIGHT_BLUE, fontSize: 18, fontWeight: 700, flexShrink: 0 }}>✓</span>
                <p style={{ margin: 0, color: WHITE, fontSize: 15, lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>
          <button style={{ ...btnNavy, marginTop: 24, backgroundColor: WHITE, color: NAVY }}>Explore Layered-Learning™ →</button>
        </div>
      </section>

      {/* Research */}
      <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Research & Innovation</h2>
        <p style={{ margin: '16px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17 }}>
          DePaul faculty and students engage in research that addresses real-world challenges and advances knowledge across disciplines.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24, marginTop: 40 }}>
          {[
            { icon: '🔬', title: 'Science & Health Research',   desc: 'Cutting-edge biomedical, environmental, and public health research advancing human wellbeing.' },
            { icon: '💻', title: 'Technology & Computing',       desc: 'Pioneering research in AI, cybersecurity, data science, and human-computer interaction.' },
            { icon: '📊', title: 'Business & Social Sciences',   desc: 'Applied research connecting market innovation, behavioral insights, and community development.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ backgroundColor: WHITE, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ backgroundColor: NAVY, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 60 }}>{icon}</span>
              </div>
              <div style={{ padding: 28 }}>
                <h3 style={{ margin: 0, color: NAVY, fontWeight: 700, fontSize: 20 }}>{title}</h3>
                <p style={{ margin: '12px 0 0', color: TEXT_GRAY, fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
                <span style={{ color: NAVY, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'block', marginTop: 20 }}>Explore Research →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FilterPill({ label }: { label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${NAVY}`, borderRadius: 20, padding: '8px 20px',
        color: hov ? WHITE : NAVY, fontSize: 13, cursor: 'pointer',
        backgroundColor: hov ? NAVY : 'transparent', transition: 'all 0.2s',
      }}>{label}</span>
  );
}
