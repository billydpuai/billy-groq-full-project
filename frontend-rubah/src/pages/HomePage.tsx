import React, { useState } from 'react';
import { PageId } from '../App';
import { useIsMobile } from '../hooks/use-mobile';

const NAVY       = '#003DA5';
const SCARLET    = '#C41230';
const LIGHT_BLUE = '#4B8FE2';
const LIGHT_GRAY = '#E6ECF6';
const DARK_NAVY  = '#002D8A';
const MID_NAVY   = '#0033A0';
const WHITE      = '#FFFFFF';
const TEXT_GRAY  = '#555555';

// Real DePaul CDN (Sitecore Content Hub) image/video URLs
const I = {
  heroFallback: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/3dad9658815c409f972b0b9b37421bf1?v=fc3fab7d',
  stats1:       'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/1b07c33cd3aa415fb2ce5c2c08948b00',
  stats3:       'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/8bb5b36f716d46bd84d3217b62b644d4',
  stats6:       'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/aa6a2d6316054cbbb7086fd4b5e4ca35',
  stats7:       'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/62bc9614073b4165a52fc210caa80b53',
  layered:      'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/09dee58175ff4973b67ea3575efb04bf',
  programs:     'https://library.depaul.edu/PublishingImages/learning-commons.jpg',
  diff1:        'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/4a31647551f846449277769712058c41',
  diff2:        'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/5884df77a27e456ba708d10b85727fd6',
  diff3:        'https://offices.depaul.edu/housing/about/news-media/PublishingImages/FJG-Depaul-Oct-2016-2769.jpg',
  invest:       'https://resources.depaul.edu/campus-maps/buildings/PublishingImages/oConnell.jpg',
  story2:       'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/7d4ee96d81524e968582ac00dd096c19',
  story3:       'https://assets-us-01.kc-usercontent.com/95d47d95-36b6-00af-a24c-b886ecdfc4a2/fdaf9acc-1a47-4d17-b5f8-95215d6c79f0/144153.jpg?w=3840&q=75&lossless=true&auto=format',
  story1:       'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/f50fa7a27f8e448d864cd0deecae83ae',
  join1:        'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/665206d51f6f47fdb8e5f88dbdb6afaa',
  join2:        'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/bd305014bf314da3ae01169d46cd9134',
  join3:        'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/4838837dca8a42f6af879ffdfca8a1db',
  news1:        'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/e33a616f7cdc47b6beb9183f869f1639',
  news2:        'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/fcb28110c76949ccbe4dce4b36a9373e',
  news3:        'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/e34f3a0c779a469781b35b30c8ce779f',
  logoFooter:   '/images/logo-footer.svg',
};

type StatCell = { kind: 'stat'; value: string; desc: string } | { kind: 'photo'; src: string };
const STAT_CELLS: StatCell[] = [
  { kind: 'stat',  value: '17:1',   desc: 'student-to-faculty ratio, creating a more intimate learning environment' },
  { kind: 'photo', src: I.stats1 },
  { kind: 'photo', src: I.stats3 },
  { kind: 'stat',  value: '21,210', desc: 'students enrolled across 10 colleges and schools' },
  { kind: 'stat',  value: '92%',    desc: 'of recent graduates report positive career outcomes' },
  { kind: 'photo', src: I.stats6 },
  { kind: 'photo', src: I.stats7 },
  { kind: 'stat',  value: '97%',    desc: 'of classes are led by faculty, not by TAs/Grad assistants' },
];

const COLLEGES = [
  'Driehaus College of Business',
  'College of Liberal Arts and Social Sciences',
  'College of Communication',
  'College of Science and Health',
  'Jarvis College of Computing and Digital Media',
  'School of Music',
  'College of Education',
  'The Theatre School',
  'College of Law',
  'School of Continuing and Professional Studies',
];

const QUICK_LINKS = [
  { icon: '🎓', title: 'Campus Connect',        desc: 'Student portal' },
  { icon: '📚', title: 'D2L / Desire2Learn',    desc: 'Course materials' },
  { icon: '📧', title: 'BlueM@il',              desc: 'Student email' },
  { icon: '🗓️', title: 'Academic Calendar',     desc: 'Important dates' },
  { icon: '📋', title: 'Course Registration',   desc: 'Add/drop classes' },
  { icon: '💰', title: 'Financial Aid Status',  desc: 'Check your aid' },
  { icon: '🏥', title: 'Health Center',         desc: 'Medical services' },
  { icon: '🅿️', title: 'Parking',               desc: 'Permits & maps' },
];

