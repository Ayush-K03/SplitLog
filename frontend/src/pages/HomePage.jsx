import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./HomePage.css";

export function ShowHomePage() {
  // Mirrors the same localStorage key + data-theme attribute that the
  // authenticated app uses, so a preference set here carries straight
  // into the dashboard after signing in.
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Lightweight scroll-reveal: fades/slides each marked section in once
  // it enters the viewport. Purely presentational, no data involved.
  const revealTargets = useRef([]);
  const addReveal = (el) => {
    if (el && !revealTargets.current.includes(el)) revealTargets.current.push(el);
  };

  useEffect(() => {
    // Only elements that get this class start hidden — added here, in JS,
    // rather than as a static CSS default. That way, if JS fails to run
    // for any reason, every section is simply visible from the start
    // instead of permanently stuck at opacity 0.
    revealTargets.current.forEach((el) => el.classList.add('pre-reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const year = new Date().getFullYear();

  const features = [
    {
      title: 'Groups with invite codes',
      description: 'Spin up a group for a trip, a flat, or a friend circle and invite people in seconds with a shareable code.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="8" r="3.2"></circle>
          <path d="M3.5 20c0-3.5 2.7-5.8 5.5-5.8s5.5 2.3 5.5 5.8"></path>
          <path d="M18 8v5M15.5 10.5h5"></path>
        </svg>
      ),
    },
    {
      title: 'Split any expense',
      description: 'Log what was paid and choose exactly who it should be split between — never a rigid "split evenly" default.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3v18M17 3v18"></path>
          <path d="M3 8h4M17 8h4M3 16h4M17 16h4"></path>
        </svg>
      ),
    },
    {
      title: 'Balances, instantly',
      description: 'Every balance — per group and across your whole account — recalculates the moment an expense is added.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19V10M12 19V5M20 19v-7"></path>
        </svg>
      ),
    },
    {
      title: 'Smart settle-up',
      description: 'A debt-simplification engine collapses a tangle of group debts into the fewest possible payments.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7h11l-3-3M20 17H9l3 3"></path>
        </svg>
      ),
    },
    {
      title: 'Full settlement history',
      description: 'Every payment you\'ve made or received is logged, so there\'s never a dispute about who settled what.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 7v5l3.5 2"></path>
        </svg>
      ),
    },
    {
      title: 'Light & dark, your call',
      description: 'A theme that follows your preference everywhere in the app — including right here on this page.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4.5"></circle>
          <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path>
        </svg>
      ),
    },
  ];

  const steps = [
    { title: 'Create or join a group', description: 'Start a group and share the invite code, or drop a code someone sent you.' },
    { title: 'Log an expense', description: 'Add what was paid and pick exactly who it\'s split between.' },
    { title: 'Watch balances update', description: 'SplitLog works out everyone\'s share the moment it\'s added.' },
    { title: 'Settle up', description: 'Pay the fewest people possible — and the group is even.' },
  ];

  const securityPoints = [
    {
      title: 'Encrypted passwords',
      description: 'Passwords are hashed with bcrypt before they ever touch the database — never stored in plain text.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="9" rx="2"></rect>
          <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
        </svg>
      ),
    },
    {
      title: 'Secure sessions',
      description: 'Sign-in uses httpOnly JWT cookies, so your session token is never exposed to page scripts.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"></path>
        </svg>
      ),
    },
    {
      title: 'Validated, every time',
      description: 'Every request is checked before it can touch your data — no malformed group, expense, or account slips through.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12l2 2 4-4"></path>
          <circle cx="12" cy="12" r="9"></circle>
        </svg>
      ),
    },
  ];

  return (
    <div className="landing">
      {/* ===== Nav ===== */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="header-logo">
            <span className="logo-icon">💰</span>
            SplitLog
          </Link>

          <nav className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#security">Security</a>
          </nav>

          <div className="landing-nav-actions">
            <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <span className="hero-blob hero-blob-1"></span>
          <span className="hero-blob hero-blob-2"></span>
          <span className="hero-dotgrid"></span>
        </div>

        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              Now with smart settle-up
            </div>

            <h1 className="hero-title">
              Split expenses.
              <br />
              <span className="hero-title-accent">Not friendships.</span>
            </h1>

            <p className="hero-subtitle">
              SplitLog tracks every shared expense, works out who owes who, and
              settles your whole group in the fewest payments possible — so you
              spend less time doing the math and more time with the people you split with.
            </p>

            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started — it's free
              </Link>
              <a href="#how-it-works" className="btn btn-outline btn-lg">
                See how it works
              </a>
            </div>

            <div className="hero-trust">
              <span>🔒 Bank-grade password hashing</span>
              <span>⚡ Instant balance calculation</span>
              <span>🤝 No card required</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="mockup-float mockup-float-a">
              <span className="mockup-float-icon">✅</span> Settled up
            </div>

            <div className="mockup-card">
              <div className="mockup-card-header">
                <div>
                  <div className="mockup-card-title">Goa Trip 🏖️</div>
                  <div className="mockup-card-subtitle">4 members</div>
                </div>
                <div className="mockup-avatars">
                  <span className="mockup-avatar" style={{ '--avatar-color': '#4f46e5' }}>A</span>
                  <span className="mockup-avatar" style={{ '--avatar-color': '#0f9d58' }}>R</span>
                  <span className="mockup-avatar" style={{ '--avatar-color': '#d97706' }}>P</span>
                  <span className="mockup-avatar" style={{ '--avatar-color': '#e5484d' }}>S</span>
                </div>
              </div>

              <div className="mockup-card-body">
                <div className="mockup-row">
                  <span>Hotel booking</span>
                  <span className="mockup-amount">₹8,400</span>
                </div>
                <div className="mockup-row">
                  <span>Dinner at the beach shack</span>
                  <span className="mockup-amount">₹2,150</span>
                </div>
                <div className="mockup-row">
                  <span>Cab fare</span>
                  <span className="mockup-amount">₹960</span>
                </div>
              </div>

              <div className="mockup-card-footer">
                <span>Your balance</span>
                <span className="mockup-balance">+ ₹1,240</span>
              </div>
            </div>

            <div className="mockup-float mockup-float-b">2 payments left</div>
          </div>
        </div>
      </section>

      {/* ===== Stats strip ===== */}
      <section className="stats-strip">
        <div className="stats-strip-inner">
          <div className="stats-strip-item">
            <strong>3 steps</strong>
            <span>from signup to settled</span>
          </div>
          <div className="stats-strip-item">
            <strong>0</strong>
            <span>spreadsheets required</span>
          </div>
          <div className="stats-strip-item">
            <strong>100%</strong>
            <span>of debts simplified automatically</span>
          </div>
          <div className="stats-strip-item">
            <strong>24/7</strong>
            <span>access to your groups</span>
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="section" id="features">
        <div className="section-inner">
          <div className="section-header reveal" ref={addReveal}>
            <span className="eyebrow">Features</span>
            <h2>Everything you need, nothing you don't</h2>
            <p>Built for roommates, trips, and friend groups who'd rather not do the math themselves.</p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <div className="feature-card reveal" ref={addReveal} key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="section section-alt" id="how-it-works">
        <div className="section-inner">
          <div className="section-header reveal" ref={addReveal}>
            <span className="eyebrow">How it works</span>
            <h2>Settled up in four steps</h2>
          </div>

          <div className="steps">
            {steps.map((step, index) => (
              <div className="step-card reveal" ref={addReveal} key={step.title}>
                <div className="step-number">{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < steps.length - 1 && <span className="step-connector" aria-hidden="true"></span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Why SplitLog — debt simplification ===== */}
      <section className="section" id="why">
        <div className="why-inner reveal" ref={addReveal}>
          <div className="why-copy">
            <span className="eyebrow">The smart part</span>
            <h2>We don't just split. We simplify.</h2>
            <p>
              Most apps stop at "who owes what." SplitLog goes further with a
              debt-simplification engine that collapses a whole group's tangle
              of debts into the minimum number of payments — so instead of
              everyone paying everyone back, a couple of payments settle the
              entire group.
            </p>
            <ul className="why-list">
              <li>Automatic per-group and account-wide balances</li>
              <li>Greedy debt-matching to minimize transactions</li>
              <li>Full settlement history, always available</li>
            </ul>
          </div>

          <div className="why-visual">
            <svg viewBox="0 0 320 220" width="100%" height="100%" role="img" aria-label="Before: six payments between four people. After: two payments.">
              <g>
                <text x="60" y="18" textAnchor="middle" className="debt-diagram-label">Before</text>
                <line x1="60" y1="35" x2="20" y2="90" className="debt-diagram-edge debt-diagram-edge-busy" />
                <line x1="60" y1="35" x2="100" y2="90" className="debt-diagram-edge debt-diagram-edge-busy" />
                <line x1="60" y1="35" x2="60" y2="145" className="debt-diagram-edge debt-diagram-edge-busy" />
                <line x1="20" y1="90" x2="100" y2="90" className="debt-diagram-edge debt-diagram-edge-busy" />
                <line x1="20" y1="90" x2="60" y2="145" className="debt-diagram-edge debt-diagram-edge-busy" />
                <line x1="100" y1="90" x2="60" y2="145" className="debt-diagram-edge debt-diagram-edge-busy" />
                <circle cx="60" cy="35" r="14" className="debt-diagram-node" /><text x="60" y="40" textAnchor="middle" className="debt-diagram-initial">A</text>
                <circle cx="20" cy="90" r="14" className="debt-diagram-node" /><text x="20" y="95" textAnchor="middle" className="debt-diagram-initial">R</text>
                <circle cx="100" cy="90" r="14" className="debt-diagram-node" /><text x="100" y="95" textAnchor="middle" className="debt-diagram-initial">P</text>
                <circle cx="60" cy="145" r="14" className="debt-diagram-node" /><text x="60" y="150" textAnchor="middle" className="debt-diagram-initial">S</text>
              </g>

              <text x="160" y="115" textAnchor="middle" className="debt-diagram-arrow">→</text>

              <g transform="translate(200,0)">
                <text x="60" y="18" textAnchor="middle" className="debt-diagram-label">After</text>
                <line x1="60" y1="35" x2="20" y2="90" className="debt-diagram-edge debt-diagram-edge-simple" />
                <line x1="100" y1="90" x2="60" y2="145" className="debt-diagram-edge debt-diagram-edge-simple" />
                <circle cx="60" cy="35" r="14" className="debt-diagram-node" /><text x="60" y="40" textAnchor="middle" className="debt-diagram-initial">A</text>
                <circle cx="20" cy="90" r="14" className="debt-diagram-node debt-diagram-node-accent" /><text x="20" y="95" textAnchor="middle" className="debt-diagram-initial">R</text>
                <circle cx="100" cy="90" r="14" className="debt-diagram-node" /><text x="100" y="95" textAnchor="middle" className="debt-diagram-initial">P</text>
                <circle cx="60" cy="145" r="14" className="debt-diagram-node debt-diagram-node-accent" /><text x="60" y="150" textAnchor="middle" className="debt-diagram-initial">S</text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* ===== Security ===== */}
      <section className="section section-alt" id="security">
        <div className="section-inner">
          <div className="section-header reveal" ref={addReveal}>
            <span className="eyebrow">Security</span>
            <h2>Your data, handled properly</h2>
          </div>

          <div className="security-grid">
            {securityPoints.map((point) => (
              <div className="security-card reveal" ref={addReveal} key={point.title}>
                <div className="feature-icon">{point.icon}</div>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="final-cta">
        <div className="final-cta-inner reveal" ref={addReveal}>
          <h2>Ready to stop doing the math?</h2>
          <p>Create your first group in under a minute.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">Create your free account</Link>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <Link to="/" className="header-logo">
            <span className="logo-icon">💰</span>
            SplitLog
          </Link>
          <div className="landing-footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#security">Security</a>
            <Link to="/login">Log In</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
          <span className="landing-footer-copy">© {year} SplitLog. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}