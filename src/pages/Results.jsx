// === Results pages (PIAA / WPIAL — champions & placers) ===
import React from 'react';
import { PTF_RESULTS } from '../data/results.js';
import { MediaLightbox } from './Records.jsx';
import { SeasonArchivePage } from './Archives.jsx';
import { routeHref } from '../utils/paths.js';

const RESULTS = PTF_RESULTS;

const RESULT_TABS = [
  { id: "piaa-champions", title: "PIAA Champions" },
  { id: "piaa-placers", title: "PIAA Placers" },
  { id: "wpial-champions", title: "WPIAL Champions" },
  { id: "wpial-placers", title: "WPIAL Placers" },
  { id: "season-archives", title: "Season Archives" }
];

function ChampionsList({ data, title }) {
  const sorted = [...data].sort((a, b) => parseInt(a.yr, 10) - parseInt(b.yr, 10));
  const [media, setMedia] = React.useState(null);
  return (
    <div>
      <div className="records-group-head"><span className="ic" aria-hidden="true">★</span>{title}</div>
      {sorted.map((c, i) => (
        <div className={"champ-card" + (c.gender === "girls" ? " girls" : "")} key={i}>
          <div className="yr">{c.yr}</div>
          <div className="champ-details">
            <div className="ev">{c.event}</div>
            {c.photo ? (
              <button
                type="button"
                className="athlete-link nm"
                onClick={() => setMedia({ type: "photo", src: c.photo, name: c.athlete, subtitle: c.event + " · " + c.mark + " · " + c.yr })}
                title={"View photo of " + c.athlete}
              >
                <span className="athlete-link-text">{c.athlete}</span>
                <span className="athlete-link-ic" aria-hidden="true">▢</span>
              </button>
            ) : (
              <div className="nm">{c.athlete}</div>
            )}
          </div>
          <div className="mark">
            {c.video ? (
              <button
                type="button"
                className="athlete-link"
                onClick={() => setMedia({ type: "video", src: c.video, name: c.athlete, mark: c.mark, subtitle: c.event + " · " + c.yr })}
                title="Click to watch video"
              >
                <span className="athlete-link-text">{c.mark}</span>
                <span className="athlete-link-ic" aria-hidden="true">▶</span>
              </button>
            ) : c.mark}
          </div>
        </div>
      ))}
      <MediaLightbox media={media} onClose={() => setMedia(null)} />
    </div>
  );
}

function PlacersList({ data, title }) {
  const sorted = [...data].sort((a, b) => parseInt(a.yr, 10) - parseInt(b.yr, 10));
  return (
    <div>
      <div className="records-group-head"><span className="ic">2</span>{title}</div>
      {sorted.map(yearBlock => (
        <div className="placer-block" key={yearBlock.yr}>
          <div className="year-tab">{yearBlock.yr}</div>
          {yearBlock.entries.map((e, i) => (
            <div className="placer-row" key={i}>
              <div className={"place" + (e.place === "1st" ? " gold" : "")}>{e.place}</div>
              <div className="placer-details">
                <span className="ath">{e.athlete}</span>
                <span className="ev" style={{ marginLeft: 10 }}>{e.event}</span>
              </div>
              <div className="mk">{e.mark}</div>
              <div></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ResultsPage({ sub, deep }) {
  const tab = RESULT_TABS.find(t => t.id === sub) || RESULT_TABS[0];
  const [gender, setGender] = React.useState("boys");

  let content;
  if (tab.id === "piaa-champions") {
    content = <ChampionsList data={RESULTS.piaaChampions} title="PIAA Championship Titles" />;
  } else if (tab.id === "wpial-champions") {
    content = <ChampionsList data={RESULTS.wpialChampions} title="WPIAL Championship Titles" />;
  } else if (tab.id === "piaa-placers") {
    const data = gender === "boys" ? RESULTS.piaaPlacersBoys : RESULTS.piaaPlacersGirls;
    content = (
      <React.Fragment>
        <div className="gender-toggle">
          <button className={gender === "boys" ? "active" : ""} onClick={() => setGender("boys")}>Boys</button>
          <button className={gender === "girls" ? "active" : ""} onClick={() => setGender("girls")}>Girls</button>
        </div>
        <PlacersList data={data} title={"PIAA Placers — " + (gender === "boys" ? "Boys" : "Girls")} />
      </React.Fragment>
    );
  } else if (tab.id === "season-archives") {
    content = <SeasonArchivePage sub={deep} />;
  } else if (tab.id === "wpial-placers") {
    const data = gender === "boys" ? RESULTS.wpialPlacersBoys : RESULTS.wpialPlacersGirls;
    content = (
      <React.Fragment>
        <div className="gender-toggle">
          <button className={gender === "boys" ? "active" : ""} onClick={() => setGender("boys")}>Boys</button>
          <button className={gender === "girls" ? "active" : ""} onClick={() => setGender("girls")}>Girls</button>
        </div>
        <PlacersList data={data} title={"WPIAL Placers — " + (gender === "boys" ? "Boys" : "Girls")} />
      </React.Fragment>
    );
  }

  return (
    <div className="page results-page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">WPIAL · PIAA · SEASON ARCHIVES</div>
          <h1 className="page-title">Results</h1>
          <p className="page-subtitle">WPIAL and PIAA championship finishes, dual meet records, invitational results, honor rolls, and season archives for Plum Mustangs Track &amp; Field.</p>
        </div>
      </div>
      <nav className="subnav" aria-label="Results pages">
        {RESULT_TABS.map(t => (
          <a className={"subnav-tab" + (t.id === tab.id ? " active" : "")} href={routeHref("/results/" + t.id)} aria-current={t.id === tab.id ? "page" : undefined} key={t.id}>
            {t.title}
          </a>
        ))}
      </nav>
      {content}
    </div>
  );
}

