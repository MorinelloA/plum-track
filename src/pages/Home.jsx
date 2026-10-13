// === Home page (with 3 variation layouts) ===
import React from 'react';
import { Icon } from '../components/Icon.jsx';
import { PTF_DATA } from '../data/data.js';
import { PTF_RECORDS } from '../data/records.js';
import { routeHref } from '../utils/paths.js';
import { ScholarshipBand } from './Donate.jsx';

const ORDER = PTF_DATA.orderOfEvents;
const FIELDS = PTF_DATA.fieldEvents;
const MEETS = PTF_DATA.upcomingMeets;

function EventsRail({ variant }) {
  const running = ORDER;

  return (
    <section className="events-section">
      <div className="events-inner">
        <div className="events-head">
          <h2>Order of Events</h2>
          <div className="sub">Official running order subject to change.</div>
        </div>
        <div className="events-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div className="events-col">
            {running.map(ev => (
              <div className="event-row" key={ev.name}>
                <span className="ord">{ev.ord}</span>
                <span className="name">{ev.name}{ev.note && <small>{ev.note}</small>}</span>
                <span className="meta">{ev.type.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Variation A: "Stadium" — purple wall, giant stacked title ---
export function HomeStadium() {
  return (
    <React.Fragment>
      <section className="hero hero-stadium">
        <div className="hero-track-bg"></div>
        <div className="hero-inner" style={{ gridTemplateColumns: "1fr", textAlign: "left", padding: "72px 28px 84px" }}>
          <div>
            <div className="hero-eyebrow">
              EST. 1964 <span className="rule"></span> PLUM BOROUGH SCHOOL DISTRICT <span className="rule"></span> WPIAL · PIAA
            </div>
            <h1>
              Plum<br/>
              <span className="accent">Track</span><br/>
              &amp; Field
            </h1>
            <p className="hero-tag">
              Six decades of Mustang speed, strength, and stamina. Home of WPIAL champions, PIAA placers, and the athletes building the next school record.
            </p>
            <div className="hero-stats">
              <div className="hero-stat"><div className="num">62</div><div className="lbl">YEARS RUNNING</div></div>
              <div className="hero-stat"><div className="num">14</div><div className="lbl">PIAA MEDALS</div></div>
              <div className="hero-stat"><div className="num">38</div><div className="lbl">WPIAL CHAMPS</div></div>
              <div className="hero-stat"><div className="num">240+</div><div className="lbl">VARSITY LETTERS</div></div>
            </div>
          </div>
        </div>
      </section>
      <ScholarshipBand />
      <EventsRail />
      <HomeQuickAccess />
    </React.Fragment>
  );
}

// --- Variation B: "Marquee" — wordmark + scrolling ticker ---
export function HomeMarquee() {
  const marqueeText = "MUSTANGS · TRACK & FIELD · EST. 1964 · WPIAL · PIAA · 1·2·3·4 · ";
  return (
    <React.Fragment>
      <section className="hero hero-marquee" style={{ paddingTop: 0 }}>
        <div className="hero-track-bg"></div>
        <div className="marquee-strip">
          <div className="marquee-inner">
            {Array.from({length: 6}).map((_,i) => <span key={i}>{marqueeText}</span>)}
          </div>
        </div>
        <div className="hero-inner" style={{ gridTemplateColumns: "1fr", padding: "48px 28px 72px", textAlign: "center" }}>
          <div>
            <div className="logo-marquee">
              <img src="/assets/plum-yellow.png" alt="Plum" className="big-plum" decoding="async" fetchpriority="high"/>
              <img src="/assets/mustangs-yellow.png" alt="Mustangs" className="big-must" decoding="async" fetchpriority="high"/>
            </div>
            <div className="big-tf">TRACK &amp; FIELD</div>
            <p className="hero-tag" style={{ margin: "26px auto 0", textAlign: "center" }}>
              Six decades of Mustang speed, strength, and stamina. <br/>WPIAL champions. PIAA placers. School records that still stand.
            </p>
          </div>
        </div>
        <div className="marquee-strip">
          <div className="marquee-inner reverse">
            {Array.from({length: 6}).map((_,i) => <span key={i}>{marqueeText}</span>)}
          </div>
        </div>
      </section>
      <ScholarshipBand />
      <EventsRail />
      <HomeQuickAccess />
    </React.Fragment>
  );
}

// --- Variation C: "Lanes" — track lane numbering, asymmetric blocks ---
export function HomeLanes() {
  return (
    <React.Fragment>
      <section className="hero hero-lanes">
        <div className="lanes-grid">
          <div className="lane lane-1">
            <span className="ln" aria-hidden="true">1</span>
            <span className="lane-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                {/* leaf */}
                <path d="M12.6 7C14 5 16.6 4 19 4.3 18.7 6.8 16.3 8.6 13.7 8.2 13.2 8.1 12.8 7.6 12.6 7Z"/>
                {/* stem */}
                <path d="M11.7 9C11.4 7.6 11.5 6.4 12.1 5.4 12.5 6.4 12.6 7.6 12.4 9Z"/>
                {/* body with central suture cleft (cut out so the lane shows through) */}
                <path fillRule="evenodd" d="M12 9C13.2 7.2 15.5 6.8 17.3 8.2 19.5 9.8 20.5 13 19.8 16 19 19.5 15.8 22 12 22 8.2 22 5 19.5 4.2 16 3.5 13 4.5 9.8 6.7 8.2 8.5 6.8 10.8 7.2 12 9ZM12 9.8C11.3 12 11.3 15 12 17.6 12.7 15 12.7 12 12 9.8Z"/>
              </svg>
            </span>
            <span className="lc">PLUM</span>
          </div>
          <div className="lane lane-2">
            <span className="ln" aria-hidden="true">2</span>
            {/* Horse-head silhouette — game-icons.net (Delapouite, CC BY 3.0) */}
            <span className="lane-icon" aria-hidden="true">
              <svg viewBox="0 0 512 512" fillRule="evenodd">
                <path d="M400 16c-21.335 9.73-58.244 17.34-73.086 48.232-22.36 1.948-72.753 10.673-122.22 40.25-58.098 34.74-116.017 97.417-131.776 213.702l-.48 3.537-2.774 2.25c-30.87 25.002-40.657 38.937-44.416 61.153-3.536 20.9-.72 51.46-.363 101.877H328.36c3.455-16.892 10.44-29.245 12.472-41.568 2.337-14.176.19-29.938-20.812-58.547-43.078-58.683-46.853-129.458-12.916-171.28-8.654-2.765-15.09-6.887-19.458-12.546-6.115-7.924-7.4-17.006-8.57-25.884l17.848-2.352c1.112 8.446 2.38 13.88 4.97 17.237 2.59 3.356 7.31 6.472 19.55 8.46l-.022.128.172-.17 5.998 9.424c19.957 31.358 42.84 51.292 73.332 54.44l6.51.672 1.367 6.4c2.74 12.828 8.626 19.095 15.116 22.238 6.49 3.143 14.225 2.944 20.47.205 9.316-4.086 14.518-11.35 16.7-22.712 2.122-11.05.546-25.834-5.137-42.106-33.538-38.248-44.475-87.277-63.903-128.772-6.055-9.947-12.448-18.518-20.385-24.856C376.808 55.126 386.456 34.852 400 16zM214.068 34.97C179.55 35.06 146.075 43.06 96 58.58c31.146 9.92 70.397 18.9 86.037 39.01 4.463-3.017 8.94-5.88 13.418-8.56 40.51-24.22 80.387-35.286 108.23-40.04-35.854-9.477-63.047-14.094-89.617-14.023zM157.16 96.712c-1.13-.01-2.265-.01-3.402.004-30.353.37-63.1 9.745-96.647 31.283 27.186 3.672 54.67 3.724 72.58 15.398 15.9-17.92 33.144-32.634 50.677-44.668-7.548-1.244-15.292-1.938-23.207-2.017zM368 128a13.214 13.215 0 0 1 13.213 13.215A13.214 13.215 0 0 1 368 154.432a13.214 13.215 0 0 1-13.213-13.217A13.214 13.215 0 0 1 368 128zm-238.906 16.068c-36.395 1.495-68.903 6.53-104.76 24.766 33.236 7.095 50.913 13.507 65.025 33.83 11.522-22.53 25.045-41.93 39.734-58.596zM74.518 201.46C53.53 201.65 36.614 213.14 16 224c27.854 0 46.067 3.862 58.71 12.055 4.33-11.652 9.16-22.615 14.41-32.924-5.12-1.19-9.963-1.71-14.602-1.67zm-.623 36.82c-17.933 5.845-35.452 7.15-54.23 22.284 17.62 4.638 34.79 9.596 41.398 22.034 3.496-15.77 7.814-30.523 12.832-44.32zm370.142 8.57c1.617-.035 3.222.044 4.783.187l-1.64 17.926c-3.928-.36-5.513.416-5.57.465-.058.048-1.035.656-.635 5.886l-17.95 1.372c-.638-8.35 1.297-16.207 6.955-20.997 4.245-3.593 9.206-4.735 14.057-4.84zM52.215 290.723c-10.352.13-23.76 5.646-34.656 12.334 12.173 6.83 12.357 23.472 8.938 37.668 7.3-9.105 16.855-18.323 29.158-28.48 1.016-7.043 2.19-13.9 3.506-20.585-2.082-.67-4.42-.97-6.947-.937z"/>
              </svg>
            </span>
            <span className="lc">MUSTANGS</span>
          </div>
          <div className="lane lane-3 main">
            <div className="lane-eb">PLUM MUSTANGS · VARSITY TRACK</div>
            <h1>PLUM<br/><span>TRACK &amp; FIELD</span></h1>
            <blockquote className="coach-tribute">
              <span className="quote-mark" aria-hidden="true">“</span>
              <span className="quote-text">Look at you!</span>
            </blockquote>
          </div>
          <div className="lane lane-4">
            <span className="ln" aria-hidden="true">4</span>
            <span className="lane-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M14 2 L5 14 H11 L10 22 L19 9 H13 L14 2 Z"/>
              </svg>
            </span>
            <span className="lc">SPEED</span>
          </div>
          <div className="lane lane-5">
            <span className="ln" aria-hidden="true">5</span>
            <span className="lane-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
            </span>
            <span className="lc">STRENGTH</span>
          </div>
          <div className="lane lane-6">
            <span className="ln" aria-hidden="true">6</span>
            <span className="lane-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
              </svg>
            </span>
            <span className="lc">STAMINA</span>
          </div>
        </div>
      </section>
      <ScholarshipBand />
      <EventsRail />
      <HomeQuickAccess />
    </React.Fragment>
  );
}

// Stable pseudo-random index from epoch week — same everywhere, not file order.
function spotlightIndexForWeek(weekIdx, length) {
  let h = (weekIdx | 0) ^ 0x9e3779b9;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) % length;
}

function getSpotlightRecord() {
  const R = PTF_RECORDS || {};
  const cats = [
    ["boysOutdoor", "Boys Outdoor"],
    ["girlsOutdoor", "Girls Outdoor"],
  ];
  const all = [];
  cats.forEach(([k, label]) => {
    (R[k] || []).forEach(rec => all.push({ ...rec, category: label }));
  });
  if (!all.length) return null;
  const now = new Date();
  const weekIdx = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / (7 * 24 * 60 * 60 * 1000));
  return all[spotlightIndexForWeek(weekIdx, all.length)];
}

function HomeQuickAccess() {
  const spotlight = getSpotlightRecord();
  const lastProg = spotlight && spotlight.progression && spotlight.progression[spotlight.progression.length - 1];
  const dateStr = (lastProg && lastProg.yr) || (spotlight && spotlight.year);
  const location = lastProg && lastProg.location;
  const metaParts = [];
  if (location) metaParts.push(location.toUpperCase());
  if (dateStr) metaParts.push(String(dateStr).toUpperCase());

  return (
    <div className="home-grid">
      <div>
        <div className="card">
          <h3>Upcoming Meets <a className="seeall" href={routeHref("/schedule")}>FULL SCHEDULE&nbsp;<Icon name="arrowRight" /></a></h3>
          {MEETS.map(m => (
            <div className="meet-row" key={m.date.m + m.date.d + m.name}>
              <div className="date"><span className="m">{m.date.m}</span><span className="d">{m.date.d}</span></div>
              <div className="info"><div className="nm">{m.name}</div><div className="loc">{m.loc}</div></div>
              <div className={"tag" + (m.tag === "HOME" ? " home" : "")}>{m.tag}</div>
            </div>
          ))}
        </div>
        <div className="quick-links">
          <a className="quick-link" href={routeHref("/records/boys-outdoor")}>
            <div className="lab">EXPLORE</div>
            <div className="nm">School Records</div>
            <div className="arrow"><Icon name="arrowRight" />&nbsp;INDOOR · OUTDOOR · STADIUM</div>
          </a>
          <a className="quick-link" href={routeHref("/results/piaa-champions")}>
            <div className="lab">EXPLORE</div>
            <div className="nm">PIAA &amp; WPIAL Results</div>
            <div className="arrow"><Icon name="arrowRight" />&nbsp;CHAMPIONS · PLACERS</div>
          </a>
          <a className="quick-link" href={routeHref("/gallery")}>
            <div className="lab">ARCHIVE</div>
            <div className="nm">Photos &amp; Videos</div>
            <div className="arrow"><Icon name="arrowRight" />&nbsp;VIEW GALLERY</div>
          </a>
          <a className="quick-link" href={routeHref("/learn/drills")}>
            <div className="lab">TRAINING</div>
            <div className="nm">Drills &amp; Inspiration</div>
            <div className="arrow"><Icon name="arrowRight" />&nbsp;HURDLES · LADDERS</div>
          </a>
        </div>
      </div>
      <div>
        {spotlight && (
          <div className="spotlight">
            <div className="eb">SCHOOL RECORD SPOTLIGHT</div>
            <h4>{spotlight.category} · {spotlight.event}</h4>
            <div className="athlete">{spotlight.athlete}</div>
            <div className="mark">{spotlight.mark}</div>
            {metaParts.length > 0 && (
              <div className="mark-meta">{metaParts.join(" · ")}</div>
            )}
          </div>
        )}
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 22, margin: "0 0 14px" }}>PIAA State Meet</h3>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--grey)" }}>
            <p style={{ margin: "0 0 12px" }}>
              Mustangs advance to the state championships at Shippensburg University by placing <strong>top 4 at the WPIAL Championships</strong> — or <strong>top 8</strong> with a mark that meets the PIAA qualifying standard.
            </p>
            <a className="standards-link" href={routeHref("/states")} style={{ color: "var(--plum)", fontWeight: 600, textDecoration: "none" }}>How to qualify &amp; standards&nbsp;<Icon name="arrowRight" /></a>
          </div>
        </div>
        <a href={routeHref("/coachi")} className="memorial-card">
          <div className="mc-eb">IN MEMORIAM</div>
          <h3>Coach I</h3>
          <div className="mc-name">Joseph “Coach I” Ionta</div>
          <div className="mc-years">35+ years · Plum Mustangs Track &amp; Cross Country</div>
          <div className="mc-quote">“Look at you!”</div>
          <div className="mc-cta">Read the tribute&nbsp;<Icon name="arrowRight" /></div>
        </a>
      </div>
    </div>
  );
}