const EVENTS = [
  { month: 'JUL', day: '15', place: 'Lincoln Park', bg: NAVY,      title: 'New Student Orientation 2026', time: '10:00 AM — 4:00 PM', body: "Welcome to DePaul! Join us for an exciting day of campus tours, meeting fellow students, and getting ready for your first quarter.", cta: 'Register Now →' },
  { month: 'AUG', day: '3',  place: 'The Loop',     bg: SCARLET,   title: 'Graduate Open House',           time: '1:00 PM — 5:00 PM',  body: "Explore DePaul's graduate programs, meet faculty, and learn about financial aid opportunities for graduate students.", cta: 'Learn More →' },
  { month: 'AUG', day: '21', place: 'Virtual',       bg: DARK_NAVY, title: 'Transfer Student Info Session', time: '6:00 PM — 7:30 PM',  body: "Everything transfer students need to know about applying to DePaul, transferring credits, and making the most of your time here.", cta: 'Sign Up →' },
];

const ALUMNI = [
  { emoji: '👩\u200d💼', bg: NAVY,      name: "Sarah Chen '18",    role: 'Product Manager, Google',              quote: '"DePaul gave me the hands-on experience and business acumen I needed to land my dream job in tech."' },
  { emoji: '👨\u200d⚕️', bg: SCARLET,   name: "Marcus Johnson '15", role: 'Chief Resident, Northwestern Medicine', quote: "\"The rigor of DePaul's science programs and the personal attention from professors prepared me for medical school.\"" },
  { emoji: '👩\u200d🏫', bg: DARK_NAVY, name: "Priya Patel '20",   role: 'Founder, EduTech Startup',             quote: "\"The entrepreneurship program at DePaul didn't just teach me business — it gave me the confidence to build something of my own.\"" },
];

const NUMBERS = [
  { value: '150+', label: 'Years of Excellence' },
  { value: '$24K', label: 'Average Aid Package' },
  { value: '350+', label: 'Student Organizations' },
  { value: '82%',  label: 'Students Employed or in Grad School' },
  { value: '100+', label: 'Countries Represented' },
];

const FOOTER_COLS = [
  { heading: 'Information for',      links: ['Current Students', 'Visitors', 'Faculty and Staff', 'Alumni', 'Parents and Families'] },
  { heading: 'Academic Resources',   links: ['Academic Calendar', 'Academic Catalog', 'Academic Success', 'BlueM@il', 'Campus Connect', 'Desire2Learn (D2L)', 'Library', 'MyDePaul'] },
  { heading: 'Campus Resources',     links: ['Security', 'Bookstore', 'Campus Maps', 'Events'] },
  { heading: 'University Resources', links: ['Directory', 'University News', 'Athletics', 'Leadership and Administration', 'Employment at DePaul', 'A-Z List of Websites', 'Help Desk'] },
];

const btnNavy: React.CSSProperties = {
  backgroundColor: NAVY, color: WHITE, fontWeight: 700, fontSize: 15,
  padding: '15px 30px', borderRadius: 4, border: 'none', cursor: 'pointer',
};
const btnOutline: React.CSSProperties = {
  backgroundColor: WHITE, color: NAVY, fontWeight: 700, fontSize: 15,
  padding: '13px 28px', borderRadius: 4, border: `2px solid ${NAVY}`, cursor: 'pointer',
};

