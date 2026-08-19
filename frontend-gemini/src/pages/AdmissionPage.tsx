import React from 'react';
import { PageId } from '../App';
import { useIsMobile } from '../hooks/use-mobile';

const NAVY      = '#003DA5';
const SCARLET   = '#C41230';
const LIGHT_GRAY = '#E6ECF6';
const TEXT_GRAY  = '#555555';
const WHITE      = '#FFFFFF';

const btnNavy: React.CSSProperties = { backgroundColor: NAVY, color: WHITE, fontWeight: 700, fontSize: 16, padding: '15px 32px', borderRadius: 4, border: 'none', cursor: 'pointer' };
const btnScarlet: React.CSSProperties = { ...btnNavy, backgroundColor: SCARLET };
const btnOutlineWhite: React.CSSProperties = { backgroundColor: 'transparent', color: WHITE, fontWeight: 700, fontSize: 16, padding: '13px 30px', borderRadius: 4, border: '2px solid white', cursor: 'pointer' };

export function AdmissionPage({ navigate }: { navigate: (p: PageId) => void }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ marginTop: 72 }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #003DA5 0%, #0044BB 100%)', padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }} onClick={() => navigate('home')}>Home</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Admission</span>
        </div>
        <h1 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 32 : 56, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, lineHeight: 1.2 }}>Begin Your DePaul Journey</h1>
        <p style={{ margin: '16px 0 0', color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? 16 : 20 }}>
          Join nearly 21,000 students at one of Chicago's most vibrant and diverse universities.
        </p>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, marginTop: 36, flexWrap: 'wrap' }}>
          <button style={btnScarlet}>Apply Now</button>
          <button style={btnOutlineWhite}>Request Info</button>
        </div>

        {/* Deadlines */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, marginTop: 48, flexWrap: 'wrap' }}>
          {[
            { date: 'Nov 15', label: 'Early Action Deadline' },
            { date: 'Feb 1',  label: 'Regular Decision Deadline' },
            { date: '$0',     label: 'No Application Fee' },
            { date: 'Rolling',label: 'Transfer Admissions' },
          ].map(({ date, label }) => (
            <div key={label} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '24px', textAlign: 'center', flex: 1, minWidth: 150 }}>
              <p style={{ margin: 0, color: WHITE, fontWeight: 700, fontSize: 28, fontFamily: "'Rethink Sans',sans-serif" }}>{date}</p>
              <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Paths */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: '0 auto', color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, textAlign: 'center' }}>Choose Your Path</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24, marginTop: 48 }}>

          {/* Undergrad */}
          <div style={{ backgroundColor: LIGHT_GRAY, borderRadius: 12, padding: 40 }}>
            <span style={{ fontSize: 48 }}>🎓</span>
            <h3 style={{ margin: '16px 0 0', color: NAVY, fontWeight: 700, fontSize: 22, fontFamily: "'Rethink Sans',sans-serif" }}>Undergraduate Admission</h3>
            <p style={{ margin: '12px 0 0', color: TEXT_GRAY, fontSize: 15, lineHeight: 1.7 }}>
              For high school students and transfer students seeking a bachelor's degree at DePaul.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
              {['Common Application accepted', 'No application fee', 'Rolling admissions available', 'Transfer credits evaluated'].map(item => (
                <li key={item} style={{ display: 'flex', gap: 8, color: TEXT_GRAY, fontSize: 14, marginBottom: 8 }}>
                  <span style={{ color: NAVY }}>✓</span>{item}
                </li>
              ))}
            </ul>
            <button style={{ ...btnNavy, marginTop: 24, width: '100%' }}>Apply for Undergrad →</button>
          </div>

          {/* Grad */}
          <div style={{ backgroundColor: NAVY, borderRadius: 12, padding: 40 }}>
            <span style={{ fontSize: 48 }}>📖</span>
            <h3 style={{ margin: '16px 0 0', color: WHITE, fontWeight: 700, fontSize: 22, fontFamily: "'Rethink Sans',sans-serif" }}>Graduate Admission</h3>
            <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7 }}>
              For students pursuing master's, doctoral, or professional degrees across DePaul's 10 colleges.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
              {['100+ graduate programs', 'Full and part-time options', 'GRE/GMAT waivers available', 'Online and hybrid programs'].map(item => (
                <li key={item} style={{ color: WHITE, fontSize: 14, marginBottom: 8 }}>✓ {item}</li>
              ))}
            </ul>
            <button style={{ ...btnNavy, backgroundColor: WHITE, color: NAVY, marginTop: 24, width: '100%' }}>Apply for Grad →</button>
          </div>

          {/* International */}
          <div style={{ backgroundColor: LIGHT_GRAY, borderRadius: 12, padding: 40 }}>
            <span style={{ fontSize: 48 }}>🌍</span>
            <h3 style={{ margin: '16px 0 0', color: NAVY, fontWeight: 700, fontSize: 22, fontFamily: "'Rethink Sans',sans-serif" }}>International Admission</h3>
            <p style={{ margin: '12px 0 0', color: TEXT_GRAY, fontSize: 15, lineHeight: 1.7 }}>
              DePaul welcomes students from around the world with dedicated support services for international applicants.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
              {['F-1 visa support', 'English proficiency assistance', 'International student services', 'Global community on campus'].map(item => (
                <li key={item} style={{ display: 'flex', gap: 8, color: TEXT_GRAY, fontSize: 14, marginBottom: 8 }}>
                  <span style={{ color: NAVY }}>✓</span>{item}
                </li>
              ))}
            </ul>
            <button style={{ ...btnNavy, marginTop: 24, width: '100%' }}>International Apply →</button>
          </div>
        </div>
      </section>

      {/* Visit */}
      <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '48px 24px' : '80px 120px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Visit DePaul</h2>
        <p style={{ margin: '16px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 18 }}>Experience our Lincoln Park and Loop campuses in person or virtually.</p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24, marginTop: 48 }}>
          {[
            { img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/c53e02f270f54a68bc3f3d43fd19adb8', title: 'Campus Tour',   desc: 'Walk through our historic Lincoln Park campus with a student guide.' },
            { img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/a5c14011e96449ca88243c5af0fed836', title: 'Open House', desc: 'Meet faculty, current students, and explore what DePaul has to offer.' },
            { img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/c2da1a39f2ba43ce9802e4a3a12519a7', title: 'Virtual Tour', desc: "Explore DePaul's campuses from anywhere in the world at your own pace." },
          ].map(({ img, title, desc }) => (
            <VisitCard key={title} img={img} title={title} desc={desc} />
          ))}
        </div>
      </section>

      {/* Why DePaul */}
      <section style={{ backgroundColor: NAVY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: '0 auto', color: WHITE, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, textAlign: 'center' }}>Why DePaul?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24, marginTop: 48 }}>
          {[
            { icon: '📍', title: 'Location',     desc: 'In the heart of Chicago\'s Lincoln Park and Loop' },
            { icon: '💰', title: 'Affordability',desc: 'Generous scholarships and financial aid packages' },
            { icon: '🌍', title: 'Diversity',    desc: '#1 most diverse university in the Midwest' },
            { icon: '💼', title: 'Career Ready', desc: '92% employment rate within 6 months of graduation' },
            { icon: '🏫', title: 'Class Size',   desc: '17:1 student-to-faculty ratio for personal attention' },
            { icon: '🎓', title: '300+ Programs',desc: 'Find the perfect program for your goals' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 28, textAlign: 'center' }}>
              <span style={{ fontSize: 36 }}>{icon}</span>
              <p style={{ margin: '12px 0 0', color: WHITE, fontWeight: 700, fontSize: 18 }}>{title}</p>
              <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function VisitCard({ img, title, desc }: { img: string; title: string; desc: string }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s',
      }}>
      <img src={img} alt={title} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', backgroundColor: '#ccc' }} />
      <div style={{ padding: 24 }}>
        <h3 style={{ margin: 0, color: '#003DA5', fontWeight: 700, fontSize: 18 }}>{title}</h3>
        <p style={{ margin: '8px 0 0', color: '#555', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
        <span style={{ color: '#003DA5', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'block', marginTop: 16 }}>Schedule →</span>
      </div>
    </div>
  );
}
