import React from 'react';
import { PageId } from '../App';
import { useIsMobile } from '../hooks/use-mobile';

const NAVY      = '#003DA5';
const SCARLET   = '#C41230';
const LIGHT_GRAY = '#E6ECF6';
const TEXT_GRAY  = '#555555';
const WHITE      = '#FFFFFF';

export function GivingPage({ navigate }: { navigate: (p: PageId) => void }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ marginTop: 72 }}>

      {/* Hero */}
      <section style={{
        backgroundColor: NAVY, padding: isMobile ? '48px 24px' : '80px 120px', textAlign: 'center',
        backgroundImage: `linear-gradient(135deg, rgba(0,61,165,0.92) 0%, rgba(0,45,138,0.92) 100%), url(https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/922f0e0390634af9a9bdf34c3598ff91)`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <h1 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 32 : 56, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, lineHeight: 1.2 }}>
          Give to DePaul
        </h1>
        <p style={{ margin: '16px auto 0', color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? 16 : 20, maxWidth: 640 }}>
          Your generosity helps students access a world-class education and carry forward DePaul's Vincentian mission.
        </p>
        <button style={{
          backgroundColor: SCARLET, color: WHITE, fontWeight: 700, fontSize: isMobile ? 16 : 18,
          padding: isMobile ? '16px 40px' : '18px 56px', border: 'none', borderRadius: 4, cursor: 'pointer', marginTop: 40,
        }}>
          Make a Gift Today →
        </button>
      </section>

      {/* Impact numbers */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: '0 auto', color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, textAlign: 'center' }}>Your Impact</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 16 : 24, marginTop: 48 }}>
          {[
            { val: '$50M+', label: 'Raised last year' },
            { val: '2,400+',label: 'Scholarships funded' },
            { val: '85%',   label: 'Students receiving aid' },
            { val: '125',   label: 'Years of Vincentian tradition' },
          ].map(({ val, label }) => (
            <div key={label} style={{ backgroundColor: LIGHT_GRAY, borderRadius: 12, padding: isMobile ? '24px 16px' : '32px 24px', textAlign: 'center' }}>
              <p style={{ margin: 0, color: NAVY, fontSize: isMobile ? 32 : 44, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>{val}</p>
              <p style={{ margin: '8px 0 0', color: '#888', fontSize: isMobile ? 13 : 15 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ways to give */}
      <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Ways to Give</h2>
        <p style={{ margin: '16px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17 }}>Every gift, large or small, makes a real difference in a student's life.</p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24, marginTop: 40 }}>
          {[
            { icon: '💳', title: 'One-Time Gift',     desc: 'Make an immediate impact with a single contribution to the area of DePaul that matters most to you.' },
            { icon: '🔄', title: 'Recurring Gift',    desc: 'Set up a monthly or annual gift and join thousands of alumni sustaining the DePaul community year-round.' },
            { icon: '📜', title: 'Planned Giving',    desc: 'Include DePaul in your estate plan and create a lasting legacy that transforms future generations.' },
            { icon: '🏢', title: 'Corporate Matching',desc: 'Many employers match charitable gifts. Check if your company doubles the impact of your donation.' },
            { icon: '🎓', title: 'Endowed Scholarship',desc: 'Create a named scholarship fund that provides perpetual support for students who need it most.' },
            { icon: '🏆', title: 'Blue Demon Fund',   desc: 'Support DePaul Athletics and help our student-athletes thrive in competition and in the classroom.' },
          ].map(({ icon, title, desc }) => (
            <GivingCard key={title} icon={icon} title={title} desc={desc} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: NAVY, padding: isMobile ? '48px 24px' : '80px 120px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>
          Questions About Giving?
        </h2>
        <p style={{ margin: '16px auto 0', color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? 16 : 18, maxWidth: 560 }}>
          Our development team is here to help you make the gift that's right for you.
        </p>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
          <button style={{ backgroundColor: WHITE, color: NAVY, fontWeight: 700, fontSize: 16, padding: '15px 36px', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Contact Us
          </button>
          <button style={{ backgroundColor: 'transparent', color: WHITE, fontWeight: 700, fontSize: 16, padding: '13px 34px', border: '2px solid white', borderRadius: 4, cursor: 'pointer' }}>
            View Giving Reports
          </button>
        </div>
      </section>
    </div>
  );
}

function GivingCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: WHITE, borderRadius: 12, padding: 32, cursor: 'pointer',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s',
      }}>
      <span style={{ fontSize: 40 }}>{icon}</span>
      <h3 style={{ margin: '16px 0 0', color: '#003DA5', fontWeight: 700, fontSize: 19 }}>{title}</h3>
      <p style={{ margin: '10px 0 0', color: '#555', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
      <span style={{ color: '#003DA5', fontWeight: 700, fontSize: 14, display: 'block', marginTop: 20 }}>Learn More →</span>
    </div>
  );
}