function CollegePill({ name, onClick }: { name: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1.5px solid ${NAVY}`, color: NAVY, fontSize: 15,
        borderRadius: 30, padding: '16px 24px', cursor: 'pointer', width: '100%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: hov ? LIGHT_GRAY : WHITE, transition: 'background 0.2s',
      }}>
      <span>{name}</span><span>→</span>
    </button>
  );
}

function StoryCard({ src, title, quote, isMobile }: { src: string; title: string; quote: string; isMobile: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, backgroundColor: WHITE, borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.2s',
      }}>
      <img src={src} alt={title} style={{ width: '100%', height: isMobile ? 180 : 240, objectFit: 'cover', display: 'block', backgroundColor: '#bbb' }} />
      <div style={{ padding: 28 }}>
        <h3 style={{ margin: 0, color: NAVY, fontSize: 20, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, lineHeight: 1.3 }}>{title}</h3>
        <p style={{ margin: '12px 0 0', color: TEXT_GRAY, fontSize: 14, lineHeight: 1.7, fontStyle: 'italic' }}>{quote}</p>
        <span style={{ color: NAVY, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'block', marginTop: 20 }}>Read More →</span>
      </div>
    </div>
  );
}

function NewsCard({ src, date, title, body, navigate, isMobile }: { src: string; date: string; title: string; body: string; navigate: (p: PageId) => void; isMobile: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => navigate('news')}
      style={{
        flex: 1, backgroundColor: WHITE, borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s',
      }}>
      <img src={src} alt={title} style={{ width: '100%', height: isMobile ? 170 : 200, objectFit: 'cover', display: 'block', backgroundColor: '#ccc' }} />
      <div style={{ padding: 24 }}>
        <span style={{ color: '#888', fontSize: 12, letterSpacing: 1, display: 'block' }}>{date}</span>
        <h3 style={{ margin: '8px 0 0', color: NAVY, fontSize: 18, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, lineHeight: 1.3 }}>{title}</h3>
        <p style={{ margin: '10px 0 0', color: '#555', fontSize: 14, lineHeight: 1.6 }}>{body}</p>
        <span style={{ color: SCARLET, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'block', marginTop: 16 }}>Read More →</span>
      </div>
    </div>
  );
}

function JoinCard({ src, label, onClick, isMobile }: { src: string; label: string; onClick: () => void; isMobile: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ flex: 1, height: isMobile ? 220 : 340, borderRadius: 12, overflow: 'hidden', position: 'relative', cursor: 'pointer', opacity: hov ? 0.9 : 1, transition: 'opacity 0.2s' }}>
      <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', backgroundColor: '#888' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 50%, transparent 100%)' }} />
      <span style={{ position: 'absolute', bottom: 24, left: 20, color: '#fff', fontSize: 17, fontWeight: 700 }}>{label}</span>
    </div>
  );
}

function QuickLinkCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: hov ? NAVY : LIGHT_GRAY, borderRadius: 12, padding: 24,
        textAlign: 'center', cursor: 'pointer', transition: 'background 0.2s',
      }}>
      <span style={{ fontSize: 32, display: 'block' }}>{icon}</span>
      <p style={{ margin: '10px 0 0', color: hov ? WHITE : NAVY, fontWeight: 700, fontSize: 15 }}>{title}</p>
      <p style={{ margin: '4px 0 0', color: hov ? 'rgba(255,255,255,0.7)' : '#888', fontSize: 12 }}>{desc}</p>
    </div>
  );
}

function EventCard({ month, day, place, bg, title, time, body, cta }: { month: string; day: string; place: string; bg: string; title: string; time: string; body: string; cta: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: WHITE, borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        boxShadow: hov ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'box-shadow 0.2s',
      }}>
      <div style={{ backgroundColor: bg, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>{month}</span>
          <p style={{ margin: 0, color: WHITE, fontWeight: 700, fontSize: 36, lineHeight: 1 }}>{day}</p>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{place}</span>
      </div>
      <div style={{ padding: 24 }}>
        <h3 style={{ margin: 0, color: NAVY, fontWeight: 700, fontSize: 18 }}>{title}</h3>
        <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>{time}</p>
        <p style={{ margin: '12px 0 0', color: TEXT_GRAY, fontSize: 14, lineHeight: 1.6 }}>{body}</p>
        <span style={{ color: SCARLET, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'block', marginTop: 16 }}>{cta}</span>
      </div>
    </div>
  );
}

function AlumniCard({ emoji, bg, name, role, quote }: { emoji: string; bg: string; name: string; role: string; quote: string }) {
  return (
    <div style={{ backgroundColor: LIGHT_GRAY, borderRadius: 16, padding: 36, textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: bg, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 32 }}>{emoji}</span>
      </div>
      <h3 style={{ margin: '16px 0 0', color: NAVY, fontWeight: 700, fontSize: 20 }}>{name}</h3>
      <p style={{ margin: '4px 0 0', color: SCARLET, fontWeight: 700, fontSize: 13 }}>{role}</p>
      <p style={{ margin: '12px 0 0', color: TEXT_GRAY, fontSize: 15, lineHeight: 1.7 }}>{quote}</p>
    </div>
  );
}

export function HomePage({ navigate }: { navigate: (p: PageId) => void }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ marginTop: 72 }}>

      {/* ── HERO ── */}
      <section style={{ height: 'calc(100vh - 72px)', position: 'relative', overflow: 'hidden', backgroundColor: '#001a6e' }}>
        <video
          src={I.heroFallback}
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.65) 100%)' }} />
        <div style={{ position: 'absolute', bottom: isMobile ? 32 : 56, right: isMobile ? 24 : 56, left: isMobile ? 24 : 'auto', textAlign: 'right' }}>
          <p style={{ margin: 0, color: WHITE, fontSize: isMobile ? 38 : 68, fontWeight: 700, fontFamily: "'Rethink Sans',sans-serif", lineHeight: 1.05, textShadow: '2px 4px 16px rgba(0,0,0,0.6)' }}>Welcome to</p>
          <p style={{ margin: 0, color: LIGHT_BLUE, fontSize: isMobile ? 48 : 86, fontWeight: 700, fontStyle: 'italic', fontFamily: "'Rethink Sans',sans-serif", lineHeight: 0.95, textShadow: '2px 4px 16px rgba(0,0,0,0.4)' }}>DePaul</p>
        </div>
      </section>

      {/* ── AT DEPAUL ── */}
      <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '48px 24px' : '96px 80px', textAlign: 'center' }}>
        <h2 style={{ margin: '0 auto', color: NAVY, fontSize: isMobile ? 30 : 54, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, lineHeight: 1.15, maxWidth: 840 }}>
          At DePaul, Education is Hands-on, Heart-first and Mission-led
        </h2>
        <p style={{ margin: '24px auto 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 18, lineHeight: 1.75, maxWidth: 680 }}>
          Guided by immersive learning, real-world experience and faculty who make you their priority,
          you'll gain the skills you need to shape your career— and the confidence you need to shape the world.
        </p>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, justifyContent: 'center', marginTop: 44, flexWrap: 'wrap' }}>
          <button style={btnNavy} onClick={() => navigate('academics')}>View Undergraduate Majors →</button>
          <button style={btnOutline} onClick={() => navigate('academics')}>View Graduate Programs →</button>
        </div>
      </section>

      {/* ── OUR UNIVERSITY ── */}
      <section style={{ backgroundColor: NAVY, padding: isMobile ? '48px 24px 0' : '72px 80px 0' }}>
        <h2 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 28 : 48, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Our University Revolves Around You</h2>
        <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,0.82)', fontSize: isMobile ? 15 : 18 }}>
          Experience smaller classes, bigger opportunities and a campus that connects you to Chicago and the world.
        </p>
        {/* Stats grid — 2 columns on both desktop and mobile, shorter cells on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: isMobile ? 32 : 60 }}>
          {STAT_CELLS.map((cell, i) =>
            cell.kind === 'stat' ? (
              <div key={i} style={{ backgroundColor: DARK_NAVY, height: isMobile ? 200 : 420, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: isMobile ? 20 : 48 }}>
                <p style={{ margin: 0, color: WHITE, fontSize: isMobile ? 48 : 118, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, lineHeight: 1 }}>{cell.value}</p>
                <p style={{ margin: '16px 0 0', color: 'rgba(255,255,255,0.88)', fontSize: isMobile ? 13 : 17, maxWidth: 300, lineHeight: 1.5 }}>{cell.desc}</p>
              </div>
            ) : (
              <img key={i} src={cell.src} alt="" style={{ width: '100%', height: isMobile ? 200 : 420, objectFit: 'cover', display: 'block', backgroundColor: '#4a5a80' }} />
            )
          )}
        </div>
      </section>

      {/* ── LEAD WITH HEAD ── */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '100px 120px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 32 : 80, alignItems: 'center' }}>
        <div style={{ width: isMobile ? '100%' : '45%', flexShrink: 0 }}>
          <img src={I.layered} alt="Students in class" style={{ width: '100%', height: isMobile ? 240 : 500, objectFit: 'cover', borderRadius: 20, display: 'block', backgroundColor: '#ddd' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 48, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, lineHeight: 1.2 }}>Lead with Head, Hands and Heart</h2>
          <p style={{ margin: '20px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17, lineHeight: 1.75 }}>
            DePaul's unique Layered-Learning™ approach blends knowledge, action and values. By integrating
            classroom learning, project-based learning and community-based service learning, we go beyond
            the traditional liberal arts education to deepen the meaning of your degree.
          </p>
          <button style={{ ...btnNavy, marginTop: 32 }} onClick={() => navigate('academics')}>Explore Layered-Learning™ →</button>
        </div>
      </section>

      {/* ── PROGRAM FINDER ── */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 32 : 80, alignItems: 'center', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ width: isMobile ? '100%' : '55%', flexShrink: 0 }}>
          <span style={{ color: '#888', fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const }}>DEPAUL PROGRAM FINDER</span>
          <h2 style={{ margin: '12px 0 0', color: NAVY, fontSize: isMobile ? 26 : 44, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, lineHeight: 1.2 }}>Find a Major That Moves You</h2>
          <p style={{ margin: '20px 0 0', color: '#000', fontSize: isMobile ? 17 : 20, fontWeight: 700 }}>Take our questionnaire</p>
          <p style={{ margin: '12px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 14 : 16, lineHeight: 1.7 }}>
            Not sure where to start? Use our Program Finder to explore your options and carve a path that makes an impact.
          </p>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, marginTop: 32, alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap' }}>
            <button style={btnNavy} onClick={() => navigate('academics')}>Program Finder →</button>
            <button onClick={() => navigate('academics')} style={{ background: 'none', border: 'none', color: NAVY, fontSize: 15, cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>Program Questionnaire →</button>
          </div>
        </div>
        <div style={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
          <img src={I.programs} alt="Students collaborating" style={{ width: '100%', height: isMobile ? 220 : 420, objectFit: 'cover', borderRadius: 16, display: 'block', backgroundColor: '#ccc' }} />
        </div>
      </section>

      {/* ── DISCOVER COLLEGES ── */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px', borderTop: '1px solid #f0f0f0' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 26 : 40, fontWeight: 700 }}>Discover DePaul's Colleges and Schools</h2>
        <hr style={{ border: 'none', backgroundColor: NAVY, height: 2, margin: '24px 0 32px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
          {COLLEGES.map(name => <CollegePill key={name} name={name} onClick={() => navigate('academics')} />)}
        </div>
      </section>

      {/* ── EXPERIENCE DIFFERENCE ── */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 0' : '80px 0', borderTop: '1px solid #f0f0f0' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 26 : 40, fontWeight: 700, padding: isMobile ? '0 24px' : '0 120px' }}>Experience the DePaul Difference</h2>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', marginTop: 40 }}>
          {[
            { src: I.diff1, label: 'CAREER READINESS',      title: 'Education in Action',  body: "At DePaul, you'll build life skills and career confidence through real-world experiences, mentorship and support—so you graduate ready to lead, adapt and make a difference.", link: 'View our Career Success Dashboard →', page: 'student-life' as PageId },
            { src: I.diff2, label: 'STUDENT LIFE',           title: 'Life at DePaul',        body: "Learn what life at DePaul is all about. Join one of 350+ student groups, cheer on the Blue Demons or see what's happening on campus. Your DePaul adventure is just beginning.", link: 'Discover Student Life →', page: 'student-life' as PageId },
            { src: I.diff3, label: 'COMMUNITY INVOLVEMENT',  title: 'Service Learning',      body: 'Community is part of the curriculum at DePaul. Students have the opportunity to partner with over 250 organizations as part of their major and create real-world impact as part of their education.', link: 'Visit the Steans Center →', page: 'student-life' as PageId },
          ].map(({ src, label, title, body, link, page }) => (
            <div key={title} style={{ flex: 1, padding: isMobile ? '0 24px' : 0, marginBottom: isMobile ? 32 : 0 }}>
              <img src={src} alt={title} style={{ width: '100%', height: isMobile ? 220 : 300, objectFit: 'cover', display: 'block', backgroundColor: '#bbb' }} />
              <div style={{ padding: isMobile ? '28px 0' : '28px 32px', border: isMobile ? 'none' : '1px solid #eee', borderTop: 'none' }}>
                <span style={{ color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: 2.5 }}>{label}</span>
                <h3 style={{ margin: '8px 0 0', color: NAVY, fontSize: 26, fontFamily: "'Rethink Sans',sans-serif", lineHeight: 1.3 }}>{title}</h3>
                <p style={{ margin: '12px 0 0', color: TEXT_GRAY, fontSize: 14, lineHeight: 1.7 }}>{body}</p>
                <button style={{ background: 'none', border: 'none', color: NAVY, fontSize: 14, fontWeight: 700, cursor: 'pointer', padding: '24px 0 0', display: 'block' }} onClick={() => navigate(page)}>{link}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── UNIVERSITY NEWS ── */}
      <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '48px 24px' : '80px 80px' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: 40 }}>
          <h2 style={{ margin: 0, color: '#000', fontSize: isMobile ? 26 : 40, fontWeight: 700 }}>University News</h2>
          <button onClick={() => navigate('news')} style={{ background: 'none', border: 'none', color: NAVY, fontSize: 15, fontWeight: 700, cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.textDecoration = 'underline')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.textDecoration = 'none')}>
            All News →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 24 }}>
          <NewsCard navigate={navigate} isMobile={isMobile} src={I.news1} date="May 27, 2026"
            title="Building fearless creators: How David Ramsay is rethinking technology education"
            body="David Ramsay, director of the Idea Realization Lab, shares how hands-on experimentation and creative risk-taking prepare students for a fast-changing future." />
          <NewsCard navigate={navigate} isMobile={isMobile} src={I.news2} date="Jun 10, 2026"
            title="Exhibition at the Newberry Library interrogates freedom through wartime political cartoons"
            body="History professor Margaret Storey curates 'Conceived in Liberty,' as part of library's participation in Illinois America 250." />
          <NewsCard navigate={navigate} isMobile={isMobile} src={I.news3} date="Jun 30, 2026"
            title="DePaul commencement 2026 celebrates nearly 6,000 graduates at Wintrust Arena"
            body="Wintrust Arena hosted thousands of DePaul graduates, faculty, staff, community members, families and friends for commencement 2026." />
        </div>
      </section>

      {/* ── INVEST ── */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '100px 120px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 32 : 80, alignItems: 'center' }}>
        <div style={{ flex: isMobile ? '0 0 auto' : '0 0 42%', width: isMobile ? '100%' : 'auto' }}>
          <img src={I.invest} alt="Students" style={{ width: '100%', height: isMobile ? 220 : 440, objectFit: 'cover', borderRadius: 16, display: 'block', backgroundColor: '#ddd' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 26 : 42, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, lineHeight: 1.2 }}>Invest in What Matters</h2>
          <p style={{ margin: '20px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17, lineHeight: 1.75 }}>
            At DePaul, we believe everyone deserves access to a world-class education that puts you at the center.
            Explore scholarships, aid and support that help make a DePaul education possible for all.
          </p>
          <button style={{ ...btnNavy, marginTop: 32 }} onClick={() => navigate('tuition')}>Tuition and Aid →</button>
        </div>
      </section>

      {/* ── HEAR FROM STUDENTS ── */}
      <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '48px 24px' : '80px 80px' }}>
        <h2 style={{ margin: 0, color: '#000', fontSize: isMobile ? 26 : 40, fontWeight: 700 }}>Hear About DePaul From Our Students</h2>
        <hr style={{ border: 'none', backgroundColor: NAVY, height: 2, margin: '20px 0 40px' }} />
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 24 }}>
          <StoryCard isMobile={isMobile} src={I.story2} title="I Couldn't Be Happier With the Life I Chose in Chicago" quote='"The Lincoln Park campus is right in the heart of the neighborhood and has all the elements of what you would expect from a college campus."' />
          <StoryCard isMobile={isMobile} src={I.story3} title="How My Studies at DePaul Set Me Up for Success" quote='"While I have learned many tangible skills across different industries, the ethos and approach I have taken to my work truly started during my time at DePaul."' />
          <StoryCard isMobile={isMobile} src={I.story1} title="Sports Are Temporary but Knowledge Is Forever" quote='"Transferring to DePaul was about more than just athletics. I wanted a place that valued education just as much as competition."' />
        </div>
      </section>

      {/* ── JOIN FAMILY ── */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 80px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 24 : 48, alignItems: isMobile ? 'flex-start' : 'center' }}>
        <div style={{ flex: isMobile ? '0 0 auto' : '0 0 30%' }}>
          <p style={{ margin: 0, color: '#000', fontSize: isMobile ? 26 : 36, fontWeight: 700, lineHeight: 1.15 }}>Join our</p>
          <p style={{ margin: 0, color: NAVY, fontSize: isMobile ? 36 : 52, fontWeight: 700, lineHeight: 1 }}>Blue Demon</p>
          <p style={{ margin: 0, color: NAVY, fontSize: isMobile ? 36 : 52, fontWeight: 700, lineHeight: 1 }}>Family</p>
          <p style={{ margin: '16px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17, lineHeight: 1.6 }}>Start your journey at DePaul today.</p>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, width: isMobile ? '100%' : 'auto' }}>
          <JoinCard isMobile={isMobile} src={I.join1} label="Request Information →" onClick={() => navigate('admission')} />
          <JoinCard isMobile={isMobile} src={I.join2} label="Visit →"               onClick={() => navigate('admission')} />
          <JoinCard isMobile={isMobile} src={I.join3} label="Apply →"               onClick={() => navigate('admission')} />
        </div>
      </section>

      {/* ── FIND ANSWERS ── */}
      <section style={{ padding: isMobile ? '0 24px 48px' : '0 80px 80px' }}>
        <div style={{ backgroundColor: NAVY, borderRadius: 20, padding: isMobile ? '40px 28px' : '64px 80px', maxWidth: 960, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -60, top: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <h2 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 30 : 52, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, position: 'relative', zIndex: 1 }}>
            Find the answers you <span style={{ fontStyle: 'italic' }}>need.</span>
          </h2>
          <div style={{ position: 'relative', zIndex: 1, marginTop: 28, display: 'flex', alignItems: 'center', backgroundColor: WHITE, borderRadius: 30, overflow: 'hidden' }}>
            <span style={{ color: '#888', fontSize: 18, padding: '0 0 0 20px' }}>🔍</span>
            <input style={{ flex: 1, border: 'none', outline: 'none', padding: '16px 20px', fontSize: 15, color: '#333', backgroundColor: 'transparent' }} placeholder="Search DePaul" />
            <button style={{ backgroundColor: NAVY, color: WHITE, fontWeight: 700, fontSize: 14, border: 'none', padding: '14px 24px', cursor: 'pointer' }}>→</button>
          </div>
          <div style={{ position: 'relative', zIndex: 1, backgroundColor: MID_NAVY, borderRadius: 12, marginTop: 20, padding: isMobile ? 20 : 28 }}>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: WHITE, fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20 }}>Tuition and Fees</span>
            <h3 style={{ margin: '14px 0 0', color: WHITE, fontSize: isMobile ? 20 : 26, fontWeight: 700, lineHeight: 1.3 }}>How much does it cost to attend DePaul?</h3>
            <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 15, lineHeight: 1.6 }}>Use DePaul's Net Price Calculator to estimate costs based on your program and circumstances.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: i === 0 ? WHITE : 'rgba(255,255,255,0.4)', cursor: 'pointer' }} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK ACCESS ── */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '40px 24px' : '60px 120px' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 24 : 36, fontWeight: 700, textAlign: 'center' }}>Quick Access</h2>
        <p style={{ margin: '8px 0 0', color: '#888', fontSize: isMobile ? 14 : 16, textAlign: 'center' }}>Everything you need, one click away</p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16, marginTop: 40 }}>
          {QUICK_LINKS.map(l => <QuickLinkCard key={l.title} {...l} />)}
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: 40 }}>
          <h2 style={{ margin: 0, color: '#000', fontSize: isMobile ? 26 : 40, fontWeight: 700 }}>Upcoming Events</h2>
          <span style={{ color: NAVY, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>View All Events →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24 }}>
          {EVENTS.map(ev => <EventCard key={ev.title} {...ev} />)}
        </div>
      </section>

      {/* ── ALUMNI SPOTLIGHT ── */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 26 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, textAlign: 'center' }}>Alumni Making an Impact</h2>
        <p style={{ margin: '12px 0 0', color: '#888', fontSize: isMobile ? 15 : 17, textAlign: 'center' }}>DePaul graduates are changing the world</p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24, marginTop: 48 }}>
          {ALUMNI.map(a => <AlumniCard key={a.name} {...a} />)}
        </div>
      </section>

      {/* ── BY THE NUMBERS ── */}
      <section style={{ backgroundColor: NAVY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 26 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, textAlign: 'center' }}>DePaul by the Numbers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, 1fr)', gap: 0, marginTop: 60, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          {NUMBERS.map((n, i) => (
            <div key={n.label} style={{ padding: isMobile ? 24 : 40, textAlign: 'center', borderRight: !isMobile && i < NUMBERS.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
              <p style={{ margin: 0, color: WHITE, fontSize: isMobile ? 32 : 52, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>{n.value}</p>
              <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? 13 : 15 }}>{n.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── APPLY CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, #C41230 0%, #8B0D1F 100%)', padding: isMobile ? '48px 24px' : '80px 120px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 28 : 48, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Ready to Become a Blue Demon?</h2>
        <p style={{ margin: '16px auto 0', color: 'rgba(255,255,255,0.9)', fontSize: isMobile ? 16 : 20, lineHeight: 1.7, maxWidth: 760 }}>
          Join a community of thinkers, doers, and changemakers at one of Chicago's most vibrant universities. Your journey starts here.
        </p>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 20, justifyContent: 'center', marginTop: 40 }}>
          <button
            onClick={() => navigate('admission')}
            style={{ backgroundColor: WHITE, color: SCARLET, fontWeight: 700, fontSize: 18, padding: '16px 36px', borderRadius: 4, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >Apply Now — It's Free</button>
          <button
            onClick={() => navigate('admission')}
            style={{ backgroundColor: 'transparent', color: WHITE, fontWeight: 700, fontSize: 18, padding: '14px 34px', borderRadius: 4, border: '2px solid white', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >Request Information</button>
        </div>
        <p style={{ margin: '24px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>No application fee • Rolling admissions • Decisions in 2-4 weeks</p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: NAVY, padding: isMobile ? '48px 24px' : 80 }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 64 }}>
          <img src={I.logoFooter} alt="DePaul University" height={52}
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.style.display = 'none';
              const span = document.createElement('span');
              span.textContent = '🛡️ DEPAUL UNIVERSITY';
              span.style.cssText = 'color:#fff;font-weight:bold;font-size:22px;letter-spacing:2px';
              el.parentElement?.insertBefore(span, el);
            }} />
        </div>
        {/* Footer columns — 5 across on desktop, 1 column on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr 1fr 1fr 1fr', gap: isMobile ? 32 : 48, maxWidth: 1300, margin: '0 auto' }}>
          <div>
            <p style={{ margin: '0 0 16px', color: WHITE, fontWeight: 700, fontSize: 16 }}>DePaul University</p>
            <p style={{ margin: '8px 0 0', color: WHITE, fontSize: 14, lineHeight: 1.6 }}>1 E. Jackson Blvd.</p>
            <p style={{ margin: 0, color: WHITE, fontSize: 14 }}>Chicago, IL 60604</p>
            <p style={{ margin: '4px 0 0', color: WHITE, fontSize: 14 }}>(312) 362-8000</p>
            <p style={{ margin: 0, color: WHITE, fontSize: 14 }}>or 1 (800) 4DE PAUL (outside Illinois)</p>
            <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
              {['in', 'tt', 'ig', 'fb', 'yt'].map(s => (
                <button key={s} style={{ background: 'none', border: 'none', color: WHITE, fontSize: 14, cursor: 'pointer', padding: 0 }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>{s}</button>
              ))}
            </div>
          </div>
          {FOOTER_COLS.map(({ heading, links }) => (
            <div key={heading}>
              <p style={{ margin: '0 0 0', color: WHITE, fontWeight: 700, fontSize: 15 }}>{heading}</p>
              {links.map(l => (
                <p key={l} style={{ margin: 0 }}>
                  <button style={{ background: 'none', border: 'none', color: WHITE, fontSize: 14, cursor: 'pointer', padding: '4px 0', lineHeight: 2 }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.textDecoration = 'underline')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.textDecoration = 'none')}>{l}</button>
                </p>
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: isMobile ? 40 : 60, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: isMobile ? 32 : 48 }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            {['Visit', 'Apply', 'Give'].map(l => (
              <button key={l} style={{ backgroundColor: 'transparent', color: WHITE, border: '2px solid rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 15, padding: '12px 44px', borderRadius: 4, cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>{l}</button>
            ))}
          </div>
          <p style={{ textAlign: 'center', margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: 12, lineHeight: 2 }}>
            Disclaimer / Contact Us / Emergency Plan / Consumer Info / IBHE Complaints / Privacy Statements / Accreditation and Licensure / Request Support for Website Accessibility
          </p>
          <p style={{ textAlign: 'center', margin: '8px 0 0', color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>© 2001-2026 DePaul University</p>
        </div>
      </footer>
    </div>
  );
}
