import React from 'react';
import { PageId } from '../App';
import { useIsMobile } from '../hooks/use-mobile';

const NAVY      = '#003DA5';
const SCARLET   = '#C41230';
const LIGHT_GRAY = '#E6ECF6';
const TEXT_GRAY  = '#555555';
const WHITE      = '#FFFFFF';

const btnNavy: React.CSSProperties = { backgroundColor: NAVY, color: WHITE, fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 4, border: 'none', cursor: 'pointer' };
const btnWhite: React.CSSProperties = { ...btnNavy, backgroundColor: WHITE, color: NAVY };

export function TuitionPage({ navigate }: { navigate: (p: PageId) => void }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ marginTop: 72 }}>

      {/* Hero */}
      <section style={{
        backgroundColor: NAVY, padding: isMobile ? '48px 24px' : '80px 120px',
        backgroundImage: `linear-gradient(135deg, rgba(0,61,165,0.92) 0%, rgba(0,45,138,0.92) 100%), url(https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/0be53a3368c942c29e8d1a8b9fe8bd7f)`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }} onClick={() => navigate('home')}>Home</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Tuition & Aid</span>
        </div>
        <h1 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 32 : 56, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Tuition & Financial Aid</h1>
        <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? 16 : 20 }}>
          We're committed to making a DePaul education accessible to all students.
        </p>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 24, marginTop: 36, flexWrap: 'wrap' }}>
          {[
            { label: 'Average Aid Package', val: '$24,000' },
            { label: 'Students Receiving Aid', val: '85%' },
            { label: 'Scholarships Available', val: '500+' },
          ].map(({ label, val }) => (
            <div key={label} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '24px 32px', textAlign: 'center', flex: 1, minWidth: 180 }}>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' as const }}>{label}</p>
              <p style={{ margin: '8px 0 0', color: WHITE, fontWeight: 700, fontSize: 40, fontFamily: "'Rethink Sans',sans-serif" }}>{val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Aid Types */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Types of Financial Aid</h2>
        <p style={{ margin: '16px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17 }}>
          DePaul offers multiple funding sources to help make your education affordable.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24, marginTop: 48 }}>
          {[
            { img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/ebd668faf7634e62ae09d53c01ded091', title: 'Scholarships & Grants',  desc: 'Gift aid that does not need to be repaid. Available based on merit, need, and special circumstances.', link: 'Explore Scholarships →' },
            { img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/5e5f713fb5134a658c61ef85fe9fe81c', title: 'Work-Study Programs',    desc: 'Earn money to help pay for school while gaining valuable work experience on or near campus.', link: 'Learn About Work-Study →' },
            { img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/868d0c59cfa741778877791bb2d1390c', title: 'Federal Loans',          desc: 'Low-interest federal loans available to eligible students based on FAFSA results.', link: 'Understand Loans →' },
            { img: 'https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/1634b824813443e5ba6984d66eba5f6a', title: 'Private Loans',          desc: 'Additional loan options from private lenders to supplement federal aid if needed.', link: 'Explore Private Options →' },
          ].map(({ img, title, desc, link }) => (
            <div key={title} style={{ backgroundColor: LIGHT_GRAY, borderRadius: 12, overflow: 'hidden' }}>
              <img src={img} alt={title} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', backgroundColor: '#ccc' }} />
              <div style={{ padding: 28 }}>
                <h3 style={{ margin: 0, color: NAVY, fontWeight: 700, fontSize: 20 }}>{title}</h3>
                <p style={{ margin: '12px 0 0', color: TEXT_GRAY, fontSize: 15, lineHeight: 1.7 }}>{desc}</p>
                <span style={{ color: NAVY, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'block', marginTop: 20 }}>{link}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAFSA */}
      <section style={{ backgroundColor: NAVY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: 0, color: WHITE, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Apply for Aid with FAFSA</h2>
        <p style={{ margin: '20px 0 0', color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? 15 : 17, lineHeight: 1.75, maxWidth: 700 }}>
          The Free Application for Federal Student Aid (FAFSA) is your first step toward financial aid. DePaul's federal school code is 001671. Complete the FAFSA as early as October 1 to maximize your aid.
        </p>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 24, marginTop: 40, alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap' }}>
          <button style={btnWhite}>Complete FAFSA Now →</button>
          <div style={{ border: '1px solid rgba(255,255,255,0.4)', borderRadius: 4, padding: '14px 28px', backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <span style={{ color: WHITE, fontWeight: 700, fontSize: 15 }}>DePaul School Code: 001671</span>
          </div>
        </div>
      </section>

      {/* Tuition Table */}
      <section style={{ backgroundColor: LIGHT_GRAY, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>Tuition & Fees</h2>
        <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14, letterSpacing: 1 }}>2025–2026 Academic Year</p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24, marginTop: 40 }}>
          {/* Undergrad table */}
          <div style={{ backgroundColor: WHITE, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ backgroundColor: NAVY, padding: '20px 28px' }}>
              <h3 style={{ margin: 0, color: WHITE, fontWeight: 700, fontSize: 18 }}>Undergraduate</h3>
            </div>
            {[
              { label: 'Full-Time Tuition (per quarter)', val: '$13,440' },
              { label: 'Part-Time (per credit hour)',      val: '$1,196' },
              { label: 'Student Activity Fee',             val: '$143/quarter' },
              { label: 'Technology Fee',                   val: '$100/quarter' },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid #eee' }}>
                <span style={{ color: TEXT_GRAY, fontSize: 14 }}>{label}</span>
                <span style={{ color: NAVY, fontWeight: 600, fontSize: 14 }}>{val}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 28px', backgroundColor: LIGHT_GRAY }}>
              <span style={{ color: NAVY, fontWeight: 700, fontSize: 14 }}>Estimated Annual Cost</span>
              <span style={{ color: NAVY, fontWeight: 700, fontSize: 14 }}>$53,760</span>
            </div>
          </div>

          {/* Grad table */}
          <div style={{ backgroundColor: WHITE, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ backgroundColor: NAVY, padding: '20px 28px' }}>
              <h3 style={{ margin: 0, color: WHITE, fontWeight: 700, fontSize: 18 }}>Graduate</h3>
            </div>
            {[
              { label: 'Graduate Tuition (per credit hour)', val: '$1,050–$1,580' },
              { label: 'Online Programs',                    val: 'Same as on-campus rate' },
              { label: 'Student Activity Fee',               val: '$75/quarter' },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid #eee' }}>
                <span style={{ color: TEXT_GRAY, fontSize: 14 }}>{label}</span>
                <span style={{ color: NAVY, fontWeight: 600, fontSize: 14 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section style={{ backgroundColor: WHITE, padding: isMobile ? '48px 24px' : '80px 120px' }}>
        <h2 style={{ margin: 0, color: NAVY, fontSize: isMobile ? 28 : 40, fontFamily: "'Rethink Sans',sans-serif", fontWeight: 700 }}>DePaul Scholarships</h2>
        <p style={{ margin: '16px 0 0', color: TEXT_GRAY, fontSize: isMobile ? 15 : 17 }}>
          Merit and need-based scholarships available to undergraduate students.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20, marginTop: 40 }}>
          {[
            { title: 'Vincent DePaul Scholarship',  desc: 'Up to full tuition for exceptional academic achievement', amount: 'Up to $52,000/year', highlight: true },
            { title: 'DePaul Grant',                 desc: 'Need-based grant for eligible undergraduate students',    amount: 'Up to $12,000/year', highlight: false },
            { title: 'Transfer Scholarship',          desc: 'For transfer students with strong academic records',      amount: 'Up to $15,000/year', highlight: false },
            { title: 'Study Abroad Grant',            desc: 'Support for international academic experiences',          amount: 'Up to $3,000',       highlight: false },
            { title: 'Community Service Award',       desc: 'Recognizing commitment to service and community',         amount: 'Up to $5,000/year',  highlight: false },
            { title: 'First Generation Award',        desc: 'Supporting first-generation college students',            amount: 'Up to $8,000/year',  highlight: false },
          ].map(({ title, desc, amount, highlight }) => (
            <ScholarshipCard key={title} title={title} desc={desc} amount={amount} highlight={highlight} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ScholarshipCard({ title, desc, amount, highlight }: { title: string; desc: string; amount: string; highlight: boolean }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: '1px solid #eee', borderRadius: 8, padding: 28, cursor: 'pointer',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.1)' : 'none', transition: 'box-shadow 0.2s',
      }}>
      <h3 style={{ margin: 0, color: '#003DA5', fontWeight: 700, fontSize: 17 }}>{title}</h3>
      <p style={{ margin: '8px 0 0', color: '#555', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
      <p style={{ margin: '16px 0 0', color: highlight ? '#C41230' : '#003DA5', fontWeight: 700, fontSize: 16 }}>{amount}</p>
    </div>
  );
}
