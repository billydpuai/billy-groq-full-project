import React from 'react';
import { PageId } from '../App';
import { useIsMobile } from '../hooks/use-mobile';

const NAVY      = '#003DA5';
const LIGHT_GRAY = '#E6ECF6';
const TEXT_GRAY  = '#555555';
const WHITE      = '#FFFFFF';

const btnNavy: React.CSSProperties = { backgroundColor: NAVY, color: WHITE, fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 4, border: 'none', cursor: 'pointer' };

export function StudentLifePage({ navigate }: { navigate: (p: PageId) => void }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ marginTop: 72 }}>

      {/* Hero */}
      <section style={{ backgroundColor: NAVY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }} onClick={() => navigate('home')}>Home</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Student Life</span>
        </div>
        <h1 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 32 : 56, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, lineHeight: 1.2 }}>Life at DePaul</h1>
        <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? 16 : 20 }}>
          350+ student organizations, two vibrant campuses, and the city of Chicago as your classroom.
        </p>
      </section>

      {/* Quick stats */}
      <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '40px 24px' : '60px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 16 : 24 }}>
          {[
            { val: '350+', label: 'Student Organizations' },
            { val: '2',    label: 'Campuses' },
            { val: '27',   label: 'Sports Teams' },
            { val: '15k+', label: 'On-campus Events / Year' },
          ].map(({ val, label }) => (
            <div key={label} style={{ backgroundColor: WHITE, borderRadius: 12, padding: isMobile ? '24px 16px' : '32px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p style={{ margin: 0, color: NAVY, fontSize: isMobile ? 34 : 48, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>{val}</p>
              <p style={{ margin: '8px 0 0', color: '#888', fontSize: isMobile ? 13 : 15 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Campuses */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Our Campuses</h2>
        <p style={{ margin: '16px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17 }}>DePaul has two main campuses, each with a unique character and community.</p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : 32, marginTop: 48 }}>
          {[
            { img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/e124f62bf772431ea410ccf4984f9be8', name: 'Lincoln Park Campus',  desc: 'A classic residential campus set in one of Chicago\'s most beautiful neighborhoods. Home to the College of Liberal Arts, Education, Theatre School, and more. Vibrant student housing, dining, and recreation.' },
            { img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/1504203b27a2411198499715fb86bb5d', name: 'Loop Campus',          desc: 'At the heart of Chicago\'s business district, the Loop campus is home to the Driehaus College of Business, College of Law, and School of Continuing and Professional Studies — with immediate access to corporate Chicago.' },
          ].map(({ img, name, desc }) => (
            <div key={name} style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <img src={img} alt={name} style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', backgroundColor: '#c5d0e0' }} />
              <div style={{ padding: 32 }}>
                <h3 style={{ margin: 0, color: NAVY, fontSize: 24, fontWeight: 700 }}>{name}</h3>
                <p style={{ margin: '12px 0 0', color: TEXT_GRAY, fontSize: 15, lineHeight: 1.7 }}>{desc}</p>
                <button style={{ ...btnNavy, marginTop: 24 }}>Explore Campus →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activities */}
      <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, textAlign: 'center' }}>Get Involved</h2>
        <p style={{ margin: '16px auto 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17, textAlign: 'center', maxWidth: 600 }}>
          From student government to Greek life, intramurals to arts clubs, there's a place for everyone at DePaul.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24, marginTop: 48 }}>
          {[
            { icon: '⚡', title: 'Student Government',    desc: 'Shape campus policy and represent your fellow Blue Demons.' },
            { icon: '🎭', title: 'Arts & Culture',        desc: 'Performances, exhibitions, and cultural events year-round.' },
            { icon: '🏀', title: 'Blue Demon Athletics',  desc: 'Cheer on our NCAA Division I teams at Wintrust Arena.' },
            { icon: '🤝', title: 'Community Service',     desc: 'Service-learning and volunteering with 250+ partner organizations.' },
            { icon: '🎶', title: 'Music & Entertainment', desc: 'Live music, open mics, comedy nights, and DePaul Unplugged.' },
            { icon: '🌐', title: 'Cultural Clubs',        desc: '80+ cultural and identity-based organizations on campus.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ backgroundColor: WHITE, borderRadius: 12, padding: 28, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: 40 }}>{icon}</span>
              <h3 style={{ margin: '12px 0 0', color: NAVY, fontWeight: 700, fontSize: 18 }}>{title}</h3>
              <p style={{ margin: '8px 0 0', color: TEXT_GRAY, fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Housing */}
      <section style={{ backgroundColor: NAVY, padding: isMobile ? '48px 24px' : '80px 120px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 32 : 80, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Housing & Dining</h2>
          <p style={{ margin: '20px 0 0', color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? 15 : 17, lineHeight: 1.75 }}>
            DePaul offers a variety of on-campus housing options in the heart of Lincoln Park.
            From suite-style to apartment living, our residence halls create community and connection.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28 }}>
            {['6 residence halls in Lincoln Park', 'Dining halls with diverse menus', '24/7 security and support', 'Furnished rooms with high-speed Wi-Fi'].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, color: WHITE, fontSize: 15 }}>
                <span style={{ color: '#4B8FE2' }}>✓</span>{item}
              </div>
            ))}
          </div>
          <button style={{ ...btnNavy, backgroundColor: WHITE, color: NAVY, marginTop: 32 }}>Explore Housing →</button>
        </div>
        <div style={{ flex: isMobile ? '0 0 auto' : '0 0 42%', width: isMobile ? '100%' : 'auto', height: isMobile ? 220 : 360, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>🏠</div>
      </section>
    </div>
  );
}
