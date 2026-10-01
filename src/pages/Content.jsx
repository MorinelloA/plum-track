// === Photos/Videos, Roster, Schedule, Learn, Contact ===
import React from 'react';
import { PTF_DATA } from '../data/data.js';
import { PTF_PHOTOS } from '../data/photos.js';
import { PTF_ROSTERS, PTF_COACHING_STAFF } from '../data/rosters.js';
import { rootAsset, routeHref } from '../utils/paths.js';

const PHOTO_YEARS = Object.keys(PTF_PHOTOS || {}).map(Number).sort((a, b) => b - a);
const ROSTER_YEARS = Object.keys(PTF_ROSTERS || {}).filter(k => Number(k) > 2000).map(Number).sort((a, b) => b - a);

function YearPicker({ years, active, base }) {
  return (
    <div className="archive-yearrail" role="tablist" aria-label="Select season year">
      {years.map(y => (
        <a key={y} className={"archive-yr" + (y === active ? " active" : "")} href={routeHref(base + "/" + y)} role="tab" aria-selected={y === active}>
          <span className="y">{y}</span>
        </a>
      ))}
    </div>
  );
}

// === Photos / Videos ===
export function PhotosPage({ sub }) {
  const parsedSub = parseInt(sub);
  const year = (parsedSub && PHOTO_YEARS.includes(parsedSub)) ? parsedSub : PHOTO_YEARS[0];
  const allPhotos = (PTF_PHOTOS && PTF_PHOTOS[year]) || [];
  const [lightbox, setLightbox] = React.useState(null);

  // Close lightbox on Escape
  React.useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(i => Math.min(i + 1, allPhotos.length - 1));
      if (e.key === "ArrowLeft") setLightbox(i => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, allPhotos.length]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">VISUAL ARCHIVE · 2003 — 2016</div>
          <h1 className="page-title">Photos &amp; Videos</h1>
          <p className="page-subtitle">Season-by-season photography from Plum Mustangs Track &amp; Field.</p>
        </div>
      </div>
      <div className="social-callout">
        <div className="callout-eb">RECENT SEASONS</div>
        <div className="callout-body">
          <div className="callout-msg">For more recent photos &amp; videos, follow us on social media</div>
          <div className="callout-links">
            <a className="social-link" href="https://x.com/PlumMustangs" target="_blank" rel="noopener">
              <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <div className="social-text"><div className="handle">@PlumMustangs</div><div className="net">ON X</div></div>
            </a>
            <a className="social-link" href="https://instagram.com/plumhs_track_and_xc" target="_blank" rel="noopener">
              <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.069 1.646.069 4.849 0 3.205-.012 3.584-.069 4.849-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.645.069-4.85.069-3.204 0-3.584-.012-4.849-.069-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.647 2.163 15.268 2.163 12s.012-3.584.07-4.849c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.141 0-3.503.012-4.74.068-1.026.047-1.582.218-1.953.362-.49.19-.84.418-1.208.787-.369.368-.597.718-.787 1.208-.144.371-.315.927-.362 1.953-.056 1.237-.068 1.599-.068 4.74s.012 3.503.068 4.74c.047 1.026.218 1.582.362 1.953.19.49.418.84.787 1.208.368.369.718.597 1.208.787.371.144.927.315 1.953.362 1.237.056 1.599.068 4.74.068s3.503-.012 4.74-.068c1.026-.047 1.582-.218 1.953-.362.49-.19.84-.418 1.208-.787.369-.368.597-.718.787-1.208.144-.371.315-.927.362-1.953.056-1.237.068-1.599.068-4.74s-.012-3.503-.068-4.74c-.047-1.026-.218-1.582-.362-1.953-.19-.49-.418-.84-.787-1.208-.368-.369-.718-.597-1.208-.787-.371-.144-.927-.315-1.953-.362-1.237-.056-1.599-.068-4.74-.068zm0 3.063A4.972 4.972 0 1 1 7.028 12 4.978 4.978 0 0 1 12 7.028zm0 8.203A3.231 3.231 0 1 0 8.769 12 3.235 3.235 0 0 0 12 15.231zm6.406-8.397a1.163 1.163 0 1 1-1.163-1.163 1.163 1.163 0 0 1 1.163 1.163z"/></svg>
              <div className="social-text"><div className="handle">@plumhs_track_and_xc</div><div className="net">ON INSTAGRAM</div></div>
            </a>
          </div>
        </div>
      </div>
      <YearPicker years={PHOTO_YEARS} active={year} base="/gallery" />
      <div className="year-banner">
        <div>
          <div className="yrbig">{year}</div>
          <div className="yrlabel">SEASON ARCHIVE</div>
        </div>
        <div className="yrstats">
          <div className="stat"><div className="num">{allPhotos.length}</div><div className="lbl">PHOTOS</div></div>
        </div>
      </div>

      {allPhotos.length === 0 && (
        <div className="archive-empty" style={{padding: "48px 0", textAlign: "center", color: "var(--grey)"}}>
          No photos on file for this season.
        </div>
      )}

      <div className="photo-grid">
        {allPhotos.map((filename, i) => (
          <button
            key={filename}
            className="photo-card real-photo"
            onClick={() => setLightbox(i)}
            style={{padding: 0, border: "none", cursor: "pointer", background: "none"}}
          >
            <img
              src={rootAsset("photos/" + year + "/" + filename)}
              alt={"Photo " + (i + 1) + " from " + year + " season"}
              loading="lazy"
              style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}}
            />
            <div className="corner">{String(i + 1).padStart(3, "0")}</div>
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="photo-lightbox"
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, cursor: "zoom-out"
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(i => Math.max(i - 1, 0)); }}
            disabled={lightbox === 0}
            style={{position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: 32, width: 52, height: 52, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: lightbox === 0 ? 0.3 : 1}}
          >‹</button>
          <img
            src={rootAsset("photos/" + year + "/" + allPhotos[lightbox])}
            alt={"Photo " + (lightbox + 1)}
            onClick={(e) => e.stopPropagation()}
            style={{maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", boxShadow: "0 8px 48px rgba(0,0,0,0.6)"}}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(i => Math.min(i + 1, allPhotos.length - 1)); }}
            disabled={lightbox === allPhotos.length - 1}
            style={{position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: 32, width: 52, height: 52, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: lightbox === allPhotos.length - 1 ? 0.3 : 1}}
          >›</button>
          <div style={{position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.6)", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.1em"}}>
            {lightbox + 1} / {allPhotos.length} · ESC TO CLOSE
          </div>
        </div>
      )}
    </div>
  );
}


