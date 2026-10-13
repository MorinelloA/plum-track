// === Coach I Memorial Scholarship — Zeffy donation form, home band, /donate page ===
import React from 'react';
import { routeHref } from '../utils/paths.js';
import { Icon } from '../components/Icon.jsx';

const ZEFFY_FORM_PATH = "/embed/donation-form/donate-to-coach-joe-i-ionta-memorial-scholarship";
const ZEFFY_FORM_URL = "https://www.zeffy.com" + ZEFFY_FORM_PATH;
const ZEFFY_PAGE_URL = "https://www.zeffy.com/en-US/donation-form/donate-to-coach-joe-i-ionta-memorial-scholarship";
const ZEFFY_SCRIPT_SRC = "https://www.zeffy.com/embed/v2/zeffy-embed.js";
const ZEFFY_TIMEOUT_MS = 8000;

// Zeffy's script scans the page once when it runs, then exposes Zeffy.embed.init() to scan again.
// Load it once per visit; later mounts (client-side navigation back to /donate) call init() instead.
let zeffyScript = null;
function loadZeffyEmbed() {
  if (window.Zeffy?.embed) return Promise.resolve(window.Zeffy.embed);
  if (!zeffyScript) {
    zeffyScript = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = ZEFFY_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve(window.Zeffy?.embed);
      script.onerror = () => {
        script.remove();
        zeffyScript = null;
        reject(new Error("Zeffy embed script failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return zeffyScript;
}

export function ZeffyDonationForm() {
  const hostRef = React.useRef(null);
  const [status, setStatus] = React.useState("loading");

  React.useEffect(() => {
    const host = hostRef.current;

    // Zeffy fills this element with its own iframe, so it lives outside React's tree.
    const slot = document.createElement("div");
    slot.setAttribute("data-zeffy-embed", "");
    slot.setAttribute("data-form-url", ZEFFY_FORM_PATH);
    host.appendChild(slot);

    let settled = false;
    const observer = new MutationObserver(() => {
      if (host.querySelector("iframe")) settle("ready");
    });
    const timer = setTimeout(() => settle("fallback"), ZEFFY_TIMEOUT_MS);
    function settle(next) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      observer.disconnect();
      // Empty the slot so a late Zeffy render can't stack a second form on top of the fallback.
      if (next === "fallback") host.replaceChildren();
      setStatus(next);
    }
    observer.observe(host, { childList: true, subtree: true });

    loadZeffyEmbed()
      .then((embed) => { if (!settled && embed) embed.init(); })
      .catch(() => settle("fallback"));

    return () => {
      settled = true;
      clearTimeout(timer);
      observer.disconnect();
      host.replaceChildren();
    };
  }, []);

  return (
    <div className="zeffy-embed">
      {status === "loading" && (
        <div className="zeffy-loading" role="status">Loading the donation form…</div>
      )}
      <div ref={hostRef} className="zeffy-host" hidden={status === "fallback"} />
      {status === "fallback" && (
        <div className="zeffy-fallback">
          <iframe
            title="Donation form powered by Zeffy"
            src={ZEFFY_FORM_URL}
            allow="payment"
            allowpaymentrequest="true"
            allowtransparency="true"
          />
        </div>
      )}
    </div>
  );
}

// Home page call-to-action, directly under the hero.
export function ScholarshipBand() {
  return (
    <section className="scholarship-band" aria-labelledby="scholarship-band-title">
      <div className="sb-inner">
        <figure className="sb-photo">
          <img src="/photos/coachi/1.jpg" alt="Coach Joseph Ionta" decoding="async" />
        </figure>
        <div className="sb-head">
          <div className="sb-eb">IN MEMORY OF COACH I</div>
          <h2 id="scholarship-band-title">Joseph Ionta “Coach I”<br /><span>Memorial Scholarship</span></h2>
        </div>
        <p className="sb-text">He gave Plum more than 35 years. Give something back in his name.</p>
        <div className="sb-actions">
          <a className="give-btn" href={routeHref("/donate")}>Donate now&nbsp;<Icon name="arrowRight" /></a>
          <a className="sb-link" href={routeHref("/coachi")}>Read his story&nbsp;<Icon name="arrowRight" /></a>
        </div>
      </div>
    </section>
  );
}

export function DonatePage() {
  return (
    <div className="donate-page">
      <section className="coachi-hero">
        <div className="coachi-hero-inner">
          <div className="coachi-hero-eb">IN MEMORY OF COACH I</div>
          <h1>Donate</h1>
          <div className="coachi-hero-sub">Joseph Ionta “Coach I” Memorial Scholarship</div>
          <div className="coachi-hero-tag">Plum Mustangs Track &amp; Field · Cross Country</div>
        </div>
      </section>

      <div className="donate-body">
        <section className="donate-form" aria-label="Donation form">
          <div className="donate-eb">MAKE A GIFT</div>
          <ZeffyDonationForm />
          <p className="donate-note">
            Payments are handled by Zeffy. Form not loading?{" "}
            <a href={ZEFFY_PAGE_URL} target="_blank" rel="noopener">Open it on Zeffy&nbsp;<Icon name="external" /></a>
          </p>
        </section>

        <aside className="donate-story">
          <figure className="donate-photo">
            <img src="/photos/coachi/coachionta.JPG" alt="Coach I talking with his runners under a park pavilion" loading="lazy" decoding="async" />
          </figure>
          <div className="donate-eb">WHY GIVE</div>
          <h2>He Showed Up for Plum</h2>
          <p>
            For more than 35 years, Coach I coached Plum’s track and cross country
            teams. Every kid who came through got a nickname. When the budget couldn’t
            cover spikes or a vaulting pole, he bought them himself.
          </p>
          <p>Now a scholarship carries his name. Give what you can.</p>
          <a className="donate-tribute-link" href={routeHref("/coachi")}>Read the full tribute&nbsp;<Icon name="arrowRight" /></a>
        </aside>
      </div>
    </div>
  );
}
