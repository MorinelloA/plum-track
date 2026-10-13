// === Records pages with drill-down progression timeline ===
import React from 'react';
import { PTF_RECORDS } from '../data/records.js';
import { rootAsset, routeHref } from '../utils/paths.js';
import { useModalDialog } from '../utils/useModalDialog.js';
import { Icon } from '../components/Icon.jsx';

const RECORDS = PTF_RECORDS;

// Format year/date values for display.
// "1975" -> "1975"
// "2026-05-14" -> "May 14, 2026"
// "4-8-2026" -> "Apr 8, 2026"
function formatYr(yr) {
  if (yr == null) return "";
  const s = String(yr).trim();
  if (/^\d{4}$/.test(s)) return s;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return months[parseInt(m[2], 10) - 1] + " " + parseInt(m[3], 10) + ", " + m[1];
  m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (m) return months[parseInt(m[1], 10) - 1] + " " + parseInt(m[2], 10) + ", " + m[3];
  return s;
}
// Extract just the 4-digit year for compact display in tables.
function yearOnly(yr) {
  if (yr == null) return "";
  const s = String(yr).trim();
  const m = s.match(/(\d{4})/);
  return m ? m[1] : s;
}

// Relay rows on the records table show last names only; progressions keep full names.
function lastNamesOnly(athlete) {
  if (!athlete) return "";
  return athlete.split(",").map(part => {
    const tokens = part.trim().split(/\s+/);
    return tokens[tokens.length - 1];
  }).join(", ");
}

function recordTableAthlete(event, athlete) {
  return event && event.includes("Relay") ? lastNamesOnly(athlete) : athlete;
}

// Build a name -> photo path map by scanning every record + progression entry.
// Whenever an athlete's name is rendered anywhere in the records UI, we look
// them up here and make the name clickable if we have a portrait on file.
const ATHLETE_PHOTOS = (function () {
  const map = {};
  const sections = [
    "boysIndoor", "boysOutdoor", "boysStadium",
    "girlsIndoor", "girlsOutdoor", "girlsStadium",
    "jrBoys", "jrGirls"
  ];
  sections.forEach(s => {
    (RECORDS[s] || []).forEach(r => {
      if (r.photo) map[r.athlete] = r.photo;
      (r.progression || []).forEach(p => {
        if (p.photo) map[p.athlete] = p.photo;
      });
    });
  });
  Object.assign(map, {
    "Terry Meehan": "photos/athletes/terry-meehan.png",
    "Karen Fulmer": "photos/athletes/karen-fulmer.png",
    "Peggy Evans": "photos/athletes/peggy-evans.png",
    "Jon Grubs": "photos/athletes/jon-grubs.jpg",
    "Tiffany Tedesco": "photos/athletes/tiffany-tedesco.jpg",
    "Jill Nixon": "photos/athletes/jill-nixon.png",
    "Greg Bacon": "photos/athletes/greg-bacon.png",
    "Luke Linhart": "photos/athletes/luke-linhart.png"
  });
  return map;
})();

const RECORD_TABS = [
  { id: "boys-indoor", title: "Boys Indoor", data: "boysIndoor", group: "Boys" },
  { id: "boys-outdoor", title: "Boys Outdoor", data: "boysOutdoor", group: "Boys" },
  { id: "boys-stadium", title: "Boys Stadium", data: "boysStadium", group: "Boys" },
  { id: "girls-indoor", title: "Girls Indoor", data: "girlsIndoor", group: "Girls" },
  { id: "girls-outdoor", title: "Girls Outdoor", data: "girlsOutdoor", group: "Girls" },
  { id: "girls-stadium", title: "Girls Stadium", data: "girlsStadium", group: "Girls" }
];

