// === Plum Track & Field — main app shell, router, header, footer ===
import React from 'react';
import { PTF_PHOTOS } from './data/photos.js';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } from './components/TweaksPanel.jsx';
import { HomeStadium, HomeMarquee, HomeLanes } from './pages/Home.jsx';
import { RecordsPage, JrHighPage } from './pages/Records.jsx';
import { ResultsPage } from './pages/Results.jsx';
import { PhotosPage, RosterPage, SchedulePage, FormsPage, ContactPage, StatesPage, CoachIPage, PHOTO_YEARS, ROSTER_YEARS } from './pages/Content.jsx';
import { LearnPage } from './pages/Learn.jsx';
import { DonatePage } from './pages/Donate.jsx';
import { routeHref } from './utils/paths.js';
import { useModalDialog } from './utils/useModalDialog.js';

const NAV = [
  { id: "home", title: "Home", href: "/", match: (r) => r.section === "home" },
  { id: "records", title: "Records", match: (r) => r.section === "records",
    children: [
      { label: "BOYS", section: true },
      { id: "boys-indoor", title: "Boys Indoor", href: "/records/boys-indoor" },
      { id: "boys-outdoor", title: "Boys Outdoor", href: "/records/boys-outdoor" },
      { id: "boys-stadium", title: "Boys Stadium", href: "/records/boys-stadium" },
      { label: "GIRLS", section: true },
      { id: "girls-indoor", title: "Girls Indoor", href: "/records/girls-indoor" },
      { id: "girls-outdoor", title: "Girls Outdoor", href: "/records/girls-outdoor" },
      { id: "girls-stadium", title: "Girls Stadium", href: "/records/girls-stadium" }
    ] },
  { id: "results", title: "Results", match: (r) => r.section === "results",
    children: [
      { id: "piaa-champions", title: "PIAA Champions", href: "/results/piaa-champions" },
      { id: "piaa-placers", title: "PIAA Placers", href: "/results/piaa-placers" },
      { id: "wpial-champions", title: "WPIAL Champions", href: "/results/wpial-champions" },
      { id: "wpial-placers", title: "WPIAL Placers", href: "/results/wpial-placers" },
      { id: "season-archives", title: "Season Archives", href: "/results/season-archives" }
    ] },
  { id: "photos", title: "Photos", href: "/gallery/" + (Object.keys(PTF_PHOTOS || {}).map(Number).sort((a,b)=>b-a)[0] || 2016), match: (r) => r.section === "photos" },
  { id: "roster", title: "Roster", href: "/roster/2015", match: (r) => r.section === "roster" },
  { id: "schedule", title: "Schedule", href: "/schedule", match: (r) => r.section === "schedule" },
  { id: "forms", title: "Forms", match: (r) => r.section === "forms",
    children: [
      { id: "registration", title: "Registration", href: "/forms/registration" },
      { id: "physicals", title: "Physicals", href: "/forms/physicals" }
    ] },
  { id: "jrhigh", title: "Jr High", match: (r) => r.section === "jrhigh",
    children: [
      { id: "boys", title: "Boys Records", href: "/jrhigh/boys" },
      { id: "girls", title: "Girls Records", href: "/jrhigh/girls" }
    ] },
  { id: "learn", title: "Learn", match: (r) => r.section === "learn",
    children: [
      { label: "DRILLS", section: true },
      { id: "hurdles", title: "Hurdle Drills", href: "/learn/drills/hurdles" },
      { id: "ladders", title: "Ladder Drills", href: "/learn/drills/ladders" },
      { label: "INSPIRATION", section: true },
      { id: "quotes", title: "Quotes", href: "/learn/inspiration/quotes" },
      { id: "records", title: "World Records", href: "/learn/inspiration/records" }
    ] },
];

function parseRoute(path) {
  const clean = path.replace(/^\/+|\/+$/g, "");
  if (!clean) return { section: "home" };
  const [section, sub, deep, ...rest] = clean.split("/");
  if (section === "gallery") return { section: "photos", sub, deep, rest: rest.join("/") };
  return { section, sub, deep, rest: rest.join("/") };
}

