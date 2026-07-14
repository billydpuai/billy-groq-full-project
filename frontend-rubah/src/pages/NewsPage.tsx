import React from 'react';
import { PageId } from '../App';
import { useIsMobile } from '../hooks/use-mobile';

const NAVY      = '#003DA5';
const LIGHT_GRAY = '#E6ECF6';
const TEXT_GRAY  = '#555555';
const WHITE      = '#FFFFFF';

const ARTICLES = [
  { tag: 'Research & Innovation', date: 'June 30, 2026', title: 'Researchers Rediscover Once-Lost Super-Sized Megalodon Vertebrae', teaser: 'International team of scientists sheds new insight into the biology of the prehistoric shark.', img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/e1522f3fb9034b9bbf0279573978e460' },
  { tag: 'Campus & Community', date: 'June 25, 2026', title: 'Historic Byrne Hall, Cortelyou Commons Earn Chicago Landmark Status', teaser: "Two of DePaul University's historic Lincoln Park Campus buildings have officially been designated Chicago Landmarks.", img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/7a0f75d376684d48a7ae53d8cc5b9fb9' },
  { tag: 'Student Success', date: 'June 18, 2026', title: "Class of 2026's Top Graduate Reflects on Her DePaul Journey", teaser: 'Valedictorian Maria Torres credits DePaul\'s service-learning program and tight-knit faculty relationships for her success.', img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/505ce8f79c234181927398ccb0d07ccf' },
  { tag: 'Faculty',         date: 'June 10, 2026', title: 'Professor Named to National Academy of Sciences', teaser: 'A DePaul faculty member joins the prestigious body for outstanding contributions to research.', img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/27c199cdc9014ee685b7830e566d25bc' },
  { tag: 'Community',       date: 'June 4, 2026',  title: "DePaul's Steans Center Celebrates 30 Years of Service Learning", teaser: '250+ community partners gathered on the Lincoln Park campus to mark three decades of transformative civic engagement programs.', img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/84ea7dcae5554a3eb322e198d3c9ebd9' },
  { tag: 'Donations & Giving', date: 'May 28, 2026',  title: '$50 Million Gift Establishes Endowed Scholarship Fund', teaser: "The university's largest single donation will create 200 new annually renewable scholarships for first-generation students beginning fall 2027.", img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/51cf502270be46f08ae5be2e36e33a36' },
];

export function NewsPage({ navigate }: { navigate: (p: PageId) => void }) {
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
          <span style={{ color: 'rgba(255,255,255,0.4)' }} aria-hidden="true">›</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>University News</span>
        </nav>
        <h1 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 32 : 56, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700, lineHeight: 1.2 }}>University News</h1>
        <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? 16 : 20 }}>
          The latest from DePaul — research breakthroughs, student achievements and campus stories.
        </p>
      </section>

      {/* Articles */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : 32 }}>
          {ARTICLES.map(({ tag, date, title, teaser, img }) => (
            <ArticleCard key={title} tag={tag} date={date} title={title} teaser={teaser} img={img} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <button style={{
            backgroundColor: NAVY, color: WHITE, fontWeight: 700, fontSize: 16,
            padding: '15px 40px', border: 'none', borderRadius: 4, cursor: 'pointer',
          }}>
            Load More Stories
          </button>
        </div>
      </section>

      {/* Featured */}
      <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Stay Connected</h2>
        <p style={{ margin: '16px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17 }}>Get the latest DePaul news delivered directly to your inbox.</p>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, marginTop: 32, maxWidth: 480 }}>
          <input
            type="email"
            placeholder="Enter your email"
            style={{ flex: 1, border: '1.5px solid #ddd', borderRadius: 4, padding: '14px 20px', fontSize: 15, outline: 'none' }}
          />
          <button style={{ backgroundColor: NAVY, color: WHITE, fontWeight: 700, border: 'none', borderRadius: 4, padding: '14px 24px', cursor: 'pointer', fontSize: 15 }}>
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
}

function ArticleCard({ tag, date, title, teaser, img }: { tag: string; date: string; title: string; teaser: string; img: string }) {
  const [hov, setHov] = React.useState(false);
  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.1)' : 'none', transition: 'box-shadow 0.2s',
      }}>
      <img src={img} alt={title} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', backgroundColor: '#c5d0e0' }} />
      <div style={{ padding: 28 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <span style={{ backgroundColor: '#E6ECF6', color: '#003DA5', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>{tag}</span>
          <span style={{ color: '#888', fontSize: 12 }}>{date}</span>
        </div>
        <h3 style={{ margin: 0, color: '#003DA5', fontWeight: 700, fontSize: 18, lineHeight: 1.35 }}>{title}</h3>
        <p style={{ margin: '10px 0 0', color: '#555', fontSize: 14, lineHeight: 1.7 }}>{teaser}</p>
        <span style={{ color: '#003DA5', fontWeight: 700, fontSize: 14, display: 'block', marginTop: 16 }}>Read More →</span>
      </div>
    </article>
  );
}