// Shrinks its child's font size from `max` down to `min` (px) just enough to
// keep the content on one line. If even `min` is too big for the available
// width, falls back to letting the text wrap onto multiple lines (better than
// clipping or overflowing the container). Used for relay names in the
// progression view — single-athlete names already fit at `max` so they don't
// shrink at all.
function FitText({ children, max, min, className, wrapOnMobile = false }) {
  const wrapRef = React.useRef(null);
  const innerRef = React.useRef(null);
  React.useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    let lastWidth = -1;
    const fit = () => {
      const avail = wrap.clientWidth;
      if (!avail) return;
      if (wrapOnMobile && window.matchMedia('(max-width: 1024px)').matches) {
        Object.assign(inner.style, { display: 'block', width: '100%', whiteSpace: 'normal', fontSize: max + 'px' });
        return;
      }
      // Reset to single-line measurement mode: inline-block + nowrap lets us
      // read the natural content width via offsetWidth.
      inner.style.display = "inline-block";
      inner.style.whiteSpace = "nowrap";
      inner.style.width = "";
      let size = max;
      inner.style.fontSize = size + "px";
      while (inner.offsetWidth > avail && size > min) {
        size -= 1;
        inner.style.fontSize = size + "px";
      }
      // Still too wide at min — allow wrapping so we never clip or overflow.
      // Switching to block + 100% width forces the text to wrap inside the wrap.
      if (inner.offsetWidth > avail) {
        inner.style.display = "block";
        inner.style.width = "100%";
        inner.style.whiteSpace = "normal";
      }
    };
    fit();
    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth;
      if (w !== lastWidth) {
        lastWidth = w;
        fit();
      }
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  });
  return (
    <div ref={wrapRef} className={className} style={{ overflow: "hidden", minWidth: 0 }}>
      <span ref={innerRef} style={{ display: "inline-block" }}>
        {children}
      </span>
    </div>
  );
}

// Renders an athlete's name. If we have a portrait on file, the name becomes
// a clickable link that fires onMedia with a photo payload.
function AthleteName({ name, displayName, onMedia, subtitle, className }) {
  const shown = displayName != null ? displayName : name;
  const photo = name && ATHLETE_PHOTOS[name];
  if (!photo || !onMedia) {
    return <span className={className}>{shown}</span>;
  }
  return (
    <button
      type="button"
      className={"athlete-link " + (className || "")}
      onClick={(e) => {
        e.stopPropagation();
        onMedia({ type: "photo", src: photo, name, subtitle });
      }}
      title={"View photo of " + name}
    >
      <span className="athlete-link-text">{shown}</span>
      <span className="athlete-link-ic" aria-hidden="true"><Icon name="photo" /></span>
    </button>
  );
}

// Lightbox shown when a name or video card is clicked. Handles both photos
// and video placeholders.
export function MediaLightbox({ media, onClose }) {
  const dialogRef = useModalDialog(!!media, onClose);
  if (!media) return null;
  const mediaSrc = rootAsset(media.src);
  return (
    <div className="media-overlay" ref={dialogRef} role="dialog" aria-modal="true" aria-label={media.type === "photo" ? "Athlete photo" : "Performance video"} tabIndex={-1} onClick={onClose}>
      <button className="media-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
      <div className="media-stage" onClick={(e) => e.stopPropagation()}>
        {media.type === "photo" ? (
          <img className="media-photo" src={mediaSrc} alt={media.name || ""} />
        ) : mediaSrc ? (
          <video className="media-video-player" src={mediaSrc} controls preload="metadata" playsInline />
        ) : (
          <div className="media-video">
            <div className="mv-stripes" aria-hidden="true"></div>
            <div className="mv-play" aria-hidden="true"><Icon name="play" /></div>
            <div className="mv-label">VIDEO PLACEHOLDER</div>
            <div className="mv-sub">Drop the {media.mark || "performance"} clip{media.subtitle ? " from " + media.subtitle : ""} here.</div>
          </div>
        )}
        <div className="media-caption">
          <div className="mc-name">{media.name}</div>
          {media.subtitle && <div className="mc-sub">{media.subtitle}</div>}
        </div>
      </div>
    </div>
  );
}

