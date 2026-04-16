import React from 'react';

const FOOTER_COLUMNS = {
  Solutions: [
    'iOS/Android App', 'Docs', 'Cal.ai - AI Phone Agent', 'Enterprise',
    'Integrate Cal.com', 'Routing', 'Cal.com Atoms', 'Desktop App',
    'FAQ', 'Enterprise API', 'Github', 'Docker',
  ],
  'Use Cases': [
    'Sales', 'Customer Support', 'Higher Education', 'Telehealth',
    'Professional Services', 'Hiring Marketplace', 'Human Resources',
    'Tutoring', 'C-suite', 'Law',
  ],
  Resources: [
    'Cal Fonts', 'Teams', 'Embed', 'Recurring events',
    'Developers', 'OOO', 'Workflows', 'Instant Meetings',
    'App Store', 'Requires confirmation', 'Payments',
    'Video Conferencing', 'Cal.com vs Calendly',
  ],
  Company: [
    'Jobs', 'Support', 'Privacy', 'Terms', 'License', 'Security', 'Changelog', 'Get a demo', 'Talk to sales',
  ],
};

const DOWNLOADS = ['iPhone', 'Android', 'Chrome', 'Safari', 'Edge', 'Firefox', 'MacOS', 'Windows', 'Linux'];

export default function Footer() {
  return (
    <footer style={{ background: '#EBEBEB', padding: '0 24px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          background: '#F3F4F6', borderRadius: 24,
          padding: '56px 56px 40px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 1fr 1fr 1fr', gap: 32, marginBottom: 48 }}>

            {/* Brand col */}
            <div>
              <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 12 }}>
                <img src="/images/11KSGbIZoRSg4pjdnUoif6MKHI.svg" alt="Cal.com" style={{ width: 20, height: 20 }} />
                <span style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: 18, fontWeight: 700, color: '#111827' }}>Cal.com</span>
              </a>
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 20 }}>
                Our mission is to connect a billion people by 2031 through calendar scheduling.
              </p>

              {/* Status + Language */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 500, color: '#374151' }}>English</div>
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
                  All Systems Operational
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                </div>
              </div>

              {/* Downloads */}
              <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Downloads</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {DOWNLOADS.map(d => (
                  <a key={d} href="#" style={{
                    fontSize: 12, color: '#374151', textDecoration: 'none',
                    background: '#fff', border: '1px solid #E5E7EB',
                    borderRadius: 8, padding: '5px 10px', fontWeight: 500,
                    transition: 'border-color 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                  >
                    {d}
                  </a>
                ))}
              </div>

              <p style={{ fontSize: 13, color: '#6B7280', marginTop: 24 }}>
                Need Help?{' '}
                <a href="mailto:support@cal.com" style={{ color: '#6366F1', textDecoration: 'none' }}>support@cal.com</a>
                {' '}or visit{' '}
                <a href="#" style={{ color: '#6366F1', textDecoration: 'none' }}>cal.com/help</a>.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_COLUMNS).map(([heading, links]) => (
              <div key={heading}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 16, letterSpacing: '0px' }}>
                  {heading}
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#111827'}
                        onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
              © 2026 Cal.com, Inc. · Cal.com® and Cal® are registered trademarks.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              {/* Twitter/X */}
              <a href="#" style={{ color: '#9CA3AF', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#374151'}
                onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'} aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* GitHub */}
              <a href="#" style={{ color: '#9CA3AF', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#374151'}
                onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'} aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" style={{ color: '#9CA3AF', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#374151'}
                onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'} aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
