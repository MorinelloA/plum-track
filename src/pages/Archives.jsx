// === Season Archives page — year-by-year results, 2001-2017 ===
import React from 'react';

const SECTION_LABELS = {
  "dual-meets":         "Dual Meets",
  "invitationals":      "Invitationals",
  "honor-roll":         "Honor Roll",
  "boys-honor-roll":    "Boys Honor Roll",
  "girls-honor-roll":   "Girls Honor Roll",
  "points":             "Team Points",
  "performance-lists":  "Performance Lists"
};

function placeRank(place) {
  const m = String(place).match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 99;
}

function sortHighlightsByPlace(highlights) {
  return [...highlights].sort((a, b) => placeRank(a.place) - placeRank(b.place));
}

function ArchiveYearRail({ years, available, current, onPick }) {
  return (
    <div className="archive-yearrail" role="tablist" aria-label="Season year">
      {years.map(y => {
        const has = available.includes(y);
        return (
          <button
            key={y}
            className={"archive-yr" + (y === current ? " active" : "") + (has ? "" : " empty")}
            onClick={() => onPick(y)}
            role="tab"
            aria-selected={y === current}
            disabled={!has}
          >
            <span className="y">{y}</span>
          </button>
        );
      })}
    </div>
  );
}

function ArchiveBanner({ data }) {
  const stats = [
    { val: data.summary.dualBoys,  label: "Boys Duals" },
    { val: data.summary.dualGirls, label: "Girls Duals" },
  ].filter(s => s.val != null);
  return (
    <div className="archive-banner">
      <div className="ab-year">{data.year}</div>
      {stats.length > 0 && (
        <div className="ab-stats">
          {stats.map(s => (
            <div className="ab-stat" key={s.label}>
              <div className="n">{s.val}</div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArchiveSectionTabs({ sections, current, onPick }) {
  return (
    <div className="archive-sectabs" role="tablist">
      {sections.map((s, i) => (
        <button
          key={s}
          className={"archive-sectab" + (s === current ? " active" : "")}
          onClick={() => onPick(s)}
          role="tab"
          aria-selected={s === current}
        >
          <span className="num">{String(i + 1).padStart(2, "0")}</span>
          {SECTION_LABELS[s]}
        </button>
      ))}
    </div>
  );
}

// --- Section renderers ---

function DualMeetsTable({ meets }) {
  return (
    <table className="dual-table">
      <thead>
        <tr>
          <th>Opponent</th>
          <th className="center" colSpan="2">Boys</th>
          <th className="center" colSpan="2">Girls</th>
        </tr>
      </thead>
      <tbody>
        {meets.map((m, i) => (
          <tr key={i}>
            <td>
              <div className="dt-opp">vs. {m.opp}</div>
            </td>
            <td className="center">
              {m.boys ? <span className="dt-score">{m.boys.for}–{m.boys.against}</span> : <span className="dt-na">—</span>}
            </td>
            <td className="center">
              {m.boys ? <span className={"dt-result " + m.boys.result}>{m.boys.result}</span> : null}
            </td>
            <td className="center">
              {m.girls ? <span className="dt-score">{m.girls.for}–{m.girls.against}</span> : <span className="dt-na">—</span>}
            </td>
            <td className="center">
              {m.girls ? <span className={"dt-result " + m.girls.result}>{m.girls.result}</span> : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InvitationalsList({ meets }) {
  const prepared = React.useMemo(() => meets.map(m => ({
    meet: m,
    boysH: sortHighlightsByPlace(m.highlights.filter(h => h.team === "B")),
    girlsH: sortHighlightsByPlace(m.highlights.filter(h => h.team === "G")),
  })), [meets]);
  return (
    <div>
      {prepared.map(({ meet: m, boysH, girlsH }, i) => {
        return (
          <div className="inv-card" key={i}>
            <div className="inv-head">
              <div>
                <div className="inv-name">{m.name}</div>
                <div className="inv-meta">{m.date}{m.venue ? ` · ${m.venue}` : ""}</div>
              </div>
              {(m.boysFinish || m.girlsFinish || m.award) && (
                <div className="inv-finishes">
                  {m.boysFinish  && <div className="fin"><span className="lab">Boys</span><span className="val">{m.boysFinish}</span></div>}
                  {m.girlsFinish && <div className="fin"><span className="lab">Girls</span><span className="val">{m.girlsFinish}</span></div>}
                  {m.award && <div className="fin award"><span className="val">{m.award}</span></div>}
                </div>
              )}
            </div>
            {boysH.length > 0 && (
              <React.Fragment>
                <div className="inv-group-label">Boys Results</div>
                {boysH.map((h, k) => (
                  <div className="inv-row" key={k}>
                    <span></span>
                    <span className="ev">{h.event}</span>
                    <span className="ath">{h.athlete}</span>
                    <span className="pl">{h.place}</span>
                    {h.mark && <span className="mk">{h.mark}</span>}
                  </div>
                ))}
              </React.Fragment>
            )}
            {girlsH.length > 0 && (
              <React.Fragment>
                <div className="inv-group-label girls">Girls Results</div>
                {girlsH.map((h, k) => (
                  <div className="inv-row" key={k}>
                    <span></span>
                    <span className="ev">{h.event}</span>
                    <span className="ath">{h.athlete}</span>
                    <span className="pl">{h.place}</span>
                    {h.mark && <span className="mk">{h.mark}</span>}
                  </div>
                ))}
              </React.Fragment>
            )}
          </div>
        );
      })}
    </div>
  );
}

function HonorRollList({ entries, single }) {
  const hasBoth = React.useMemo(
    () => !single && entries.some(e => e.team === "B") && entries.some(e => e.team === "G"),
    [entries, single]
  );
  const [gender, setGender] = React.useState("boys");
  const visible = React.useMemo(
    () => hasBoth ? entries.filter(e => e.team === (gender === "boys" ? "B" : "G")) : entries,
    [entries, hasBoth, gender]
  );
  return (
    <div>
      {hasBoth && (
        <div className="gender-toggle" style={{ marginBottom: 16 }}>
          <button className={gender === "boys" ? "active" : ""} onClick={() => setGender("boys")}>Boys</button>
          <button className={gender === "girls" ? "active" : ""} onClick={() => setGender("girls")}>Girls</button>
        </div>
      )}
      <div className="honor-list">
        {visible.map((e, i) => (
          <div className="honor-row" key={i}>
            <span className="ev">{e.event}</span>
            <span className="ath">{e.athlete}</span>
            <span className="mk">{e.mark}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PointsBoard({ rows, side }) {
  const max = rows.reduce((m, r) => Math.max(m, r.points), 0) || 1;
  const leader = rows[0];
  const rest = rows.slice(1);
  return (
    <div className={"pb-board " + side}>
      {leader && (
        <div className="pb-leader">
          <div className="pb-leader-mark">
            <span className="pb-leader-tag">Top Scorer</span>
            <span className="pb-leader-rank">01</span>
          </div>
          <div className="pb-leader-body">
            <div className="pb-leader-name">{leader.athlete}</div>
            <div className="pb-leader-meter">
              <span className="pb-fill" style={{ width: "100%" }}></span>
            </div>
          </div>
          <div className="pb-leader-pts">
            <span className="n">{leader.points}</span>
            <span className="u">pts</span>
          </div>
        </div>
      )}
      <ol className="pb-list">
        {rest.map(r => (
          <li className={"pb-row" + (r.rank <= 3 ? " medal-" + r.rank : "")} key={r.rank}>
            <span className="pb-rank">{String(r.rank).padStart(2, "0")}</span>
            <span className="pb-ath">{r.athlete}</span>
            <span className="pb-meter" aria-hidden="true">
              <span className="pb-fill" style={{ width: (r.points / max * 100) + "%" }}></span>
            </span>
            <span className="pb-pts">{r.points}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PointsSection({ data }) {
  return (
    <div className="points-grid">
      <div className="points-col">
        <h3><span className="bar"></span>Boys Team Points</h3>
        <PointsBoard rows={data.boys} side="boys" />
      </div>
      <div className="points-col">
        <h3><span className="bar"></span>Girls Team Points</h3>
        <PointsBoard rows={data.girls} side="girls" />
      </div>
    </div>
  );
}

function PerformanceLists({ data }) {
  const [side, setSide] = React.useState("boys");
  const list = side === "boys" ? data.boys : data.girls;
  return (
    <div>
      <div className="gender-toggle perflist-toggle">
        <button className={side === "boys" ? "active" : ""} onClick={() => setSide("boys")}>Boys</button>
        <button className={side === "girls" ? "active" : ""} onClick={() => setSide("girls")}>Girls</button>
      </div>
      {list.map((ev, i) => (
        <div className="perflist-event" key={i}>
          <div className="pl-head">
            <span className="pl-name">{ev.event}</span>
            <span className="pl-tag">Top 5 · Season Best</span>
          </div>
          {ev.entries.map((e) => (
            <div className={"perflist-entry" + (e.rank === 1 ? " lead" : "")} key={e.rank}>
              <span className="rk">{e.rank}</span>
              <span className="ath">{e.athlete}</span>
              <span className="grade">{e.grade}</span>
              <span className="mk">{e.mark}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ArchiveSectionBody({ data, section }) {
  if (section === "dual-meets" && data.dualMeets)
    return <DualMeetsTable meets={data.dualMeets} />;
  if (section === "invitationals" && data.invitationals)
    return <InvitationalsList meets={data.invitationals} />;
  if (section === "honor-roll" && data.honorRoll)
    return <HonorRollList entries={data.honorRoll} />;
  if (section === "boys-honor-roll" && data.boysHonorRoll)
    return <HonorRollList entries={data.boysHonorRoll} single={true} />;
  if (section === "girls-honor-roll" && data.girlsHonorRoll)
    return <HonorRollList entries={data.girlsHonorRoll} single={true} />;
  if (section === "points" && data.points)
    return <PointsSection data={data.points} />;
  if (section === "performance-lists" && data.performanceLists)
    return <PerformanceLists data={data.performanceLists} />;
  return <div className="archive-empty">No data on file for this section.</div>;
}

// --- Main component ---

export function SeasonArchivePage({ sub }) {
  const [ARCHIVES, setArchives] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    import('../data/archives.js').then(m => {
      if (!cancelled) setArchives(m.PTF_ARCHIVES);
    });
    return () => { cancelled = true; };
  }, []);

  if (!ARCHIVES) {
    return <div className="archive-empty" style={{ padding: '40px 0', textAlign: 'center' }}>Loading season archives…</div>;
  }

  const yearsAll = ARCHIVES.years;          // sorted desc
  const minY = yearsAll[yearsAll.length - 1];
  const maxY = yearsAll[0];
  // Build a full continuous range so even years without data show grayed-out
  const fullRange = [];
  for (let y = maxY; y >= minY; y--) fullRange.push(y);

  // Parse path: /results/season-archives/<year>/<section>
  const parts = (sub || "").split("/").filter(Boolean);
  const reqYear = parseInt(parts[0], 10);
  const reqSection = parts[1];

  const current = (yearsAll.includes(reqYear) ? reqYear : yearsAll[0]);
  const data = ARCHIVES.data.find(d => d.year === current);
  const section = data.sections.includes(reqSection) ? reqSection : data.sections[0];

  function pickYear(y) {
    if (!yearsAll.includes(y)) return;
    const d = ARCHIVES.data.find(x => x.year === y);
    // Try to preserve the current section if available, else use the year's first
    const nextSection = d.sections.includes(section) ? section : d.sections[0];
    window.location.href = "/results/season-archives/" + y + "/" + nextSection;
  }
  function pickSection(s) {
    window.location.href = "/results/season-archives/" + current + "/" + s;
  }

  return (
    <React.Fragment>
      <ArchiveYearRail years={fullRange} available={yearsAll} current={current} onPick={pickYear} />
      <ArchiveBanner data={data} />
      <ArchiveSectionTabs sections={data.sections} current={section} onPick={pickSection} />
      <ArchiveSectionBody data={data} section={section} />
    </React.Fragment>
  );
}