function useRoute() {
  const getPath = () => window.location.hash.startsWith("#/") ? window.location.hash.slice(1) : (window.location.pathname || "/");
  const [path, setPath] = React.useState(getPath);
  React.useEffect(() => {
    // Normalize legacy hash URLs (e.g. /#/records/boys-outdoor) to clean paths.
    if (window.location.hash.startsWith("#/")) {
      const clean = window.location.hash.slice(1);
      window.history.replaceState(null, "", clean);
      setPath(clean);
    }
  }, []);
  React.useEffect(() => {
    const onRoute = () => {
      setPath(getPath());
      window.scrollTo(0, 0);
    };
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest("a[href]");
      if (!link || link.target || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash || url.pathname === window.location.pathname) return;

      event.preventDefault();
      window.history.pushState(null, "", url.pathname + url.search);
      onRoute();
    };
    window.addEventListener("popstate", onRoute);
    window.addEventListener("hashchange", onRoute);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onRoute);
      window.removeEventListener("hashchange", onRoute);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return parseRoute(path);
}

// === Page titles ===
const SITE_TITLE = "Plum Mustangs Track & Field";
const LEARN_TOPIC_TITLES = { drills: "Drills", inspiration: "Inspiration" };

// The browser tab's title: the page the screen shows, then the site.
function pageTitle(route) {
  const child = (navId, id) => NAV.find(n => n.id === navId)?.children?.find(c => c.id === id && !c.section)?.title;
  const shownYear = (years, sub) => { const y = parseInt(sub, 10); return years.includes(y) ? y : years[0]; };
  switch (route.section) {
    case "records": return (child("records", route.sub) || "Boys Indoor") + " Records";
    case "jrhigh": return "Junior High " + (route.sub === "girls" ? "Girls" : "Boys") + " Records";
    case "results":
      if (route.sub === "season-archives") {
        const year = parseInt(route.deep, 10);
        return (year ? year + " " : "") + "Season Archives";
      }
      return child("results", route.sub) || "PIAA Champions";
    case "photos": return shownYear(PHOTO_YEARS, route.sub) + " Photos & Videos";
    case "roster": return shownYear(ROSTER_YEARS, route.sub) + " Roster";
    case "schedule": return "Schedule";
    case "forms": return child("forms", route.sub) || "Registration";
    case "learn": return (route.deep && child("learn", route.deep)) || LEARN_TOPIC_TITLES[route.sub] || "Learn";
    case "contact": return "Contact";
    case "states": return "Qualifying for States";
    case "coachi": return "Coach I";
    case "donate": return "Donate";
    default: return null;   // home, and unknown paths, which show the home page
  }
}

// === Headers ===

function UtilityBand() {
  return (
    <div className="utility-band">
      <span>PLUM BOROUGH SCHOOL DISTRICT · RUNNING MUSTANGS</span>
      <span>WPIAL · SECTION 3 · CLASS AAA</span>
    </div>
  );
}

function BrandLockup() {
  return (
    <a className="brand-lockup" href={routeHref("/")}>
      <img className="plum-logo" src="/assets/plum-purple.png" alt="Plum" decoding="async" fetchpriority="high" />
      <div className="tf-tag">
        <span className="top">Track &amp; Field</span>
        <span className="bot">PLUM MUSTANGS</span>
      </div>
    </a>
  );
}