// === Roster ===
export function RosterPage({ sub }) {
  const year = parseInt(sub) || ROSTER_YEARS[0];
  
  // Get actual roster data for this year, or empty if not yet entered
  const yearData = PTF_ROSTERS?.[year];
  
  // Map class structure to grade for display
  const classGrades = { seniors: "SR", juniors: "JR", sophomores: "SO", freshmen: "FR" };
  
  // Build athletes list from actual data
  let allAthletes = [];
  if (yearData) {
    Object.entries(classGrades).forEach(([classKey, grade]) => {
      const classData = yearData[classKey];
      if (classData) {
        (classData.boys || []).forEach(name => {
          allAthletes.push({ name, gender: "M", grade });
        });
        (classData.girls || []).forEach(name => {
          allAthletes.push({ name, gender: "F", grade });
        });
      }
    });
  }
  
  const boys = allAthletes.filter(p => p.gender === "M");
  const girls = allAthletes.filter(p => p.gender === "F");
  const picks = allAthletes;
  
  // Calculate graduation year based on grade
  const getGraduationYear = (grade) => {
    const offset = { SR: 0, JR: 1, SO: 2, FR: 3 };
    return year + offset[grade];
  };

  const renderSquad = (squad) => {
    const classOrder = [
      { grade: "SR", label: "Seniors" },
      { grade: "JR", label: "Juniors" },
      { grade: "SO", label: "Sophomores" },
      { grade: "FR", label: "Freshmen" }
    ];
    return (
      <React.Fragment>
        {classOrder.map(({ grade, label }) => {
          const classAthletes = squad.filter(p => p.grade === grade);
          if (classAthletes.length === 0) return null;
          return (
            <div className="class-group" key={grade}>
              <div className="class-subheader">
                <div className="class-meta">
                  <span className="class-eyebrow">CLASS OF {getGraduationYear(grade)}</span>
                  <h3 className="class-name">{label}</h3>
                </div>
                <span className="class-count">{classAthletes.length} {classAthletes.length === 1 ? "ATHLETE" : "ATHLETES"}</span>
              </div>
              <div className="roster-grid">
                {classAthletes.map((p, i) => (
                  <div className="roster-card" key={i}>
                    <div className="grad-badge">
                      <div className="grad-lbl">CLASS OF</div>
                      <div className="grad-yr">{getGraduationYear(p.grade)}</div>
                    </div>
                    <div>
                      <div className="nm">{p.name}</div>
                      <div className="meta">{p.grade === "FR" ? "FRESHMAN" : p.grade === "SO" ? "SOPHOMORE" : p.grade === "JR" ? "JUNIOR" : "SENIOR"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </React.Fragment>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">TEAM ROSTERS</div>
          <h1 className="page-title">Roster</h1>
          <p className="page-subtitle">Year-by-year team members.</p>
        </div>
      </div>
      <YearPicker years={ROSTER_YEARS} active={year} base="/roster" />
      <div className="year-banner">
        <div>
          <div className="yrbig">{year}</div>
          <div className="yrlabel">TEAM ROSTER</div>
        </div>
        <div className="yrstats">
          <div className="stat"><div className="num">{picks.length}</div><div className="lbl">ATHLETES</div></div>
          <div className="stat"><div className="num">{boys.length}</div><div className="lbl">BOYS</div></div>
          <div className="stat"><div className="num">{girls.length}</div><div className="lbl">GIRLS</div></div>
        </div>
      </div>
      {PTF_COACHING_STAFF?.[year] && (
        <div className="roster-coaches">
          {PTF_COACHING_STAFF[year].map((coach, i) => (
            <div className="coach-card" key={i}>
              <div className="role">{coach.role.toUpperCase()}</div>
              <div className="nm">{coach.name}</div>
            </div>
          ))}
        </div>
      )}

      <div className="squad-header">
        <span className="bar"></span>
        <h2>Boys</h2>
        <span className="count">{boys.length} ATHLETES</span>
      </div>
      {renderSquad(boys)}

      <div className="squad-header">
        <span className="bar"></span>
        <h2>Girls</h2>
        <span className="count">{girls.length} ATHLETES</span>
      </div>
      {renderSquad(girls)}
    </div>
  );
}


// === Schedule ===
export function SchedulePage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">SPRING 2026 · TRACK SCHEDULE</div>
          <h1 className="page-title">Schedule</h1>
          <p className="page-subtitle">All home meets are at Plum Senior High School. Schedule is subject to change</p>
        </div>
      </div>
      {PTF_DATA.scheduleByMonth.map(month => (
        <div className="schedule-month" key={month.month}>
          <div className="mhead">{month.month}</div>
          <table className="data-table" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th style={{width: 90}}>Date</th>
                <th style={{width: "45%"}}>Meet</th>
                <th>Location</th>
                <th style={{width: 110, textAlign: "right"}}>Type</th>
              </tr>
            </thead>
            <tbody>
              {month.meets.map((m, i) => (
                <tr key={i}>
                  <td>
                    <span style={{ fontFamily: "var(--display)", fontSize: 22, color: "var(--plum-deep)" }}>{m.d}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, marginLeft: 8, letterSpacing: "0.15em", color: "var(--grey)" }}>{m.day}</span>
                  </td>
                  <td className="event-name">{m.name}</td>
                  <td><span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--grey)", letterSpacing: "0.08em" }}>{m.loc.toUpperCase()}</span></td>
                  <td style={{ textAlign: "right" }}>
                    <span className={"tag" + (m.tag === "HOME" ? " home" : "")} style={{ display: "inline-block", fontFamily: "var(--mono)", fontSize: 10, padding: "4px 8px", letterSpacing: "0.15em", border: "1px solid var(--line)", background: m.tag === "HOME" ? "var(--gold)" : "transparent", color: m.tag === "HOME" ? "var(--plum-deep)" : "var(--grey)" }}>
                      {m.tag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}


// === Forms ===
export function FormsPage({ sub }) {
  const items = {
    registration: { eyebrow: "ATHLETE ONBOARDING", title: "Registration" },
    physicals: { eyebrow: "ATHLETE ONBOARDING", title: "Physicals" }
  };
  const info = items[sub] || items.registration;
  return (
    <div className="page page-narrow">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">{info.eyebrow}</div>
          <h1 className="page-title">{info.title}</h1>
          <p className="page-subtitle">Coming soon. Details for this form will be posted here.</p>
        </div>
      </div>
    </div>
  );
}


// === Contact ===
const CONTACT_FORM_ENDPOINT = "https://formspree.io/f/mvzylrjd";

export function ContactPage() {
  const c = PTF_DATA.contact;
  const [status, setStatus] = React.useState("idle");
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (CONTACT_FORM_ENDPOINT.includes("YOUR_FORM_ID")) {
      setStatus("error");
      setMessage("This form needs a Formspree endpoint before messages can be sent.");
      return;
    }

    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();
      setStatus("success");
      setMessage("Thanks. Your message has been sent to morinelloa@gmail.com.");
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong while sending your message. Please try again or email morinelloa@gmail.com directly.");
    }
  };

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">REACH OUT</div>
          <h1 className="page-title">Contact</h1>
          <p className="page-subtitle">Reach the coaching staff with questions about practice, eligibility, transportation, or alumni records.</p>
        </div>
      </div>
      <div className="contact-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" placeholder="Your full name" required />

          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="you@example.com" required />

          <label htmlFor="contact-reason">Reason for Contact</label>
          <select id="contact-reason" name="reason" required>
            <option>General inquiry</option>
            <option>Prospective athlete / parent</option>
            <option>Alumni — submit a correction</option>
            <option>Media / photography</option>
            <option>Officiating / coaching / volunteering</option>
          </select>

          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" rows={6} placeholder="How can we help?" required></textarea>

          <input type="hidden" name="_subject" value="New Plum Track contact form message" />
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
          {message && (
            <div className={"contact-status " + (status === "success" ? "success" : "error")} role="status">
              {message}
            </div>
          )}
        </form>
        <div className="contact-info">
          <div className="ci-eyebrow">DIRECT CONTACT</div>
          <h3>Coaching Staff</h3>
          <div className="coach-stack">
            <div className="coach-block">
              <div className="cb-role">Head Coach</div>
              <div className="cb-disc">Track &amp; Field</div>
              <div className="cb-name">Matt Proskin</div>
              <a className="cb-email" href="mailto:proskinm@pbsd.net">
                <span className="cb-at">@</span>
                <span>proskinm@pbsd.net</span>
              </a>
            </div>
            <div className="coach-block">
              <div className="cb-role">Head Coach</div>
              <div className="cb-disc">Cross Country</div>
              <div className="cb-name">Brent Kennedy</div>
              <a className="cb-email" href="mailto:kennedyb@pbsd.net">
                <span className="cb-at">@</span>
                <span>kennedyb@pbsd.net</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// === PIAA State Meet qualification (Plum is 3A) ===
const PIAA_QUAL_RUNNING = [
  { event: "4×800 m Relay",               girls: "9:35.48",  boys: "8:00.50" },
  { event: "100 m Hurdles (Girls, 33\")", girls: "15.40",    boys: "—" },
  { event: "110 m Hurdles (Boys, 39\")",  girls: "—",        boys: "15.07" },
  { event: "100 m Dash",                  girls: "12.50",    boys: "10.95" },
  { event: "1600 m Run",                  girls: "5:06.00",  boys: "4:19.00" },
  { event: "4×100 m Relay",               girls: "48.73",    boys: "42.88" },
  { event: "400 m Dash",                  girls: "57.38",    boys: "49.39" },
  { event: "300 m Hurdles (Girls 30\" / Boys 36\")", girls: "45.61", boys: "39.80" },
  { event: "800 m Run",                   girls: "2:16.87",  boys: "1:56.50" },
  { event: "200 m Dash",                  girls: "25.46",    boys: "21.99" },
  { event: "3200 m Run",                  girls: "11:01.42", boys: "9:26.00" },
  { event: "4×400 m Relay",               girls: "4:00.50",  boys: "3:21.04" },
];

const PIAA_QUAL_FIELD = [
  { event: "High Jump",     girls: "5-3",   boys: "6-5" },
  { event: "Pole Vault",    girls: "11-6",  boys: "14-3" },
  { event: "Long Jump",     girls: "17-9",  boys: "22-3" },
  { event: "Triple Jump",   girls: "36-11", boys: "45-0" },
  { event: "Shot Put",      girls: "37-6",  boys: "52-0" },
  { event: "Discus Throw",  girls: "120-1", boys: "153-0" },
  { event: "Javelin Throw", girls: "125-3", boys: "178-0" },
];

const PIAA_QUAL_PV_MIN = { girls: "9-6", boys: "12-3" };

export function StatesPage() {
  const renderTable = (rows) => (
    <table className="data-table" style={{ tableLayout: "fixed" }}>
      <thead>
        <tr>
          <th>Event</th>
          <th style={{ textAlign: "right" }}>Girls</th>
          <th style={{ textAlign: "right" }}>Boys</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="event-name">{r.event}</td>
            <td style={{ textAlign: "right", fontFamily: "var(--mono)" }}>{r.girls}</td>
            <td style={{ textAlign: "right", fontFamily: "var(--mono)" }}>{r.boys}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">PIAA TRACK &amp; FIELD CHAMPIONSHIPS</div>
          <h1 className="page-title">Qualifying for States</h1>
          <p className="page-subtitle">How Mustangs advance to the PIAA State Meet at Shippensburg University.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>How to Qualify</h3>
        <p style={{ margin: "0 0 10px" }}>
          An athlete or relay team qualifies for the state meet in one of two ways:
        </p>
        <ol style={{ margin: "0 0 10px 20px", lineHeight: 1.6 }}>
          <li><strong>Finish in the top 4</strong> at the WPIAL Championships in their event.</li>
          <li><strong>Finish in the top 8</strong> at the WPIAL Championships with a mark that meets or beats the qualifying standard listed below.</li>
        </ol>
        <p style={{ margin: 0, fontSize: 13, color: "var(--grey)" }}>
          Pole vaulters must also clear a minimum height at the WPIAL meet to advance —
          {" "}Boys: {PIAA_QUAL_PV_MIN.boys}, Girls: {PIAA_QUAL_PV_MIN.girls}.
        </p>
      </div>

      <h3>Running Events</h3>
      {renderTable(PIAA_QUAL_RUNNING)}

      <h3 style={{ marginTop: 28 }}>Field Events</h3>
      {renderTable(PIAA_QUAL_FIELD)}

      <p style={{ fontSize: 12, color: "var(--grey)", marginTop: 20 }}>
        Standards reflect the 2025–2026 PIAA Rules &amp; Regulations.
        {" "}<a href="https://www.piaa.org/assets/web/documents/Handbook%20-%20Section%20III%20-%20Rules%20and%20Regulations.pdf" target="_blank" rel="noopener" style={{ color: "var(--plum)" }}>View the official PIAA handbook →</a>
      </p>
    </div>
  );
}


// === Coach I tribute ===
const COACH_I_PHOTOS = [
  "coach&diane.jpg",
  "pa240040.jpg",
  "dsc00046.jpg",
  "IMG_3507.JPG",
  "IMG_0282.JPG",
  "tent.jpg",
  "coachionta.JPG",
  "gate8.JPG",
  "p9090002.jpg",
  "p9240018.jpg",
  "p9050042.jpg",
  "p8310018.jpg",
  "img_0330.jpg",
  "img_0352.jpg",
  "img_1752.jpg",
  "dsc00207.jpg",
  "dsc_0023.jpg",
  "p1010133.jpg"
];

export function CoachIPage() {
  return (
    <div className="coachi-page">
      <section className="coachi-hero">
        <div className="coachi-hero-inner">
          <div className="coachi-hero-eb">IN MEMORIAM</div>
          <h1>Coach I</h1>
          <div className="coachi-hero-sub">Joseph "Coach I" Ionta · 1953 - 2025</div>
          <div className="coachi-hero-tag">Plum Mustangs Track &amp; Field · Cross Country</div>
          <div className="coachi-hero-cta">
            <a className="give-btn" href={routeHref("/donate")}>Donate to the scholarship →</a>
          </div>
        </div>
      </section>

      <div className="coachi-body">
        <section className="coachi-video" aria-labelledby="coachi-video-title">
          <div className="cv-eb">VIDEO TRIBUTE</div>
          <h2 id="coachi-video-title">Remembering Coach I</h2>
          <iframe
            className="cv-player"
            src="https://www.youtube.com/embed/sbVVh4Ivh18?playsinline=1&rel=0"
            title="Remembering Coach I — YouTube video tribute"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </section>

        <section className="coachi-section">
          <h2>Our Coach</h2>
          <p className="lede">
            Joseph "Coach I" Ionta began coaching at Plum in 1979. For more than 35 years,
            he coached generations of Mustangs in track and field and cross country.
            He passed away in 2025 at the age of 71.
          </p>
          <p>
            We remember the nicknames, the practices, and the help he gave his athletes.
            These photos and stories are a way to remember him and say thank you.
          </p>
        </section>

        {COACH_I_PHOTOS.length > 0 && (
          <section className="coachi-gallery">
            {COACH_I_PHOTOS.slice(0, 6).map((p, i) => (
              <figure key={i} className={"cg-tile cg-" + i}>
                <img src={rootAsset("photos/coachi/" + p)} alt="Coach Ionta" loading="lazy" decoding="async" />
              </figure>
            ))}
          </section>
        )}

        <section className="coachi-section">
          <h2>Teaching and Coaching at Plum</h2>
          <p>
            Coach I graduated from Lincoln High School in Ellwood City and attended
            Grove City College before coming to Plum. He spent his teaching career here,
            retiring from the classroom in 2012. He kept coaching after retirement.
          </p>
          <p>
            He served as head coach for most of his years with the Mustangs. During his
            time with the track and field program, more than 60 boys earned WPIAL medals
            and 25 qualified for the PIAA state championships. The girls earned more than
            20 WPIAL medals, with 12 state qualifiers. In cross country, 12 boys and three
            girls qualified individually for states, and the boys also qualified as a
            team once.
          </p>
          <p>
            His teams won five section titles in boys track, three in girls cross country,
            and one in boys cross country. The <em>Valley News Dispatch</em> named him
            Cross Country Coach of the Year in 2001.
          </p>
        </section>

        <figure className="coachi-trophy">
          <img src="/photos/coachi/pa050039.jpg" alt="Coach I leaning on a car with three running trophies" loading="lazy" decoding="async" />
          <figcaption>
            <span className="ct-eb">PLUM TRACK &amp; CROSS COUNTRY</span>
            Coach I with three of his running trophies.
          </figcaption>
        </figure>

        <section className="coachi-stats">
          <div className="cs-stat"><div className="num">35+</div><div className="lbl">YEARS COACHING</div></div>
          <div className="cs-stat"><div className="num">80+</div><div className="lbl">WPIAL MEDALISTS</div></div>
          <div className="cs-stat"><div className="num">37</div><div className="lbl">TRACK STATE QUALIFIERS</div></div>
          <div className="cs-stat"><div className="num">$270K+</div><div className="lbl">RAISED FOR CANCER RESEARCH</div></div>
        </section>

        <section className="coachi-section">
          <h2>The Coach We Remember</h2>
          <p>
            If you ran for Coach I, you probably remember your nickname. Every kid who
            came through the program got one. When the team budget fell short, he bought
            equipment out of his own pocket, from spikes to vaulting poles. He wanted his
            athletes to have what they needed to compete.
          </p>
          <p>
            He made room for the freshman trying running for the first time and challenged
            the senior chasing a state medal. He expected his athletes to work hard on the
            track and to be good students and teammates, too.
          </p>
        </section>

        {COACH_I_PHOTOS.length > 6 && (
          <section className="coachi-strip">
            {COACH_I_PHOTOS.slice(6, 12).map((p, i) => (
              <figure key={i} className="cs-tile">
                <img src={rootAsset("photos/coachi/" + p)} alt="Coach Ionta with the team" loading="lazy" decoding="async" />
              </figure>
            ))}
          </section>
        )}

        <section className="coachi-section">
          <h2>Stampede in the Park</h2>
          <p>
            In 2007, Coach I was diagnosed with chronic lymphocytic leukemia. That same
            year, he founded <strong>Stampede in the Park</strong>, a 5K and one-mile fun
            run held each July at Boyce Park. Proceeds supported acute leukemia and
            lymphoma research at UPMC Hillman Cancer Center.
          </p>
          <p>
            He organized the Stampede for more than a decade, with help from alumni,
            current runners, families, and volunteers. Together, they raised more than
            $270,000 for cancer research. The race gave the Plum running community a
            reason to get together each summer and support a cause close to him.
          </p>
        </section>

        <section className="coachi-section coachi-tree" aria-labelledby="coachi-tree-title">
          <div>
            <h2 id="coachi-tree-title">A Tree at Boyce Park</h2>
            <p>
              The Plum Boosters planted a northern red oak at Boyce Park in honor of
              Coach I and Coach Max. Dedicated on May 10, 2020, it stands in the park
              where Plum’s cross country team practices and competes.
            </p>
          </div>
          <div className="coachi-tree-photos">
            <a href={rootAsset("photos/coachi/boyce-park-tree.jpeg")} target="_blank" rel="noopener noreferrer" aria-label="View the tree at Boyce Park (opens in a new tab)">
              <img src={rootAsset("photos/coachi/boyce-park-tree.jpeg")} alt="Northern red oak at Boyce Park with its dedication plaque" width="960" height="1261" loading="lazy" decoding="async" />
            </a>
            <a href={rootAsset("photos/coachi/boyce-park-tree-dedication.jpeg")} target="_blank" rel="noopener noreferrer" aria-label="View the tree dedication plaque (opens in a new tab)">
              <img src={rootAsset("photos/coachi/boyce-park-tree-dedication.jpeg")} alt="Plaque dedicated to Coach I and Coach Max on May 10, 2020, with love from the 2019–2020 Plum Running Mustangs" width="960" height="2079" loading="lazy" decoding="async" />
            </a>
          </div>
        </section>

        <section className="coachi-section coachi-thanks">
          <h2>Thank You, Coach</h2>
          <p>
            Thank you, Coach I, for the time you gave us, the patience at practice, and
            the bus rides and nicknames we still remember. You expected a lot from your
            athletes, and you gave a lot in return.
          </p>
          <p>
            We’re grateful for the years you spent with us. We miss you, Coach.
          </p>
        </section>

        <section className="coachi-give" aria-labelledby="coachi-give-title">
          <div className="give-eb">Joseph Ionta “Coach I” Memorial Scholarship</div>
          <h2 id="coachi-give-title">Support His Memorial Scholarship</h2>
          <p>
            The Joseph Ionta “Coach I” Memorial Scholarship honors his years at Plum.
            If you’d like to give in his memory, you can contribute below.
          </p>
          <a className="give-btn" href={routeHref("/donate")}>Donate to the scholarship →</a>
        </section>

        <section className="coachi-finale">
          <div className="cf-eb">— COACH I —</div>
          <div className="cf-quote">LOOK AT YOU!</div>
        </section>
      </div>
    </div>
  );
}