function RecordTimeline({ record, onClose, onMedia }) {
  const dialogRef = useModalDialog(!!record, onClose);
  if (!record) return null;
  const prog = record.progression || [
    { yr: record.year, mark: record.mark, athlete: record.athlete, location: record.location, video: record.video }
  ];
  const last = prog[prog.length - 1] || {};
  const curAthlete = last.athlete || record.athlete;
  const curPhoto = record.photo || ATHLETE_PHOTOS[curAthlete] || ATHLETE_PHOTOS[record.athlete];
  const hasPhoto = !!curPhoto;
  const curVideo = record.video || last.video;
  // Records with a progression list store location/date on the latest entry,
  // not on the top-level record — fall back to that so the hero card matches
  // what's shown in the rail below.
  const curLocation = record.location || last.location;
  return (
    <div className="timeline-overlay" onClick={onClose}>
      <div className="timeline-panel" ref={dialogRef} role="dialog" aria-modal="true" aria-label={record.event + " record progression"} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <div className="timeline-toolbar">
          <div className="timeline-eb">RECORD PROGRESSION</div>
          <button className="timeline-close" onClick={onClose} aria-label="Close progression"><Icon name="close" /></button>
        </div>
        <h2 className="timeline-title">{record.event}</h2>
        <div className={"timeline-current" + (hasPhoto ? " has-photo" : "") + (curVideo ? " has-video" : "")}>
          <div className="cur-main">
            {hasPhoto && (
              <button
                type="button"
                className="cur-photo"
                onClick={() => onMedia({
                  type: "photo",
                  src: curPhoto,
                  name: record.athlete,
                  subtitle: record.event + " · " + record.mark + " · " + yearOnly(record.year)
                })}
                title="Click to enlarge"
              >
                <img src={rootAsset(curPhoto)} alt={curAthlete} loading="lazy" decoding="async" />
                <span className="cur-photo-zoom">CLICK TO ENLARGE</span>
              </button>
            )}
            <div className="cur-stat">
              <div className="cur-eyebrow">CURRENT RECORD · {yearOnly(record.year)}</div>
              <FitText className="cur-mark" max={hasPhoto ? 88 : 64} min={36}>
                {record.mark}
              </FitText>
              <FitText className="cur-athlete" max={hasPhoto ? 28 : 26} min={14} wrapOnMobile>
                <AthleteName name={curAthlete} onMedia={onMedia}
                  subtitle={record.event + " · " + record.mark + " · " + yearOnly(record.year)} />
              </FitText>
              <div className="cur-meta-lines">
                {curLocation && <div className="cur-loc">{curLocation}</div>}
              </div>
            </div>
          </div>
          {curVideo && (
            <button
              type="button"
              className="cur-video-cta"
              onClick={() => onMedia({
                type: "video",
                src: curVideo,
                name: record.athlete,
                mark: record.mark,
                subtitle: record.event + " · " + yearOnly(record.year)
              })}
              title="Click to watch the record-breaking performance"
            >
              <span className="cvc-frame" aria-hidden="true">
                <span className="cvc-stripes"></span>
                <span className="cvc-play" aria-hidden="true"><Icon name="play" /></span>
              </span>
              <span className="cvc-text">
                <span className="cvc-eyebrow">Watch the Record</span>
                <span className="cvc-detail">Full record-breaking performance</span>
              </span>
              <span className="cvc-arrow" aria-hidden="true"><Icon name="arrowRight" /></span>
            </button>
          )}
        </div>
        <div className="timeline-rail">
          {prog.map((p, i) => {
            const isLast = i === prog.length - 1;
            const hasVideo = !!p.video;
            const onPlayVideo = hasVideo ? () => onMedia({
              type: "video",
              src: p.video,
              name: p.athlete,
              mark: p.mark,
              subtitle: (p.location || record.event) + (p.yr ? " · " + formatYr(p.yr) : "")
            }) : null;
            return (
              <div className={"timeline-node" + (isLast ? " current" : "") + (hasVideo ? " has-video" : "")} key={p.yr + p.athlete + i}>
                <div className="node-yr">{formatYr(p.yr)}</div>
                <div className="node-dot"></div>
                <div className="node-card">
                  <div className="node-card-row">
                    <div className="node-mark">
                      {hasVideo ? (
                        <button
                          type="button"
                          className="athlete-link"
                          title="Click to watch video"
                          onClick={onPlayVideo}
                        >
                          <span className="athlete-link-text">{p.mark}</span>
                          <span className="athlete-link-ic" aria-hidden="true"><Icon name="play" /></span>
                        </button>
                      ) : p.mark}
                    </div>
                    <div className="node-info">
                      <div className="node-athlete">
                        <AthleteName name={p.athlete} onMedia={onMedia}
                          subtitle={record.event + " · " + p.mark + " · " + formatYr(p.yr)} />
                      </div>
                      {p.date && <div className="node-date">{p.date}</div>}
                      {p.location && <div className="node-location">{p.location}</div>}
                      {p.note && <div className="node-note">{p.note}</div>}
                    </div>
                    {isLast && <div className="node-badge">CURRENT</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="timeline-foot">
          Records verified by Plum HS Track &amp; Field staff. To submit a correction, email <span style={{ color: "var(--gold-ink)" }}>morinelloa@gmail.com</span>.
        </div>
      </div>
    </div>
  );
}

const RECORD_GROUPS = {
  "Sprints": ["55 Meter Dash", "60 Meter Dash", "100 Meter Dash", "200 Meter Dash", "400 Meter Dash"],
  "Hurdles": ["55 Meter Hurdles", "55m Hurdles", "60m Hurdles", "100m Hurdles", "110m High Hurdles", "300m Hurdles"],
  "Distance": ["800 Meter Run", "Mile Run", "1600 Meter Run", "3000 Meter Run", "3200 Meter Run"],
  "Relays": ["4×100 Meter Relay", "4×200 Meter Relay", "4×400 Meter Relay", "4×800 Meter Relay", "Distance Medley Relay"],
  "Jumps": ["High Jump", "Long Jump", "Triple Jump", "Pole Vault"],
  "Throws": ["Shot Put", "Discus", "Javelin", "Weight Throw"],
  "Multi-Events": ["Pentathlon", "Heptathlon", "Decathlon"]
};

function RecordsTable({ data, hasProgression = true, showSchool = false }) {
  const [open, setOpen] = React.useState(null);
  const [media, setMedia] = React.useState(null);
  const openMedia = React.useCallback((m) => setMedia(m), []);
  const { showActionCol, grouped } = React.useMemo(() => {
    const showActionCol = hasProgression || data.some(r => r.progression || r.photo || r.video);
    const grouped = {};
    Object.keys(RECORD_GROUPS).forEach(g => { grouped[g] = []; });
    data.forEach(r => {
      for (const g of Object.keys(RECORD_GROUPS)) {
        if (RECORD_GROUPS[g].includes(r.event)) { grouped[g].push(r); break; }
      }
    });
    return { showActionCol, grouped };
  }, [data, hasProgression]);

  return (
    <React.Fragment>
      {Object.entries(grouped).map(([g, rows]) => rows.length ? (
        <div key={g}>
          <div className="records-group-head"><span className="ic">{g[0]}</span>{g}</div>
          <table className="data-table records-table" role="table">
            <thead>
              <tr>
                <th style={{ width: showSchool ? "24%" : "30%" }}>Event</th>
                <th style={{ width: showSchool ? "14%" : "18%" }}>Mark</th>
                <th style={{ width: showSchool ? "26%" : "auto" }}>Athlete</th>
                {showSchool && <th style={{ width: "24%" }}>School</th>}
                <th style={{ width: "12%" }}>Year</th>
                {showActionCol && <th style={{ width: "18%", textAlign: "right" }}></th>}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const recordVideo = r.video || (r.progression && r.progression[r.progression.length - 1]?.video);
                return (
                <tr key={r.event}>
                  <td className="event-name">{r.event}</td>
                  <td className="mark" data-label="Mark">
                    {recordVideo ? (
                      <button
                        type="button"
                        className="athlete-link"
                        title="Click to watch video"
                        onClick={() => openMedia({
                          type: "video",
                          src: recordVideo,
                          name: r.athlete,
                          mark: r.mark,
                          subtitle: r.event + " · " + yearOnly(r.year)
                        })}
                      >
                        <span className="athlete-link-text">{r.mark}</span>
                        <span className="athlete-link-ic" aria-hidden="true"><Icon name="play" /></span>
                      </button>
                    ) : r.mark}
                  </td>
                  <td className="athlete" data-label="Athlete">
                    <AthleteName name={r.athlete} displayName={recordTableAthlete(r.event, r.athlete)} onMedia={openMedia}
                      subtitle={r.event + " · " + r.mark + " · " + yearOnly(r.year)} />
                  </td>
                  {showSchool && <td className="athlete school" data-label="School">{r.school}</td>}
                  <td className="yr" data-label="Year">{yearOnly(r.year)}</td>
                  {showActionCol && (
                    <td className="record-action" style={{ textAlign: "right" }}>
                      {r.progression ? (
                        <button className="progression-link" onClick={() => setOpen(r)}>
                          Progression&nbsp;<Icon name="arrowRight" />
                        </button>
                      ) : r.video ? (
                        <button className="progression-link" onClick={() => openMedia({
                          type: "video",
                          name: r.athlete,
                          mark: r.mark,
                          subtitle: r.event + " · " + yearOnly(r.year)
                        })}>
                          <Icon name="play" />&nbsp;Watch
                        </button>
                      ) : null}
                    </td>
                  )}
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null)}
      <RecordTimeline record={open} onClose={() => setOpen(null)} onMedia={openMedia} />
      <MediaLightbox media={media} onClose={() => setMedia(null)} />
    </React.Fragment>
  );
}

export function RecordsPage({ sub }) {
  const tab = RECORD_TABS.find(t => t.id === sub) || RECORD_TABS[0];
  const data = RECORDS[tab.data] || [];
  const hasProgression = sub && (sub.includes("outdoor") || sub.includes("indoor"));
  const showSchool = sub && sub.includes("stadium");
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">PLUM MUSTANGS · ALL-TIME RECORDS</div>
          <h1 className="page-title">School Records</h1>
          <p className="page-subtitle">All-time bests for varsity track &amp; field. {hasProgression && "Click Progression on any event to see how the record evolved over the years."}</p>
        </div>
        <div className="rec-summary">
          <div className="rs-num">{data.length}</div>
          <div className="rs-lbl">EVENTS<br/>TRACKED</div>
        </div>
      </div>
      <nav className="subnav" aria-label="Record lists">
        {RECORD_TABS.map(t => (
          <a className={"subnav-tab" + (t.id === tab.id ? " active" : "")} href={routeHref("/records/" + t.id)} aria-current={t.id === tab.id ? "page" : undefined} key={t.id}>
            {t.title}
          </a>
        ))}
      </nav>
      <RecordsTable data={data} hasProgression={hasProgression} showSchool={showSchool} />
    </div>
  );
}


// === Jr High Records (same shape) ===
export function JrHighPage({ sub }) {
  const tabs = [
    { id: "boys", title: "Boys Records", data: "jrBoys" },
    { id: "girls", title: "Girls Records", data: "jrGirls" }
  ];
  const tab = tabs.find(t => t.id === sub) || tabs[0];
  const data = RECORDS[tab.data] || [];
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">PLUM MIDDLE SCHOOL · 7TH/8TH GRADE</div>
          <h1 className="page-title">Junior High Records</h1>
          <p className="page-subtitle">Top marks set during 7th and 8th grade competition at Plum Middle School. The pipeline starts here.</p>
        </div>
      </div>
      <nav className="subnav" aria-label="Junior high record lists">
        {tabs.map(t => (
          <a className={"subnav-tab" + (t.id === tab.id ? " active" : "")} href={routeHref("/jrhigh/" + t.id)} aria-current={t.id === tab.id ? "page" : undefined} key={t.id}>
            {t.title}
          </a>
        ))}
      </nav>
      <RecordsTable data={data} hasProgression={false} />
    </div>
  );
}