// --- Mobile navigation ---
function MobileNav({ route }) {
  const [open, setOpen] = React.useState(false);
  const dialogRef = useModalDialog(open, () => setOpen(false));
  React.useEffect(() => { setOpen(false); }, [route.section, route.sub, route.deep]);
  React.useEffect(() => {
    const query = window.matchMedia('(max-width: 1024px)');
    const onResize = () => { if (!query.matches) setOpen(false); };
    query.addEventListener('change', onResize);
    return () => query.removeEventListener('change', onResize);
  }, []);
  return (
    <div className="mobile-nav">
      <button className="mobile-menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-site-menu" onClick={() => setOpen(true)}>
        <span aria-hidden="true">☰</span> Menu
        <span className="mobile-current-page">{NAV.find(item => item.match(route))?.title || 'Plum Mustangs'}</span>
      </button>
      {open && (
        <div className="mobile-menu-overlay" onClick={() => setOpen(false)}>
          <div className="mobile-menu-panel" id="mobile-site-menu" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Site menu" tabIndex={-1} onClick={event => event.stopPropagation()}>
            <div className="mobile-menu-toolbar"><span>Plum Mustangs</span><button aria-label="Close menu" onClick={() => setOpen(false)}>✕</button></div>
            <nav aria-label="Main navigation">
              {NAV.map(item => item.children ? (
                <details className="mobile-menu-group" key={item.id} open={item.match(route) || undefined}>
                  <summary>{item.title}</summary>
                  <div className="mobile-menu-links">
                    {item.children.map((child, i) => child.section ? <span className="mobile-menu-label" key={i}>{child.label}</span> : (
                      <a key={child.id} href={routeHref(child.href)} aria-current={child.href === window.location.pathname ? 'page' : undefined} onClick={() => setOpen(false)}>{child.title}</a>
                    ))}
                  </div>
                </details>
              ) : <a className="mobile-menu-link" key={item.id} href={routeHref(item.href)} aria-current={item.match(route) ? 'page' : undefined} onClick={() => setOpen(false)}>{item.title}</a>)}
              <a className="mobile-menu-link" href={routeHref('/contact')} onClick={() => setOpen(false)}>Contact</a>
              <a className="mobile-menu-link" href={routeHref('/donate')} onClick={() => setOpen(false)}>Donate</a>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Nav variant: DROPDOWN ---
function NavDropdown({ route }) {
  const [open, setOpen] = React.useState(null);
  const [dropdownLeft, setDropdownLeft] = React.useState(0);
  const navRef = React.useRef(null);
  const shellRef = React.useRef(null);
  const buttonRefs = React.useRef({});

  React.useEffect(() => {
    setOpen(null);
  }, [route.section, route.sub, route.deep]);

  // Escape closes the open menu and returns focus to its button; a click or tap
  // anywhere outside the nav closes it too.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      const button = buttonRefs.current[open];
      setOpen(null);
      if (button) button.focus();
    };
    const onPointer = (event) => {
      if (shellRef.current && !shellRef.current.contains(event.target)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const positionDropdown = React.useCallback((target) => {
    if (!navRef.current || !target) return;

    const navBox = navRef.current.getBoundingClientRect();
    const targetBox = target.getBoundingClientRect();
    const panelWidth = 240;
    const maxLeft = Math.max(0, navBox.width - panelWidth);
    setDropdownLeft(Math.min(Math.max(0, targetBox.left - navBox.left), maxLeft));
  }, []);

  const openItem = NAV.find(n => n.id === open && n.children);

  return (
    <div className={"nav-shell" + (openItem ? " open" : "")} ref={shellRef} onMouseLeave={() => setOpen(null)}>
      <nav className="site-nav" ref={navRef}>
        {NAV.map(n => (
          <div
            className={"nav-item" + (open === n.id ? " open" : "")}
            key={n.id}
          >
            {n.href ? (
              <a className={"nav-link" + (n.match(route) ? " active" : "")} href={routeHref(n.href)}>{n.title}</a>
            ) : (
              <button
                type="button"
                ref={(el) => { buttonRefs.current[n.id] = el; }}
                className={"nav-link" + (n.match(route) ? " active" : "")}
                aria-expanded={open === n.id}
                onClick={(event) => {
                  positionDropdown(event.currentTarget);
                  setOpen((current) => current === n.id ? null : n.id);
                }}
              >
                {n.title}<span className="caret" aria-hidden="true">▾</span>
              </button>
            )}
          </div>
        ))}
      </nav>
      {openItem && (
        <div className="nav-dropdown" style={{ left: dropdownLeft }}>
          {openItem.children.map((c, i) => (
            c.section ? (
              <div key={i} className="dropdown-section-label">{c.label}</div>
            ) : (
              <a className="dropdown-link" key={c.id} href={routeHref(c.href)} onClick={() => setOpen(null)}>{c.title}</a>
            )
          ))}
        </div>
      )}
    </div>
  );
}

// --- Nav variant: MEGA ---
function NavMega({ route }) {
  const [open, setOpen] = React.useState(null);
  return (
    <nav className="site-nav nav-mega" onMouseLeave={() => setOpen(null)}>
      {NAV.map(n => (
        <div className="nav-item" key={n.id} onMouseEnter={() => setOpen(n.id)}>
          {n.href ? (
            <a className={"nav-link" + (n.match(route) ? " active" : "")} href={routeHref(n.href)}>
              {n.title}{n.children && <span className="caret" aria-hidden="true">▾</span>}
            </a>
          ) : (
            <button
              type="button"
              className={"nav-link" + (n.match(route) ? " active" : "")}
              aria-expanded={n.children ? open === n.id : undefined}
              onClick={() => setOpen((current) => current === n.id ? null : n.id)}
            >
              {n.title}{n.children && <span className="caret" aria-hidden="true">▾</span>}
            </button>
          )}
        </div>
      ))}
      {open && NAV.find(n => n.id === open)?.children && (
        <div className="mega-panel" onMouseLeave={() => setOpen(null)}>
          <div className="mega-inner">
            <div className="mega-eb">{NAV.find(n => n.id === open).title.toUpperCase()}</div>
            <div className="mega-grid">
              {NAV.find(n => n.id === open).children.map((c, i) => (
                c.section ? (
                  <div key={i} className="mega-section">{c.label}</div>
                ) : (
                  <a key={c.id} className="mega-link" href={routeHref(c.href)} onClick={() => setOpen(null)}>
                    <span className="mega-num">{String(i+1).padStart(2,"0")}</span>
                    <span className="mega-title">{c.title}</span>
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// === Footer ===
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/assets/plum-yellow.png" className="plum-logo" alt="Plum" decoding="async" loading="lazy"/>
          <div className="tag">PLUM MUSTANGS · TRACK &amp; FIELD</div>
          <div className="desc">Questions about the program, schedule, or records? <a href={routeHref("/contact")} style={{color: "inherit", textDecoration: "underline", cursor: "pointer"}}>Contact us</a>.</div>
          <div className="footer-social">
            <a className="footer-social-link" href="https://x.com/PlumMustangs" target="_blank" rel="noopener" aria-label="Follow on X">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span>@PlumMustangs</span>
            </a>
            <a className="footer-social-link" href="https://instagram.com/plumhs_track_and_xc" target="_blank" rel="noopener" aria-label="Follow on Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.069 1.646.069 4.849 0 3.205-.012 3.584-.069 4.849-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.645.069-4.85.069-3.204 0-3.584-.012-4.849-.069-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.647 2.163 15.268 2.163 12s.012-3.584.07-4.849c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.141 0-3.503.012-4.74.068-1.026.047-1.582.218-1.953.362-.49.19-.84.418-1.208.787-.369.368-.597.718-.787 1.208-.144.371-.315.927-.362 1.953-.056 1.237-.068 1.599-.068 4.74s.012 3.503.068 4.74c.047 1.026.218 1.582.362 1.953.19.49.418.84.787 1.208.368.369.718.597 1.208.787.371.144.927.315 1.953.362 1.237.056 1.599.068 4.74.068s3.503-.012 4.74-.068c1.026-.047 1.582-.218 1.953-.362.49-.19.84-.418 1.208-.787.369-.368.597-.718.787-1.208.144-.371.315-.927.362-1.953.056-1.237.068-1.599.068-4.74s-.012-3.503-.068-4.74c-.047-1.026-.218-1.582-.362-1.953-.19-.49-.418-.84-.787-1.208-.368-.369-.718-.597-1.208-.787-.371-.144-.927-.315-1.953-.362-1.237-.056-1.599-.068-4.74-.068zm0 3.063A4.972 4.972 0 1 1 7.028 12 4.978 4.978 0 0 1 12 7.028zm0 8.203A3.231 3.231 0 1 0 8.769 12 3.235 3.235 0 0 0 12 15.231zm6.406-8.397a1.163 1.163 0 1 1-1.163-1.163 1.163 1.163 0 0 1 1.163 1.163z"/></svg>
              <span>@plumhs_track_and_xc</span>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Compete</h4>
          <ul>
            <li><a href={routeHref("/schedule")}>Schedule</a></li>
            <li><a href={routeHref("/records/boys-outdoor")}>School Records</a></li>
            <li><a href={routeHref("/results/piaa-champions")}>PIAA Results</a></li>
            <li><a href={routeHref("/results/wpial-champions")}>WPIAL Results</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Archive</h4>
          <ul>
            <li><a href={routeHref("/gallery/2014")}>Photos &amp; Videos</a></li>
            <li><a href={routeHref("/roster/2015")}>Rosters</a></li>
            <li><a href={routeHref("/jrhigh/boys")}>Jr High Records</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Train</h4>
          <ul>
            <li><a href={routeHref("/learn/drills/hurdles")}>Hurdle Drills</a></li>
            <li><a href={routeHref("/learn/drills/ladders")}>Ladder Drills</a></li>
            <li><a href={routeHref("/learn/inspiration/quotes")}>Inspiration</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 PLUM BOROUGH SCHOOL DISTRICT</span>
        <span>900 ELICKER RD · PLUM, PA 15239</span>
      </div>
    </footer>
  );
}

// === Page router ===
function PageBody({ route, homeVariant }) {
  if (route.section === "home" || !route.section) {
    if (homeVariant === "stadium") return <HomeStadium />;
    if (homeVariant === "marquee") return <HomeMarquee />;
    if (homeVariant === "lanes") return <HomeLanes />;
    return <HomeStadium />;
  }
  if (route.section === "records") return <RecordsPage sub={route.sub} />;
  if (route.section === "results") return <ResultsPage sub={route.sub} deep={route.deep ? (route.deep + (route.rest ? "/" + route.rest : "")) : undefined} />;
  if (route.section === "photos") return <PhotosPage sub={route.sub} />;
  if (route.section === "roster") return <RosterPage sub={route.sub} />;
  if (route.section === "schedule") return <SchedulePage />;
  if (route.section === "forms") return <FormsPage sub={route.sub} />;
  if (route.section === "jrhigh") return <JrHighPage sub={route.sub} />;
  if (route.section === "learn") return <LearnPage sub={route.sub} deep={route.deep} />;
  if (route.section === "contact") return <ContactPage />;
  if (route.section === "states") return <StatesPage />;
  if (route.section === "coachi") return <CoachIPage />;
  if (route.section === "donate") return <DonatePage />;
  return <HomeStadium />;
}

// === Tweaks ===
const DEFAULTS = /*EDITMODE-BEGIN*/{
  "homeVariant": "lanes",
  "navVariant": "dropdown",
  "showUtilityBand": true
}/*EDITMODE-END*/;

function App() {
  const route = useRoute();
  const [t, setTweak] = useTweaks(DEFAULTS);

  React.useEffect(() => {
    const title = pageTitle(route);
    document.title = title ? title + " · " + SITE_TITLE : SITE_TITLE;
  }, [route.section, route.sub, route.deep]);

  // After an in-app navigation, keyboard and screen-reader users start at the new page's heading.
  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const target = document.querySelector("main h1") || document.getElementById("main");
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }, [route.section, route.sub, route.deep]);

  const skipToContent = (event) => {
    event.preventDefault();
    const main = document.getElementById("main");
    main.focus({ preventScroll: true });
    main.scrollIntoView();
  };

  return (
    <React.Fragment>
      <a className="skip-link" href="#main" onClick={skipToContent}>Skip to content</a>
      {t.showUtilityBand && <UtilityBand />}
      <header className="site-header">
        <div className="header-row">
          <BrandLockup />
          <div className="header-meta">
            <a href={routeHref("/contact")} className="hm-btn">CONTACT</a>
            <a href={routeHref("/donate")} className="hm-btn donate">DONATE</a>
          </div>
        </div>
        {t.navVariant === "mega" ? <NavMega route={route} /> : <NavDropdown route={route} />}
        <MobileNav route={route} />
      </header>
      <main id="main" tabIndex={-1}>
        <PageBody route={route} homeVariant={t.homeVariant} />
      </main>
      <Footer />
      {/* The design-tool panel opens on a postMessage from any page, so it's for local
          development only and stays out of the production build. */}
      {import.meta.env.DEV && (
        <TweaksPanel title="Tweaks">
          <TweakSection label="Home Page">
            <TweakRadio label="Hero variant" value={t.homeVariant} onChange={(v) => setTweak("homeVariant", v)}
              options={[
                { value: "stadium", label: "Stadium" },
                { value: "marquee", label: "Marquee" },
                { value: "lanes", label: "Lanes" }
              ]}/>
          </TweakSection>
          <TweakSection label="Navigation">
            <TweakRadio label="Nav style" value={t.navVariant} onChange={(v) => setTweak("navVariant", v)}
              options={[
                { value: "dropdown", label: "Dropdown" },
                { value: "mega", label: "Mega Menu" }
              ]}/>
            <TweakToggle label="Top utility band" value={t.showUtilityBand} onChange={(v) => setTweak("showUtilityBand", v)} />
          </TweakSection>
        </TweaksPanel>
      )}
    </React.Fragment>
  );
}

export default App;
