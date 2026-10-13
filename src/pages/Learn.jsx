// === Learn: Drills & Info / Inspiration ===
import React from 'react';
import { MediaLightbox } from './Records.jsx';
import { routeHref } from '../utils/paths.js';

const LEARN_TOPICS = {
  "drills": {
    title: "Drills",
    eyebrow: "TRAINING RESOURCES",
    subs: [
      { id: "hurdles", title: "Hurdle Drills", count: "RHYTHM · CLEARANCE · RECOVERY" },
      { id: "ladders", title: "Ladder Drills", count: "FOOT SPEED · COORDINATION · AGILITY" }
    ]
  },
  "inspiration": {
    title: "Inspiration",
    eyebrow: "FUEL FOR THE WORK",
    subs: [
      { id: "quotes", title: "Quotes", count: "WORDS WORTH RETURNING TO" },
      { id: "records", title: "World Records", count: "MEN & WOMEN · ALL EVENTS" }
    ]
  }
};

const HURDLE_FAMILIES = [
  {
    id: "wall",
    title: "Wall Drills",
    blurb: "Isolate the lead and trail leg patterns at the wall — no moving variables, just the shape of the action.",
    drills: [
      { name: "Wall Drill — Lead Leg",        orientation: "wall", file: "Leadwall.mp4" },
      { name: "Wall Drill — Trail Leg",       orientation: "wall", file: "WallDrill-TrailLeg.mp4" },
      { name: "Wall Drill — Trail Leg Slide", orientation: "wall", file: "TrailLegSlideDrill-TonyVeney_2.mp4" }
    ]
  },
  {
    id: "walkovers",
    title: "Walk Overs",
    blurb: "Walking-pace clearance work. The focus is the shape of the leg over the hurdle, not the rhythm between them.",
    drills: [
      { name: "Walk Over — 2 in Each Gap",             orientation: "forward", file: "2inEachGapWalkovers.mp4" },
      { name: "Walk Over — 1 in Each Gap",             orientation: "forward", file: "EveryOtherWalkovers.mp4" },
      { name: "Walk Over — 1 in Each Gap w/ Med Ball", orientation: "forward", file: "WalkoverwithMedBall.mp4" }
    ]
  },
  {
    id: "hopovers",
    title: "Hop Overs",
    blurb: "Reactive plyometric clearance. Stiff ankles, quick ground contacts, eyes up out of the last hurdle.",
    drills: [
      { name: "Hop Over — 2 in Each Gap", orientation: "forward", file: "2ineachgaphop.mp4" },
      { name: "Hop Over — 1 in Each Gap", orientation: "forward", file: "OverEveryOtherwithhop.mp4" },
      { name: "Hurdle Hops",              orientation: "forward", file: "HurdleHops.mp4" }
    ]
  },
  {
    id: "combo",
    title: "Backward & Combo Patterns",
    blurb: "Reverse-direction work. Builds spatial awareness and stops you from relying on momentum to clear the hurdle.",
    drills: [
      { name: "Backward Walk Over — 2 in Each Gap", orientation: "combo", file: "Backward2ineverygap.mp4" },
      { name: "Backward Walk Over — 1 in Each Gap", orientation: "combo", file: "BackwardEveryOther.mp4" },
      { name: "Over 2, Backward 1",                 orientation: "combo", file: "Over2Back1.mp4" },
      { name: "3 Forward, 2 Back — Walk",           orientation: "combo", file: "3Forward2Backwalking.mp4" },
      { name: "3 Forward, 2 Back — Hop",            orientation: "combo", file: "3Forward2Backhopping.mp4" }
    ]
  },
  {
    id: "lateral",
    title: "Lateral Drills",
    blurb: "Side-on hip mobility. The drills coaches lean on to keep hurdlers loose between sets and through warm-up.",
    drills: [
      { name: "Lateral Straight Legs (Scissor Kicks)", orientation: "lateral", file: "LateralStraightLeg.mp4" },
      { name: "Lateral Bent Knee",                     orientation: "lateral", file: "LateralBentKnee.mp4" },
      { name: "Lateral Walk Over",                     orientation: "lateral", file: "LateralWalkOvers.mp4" },
      { name: "Lateral Hop Over",                      orientation: "lateral", file: "Lateralwhop.mp4" },
      { name: "Lateral Hop Over w/ Med Ball",          orientation: "lateral", file: "LateralwMedBall.mp4" }
    ]
  },
  {
    id: "walkthrus",
    title: "Walk Thrus",
    blurb: "Single-leg isolation at slow speed. Pick one side and groove the pattern before you add tempo.",
    drills: [
      { name: "Walk Thru — Lead Leg",  orientation: "forward", file: "LeadLegWalkovers.mp4" },
      { name: "Walk Thru — Trail Leg", orientation: "forward", file: "TrailLegWalkovers.mp4" }
    ]
  },
  {
    id: "runthrus",
    title: "Run Thrus & Full Speed",
    blurb: "Race-pace rhythm. Three steps between every hurdle, full clearance, reset on landing.",
    drills: [
      { name: "Run Thru — Lead Leg",  orientation: "forward", file: "RunthruLeadLeg.mp4" },
      { name: "Run Thru — Trail Leg", orientation: "forward", file: "RunthruTrailleg.mp4" },
      { name: "Over / Under",         orientation: "forward", file: "OverUnders.mp4" },
      { name: "Over the Top",         orientation: "forward", file: "Overtop.mp4" }
    ]
  }
];

const HURDLE_VIDEO_DIR = "/videos/hurdledrills/";
function hurdleVideoSrc(file) {
  return HURDLE_VIDEO_DIR + encodeURIComponent(file);
}

const LADDER_FAMILIES = [
  {
    id: "high-knees",
    title: "High Knees",
    blurb: "Foot speed with aggressive knee drive. Stay tall, ground contact short, knees punched to chest height.",
    drills: [
      { name: "High Knee — Two Feet",         orientation: "forward", file: "High Knee  - Two Feet.mp4" },
      { name: "High Knee — One Foot",         orientation: "forward", file: "High Knee - One Foot.mp4" },
      { name: "Lateral High Knee",            orientation: "lateral", file: "Lateral High Knee.mp4" },
      { name: "Lateral High Knee — One Foot", orientation: "lateral", file: "Lateral High Knee - One Foot.mp4" }
    ]
  },
  {
    id: "ickey",
    title: "Ickey Shuffle",
    blurb: "The classic in-in-out pattern. Cadence high, hips loaded, eyes up out of the ladder.",
    drills: [
      { name: "Ickey Shuffle",                    orientation: "forward", file: "Ickey Shuffle.mp4" },
      { name: "Ickey Shuffle — Two Feet",         orientation: "forward", file: "Ickey Shuffle - Two Feet.mp4" },
      { name: "Lateral Ickey Shuffle",            orientation: "lateral", file: "Lateral Ickey Shuffle.mp4" },
      { name: "Lateral Ickey Shuffle — Two Feet", orientation: "lateral", file: "Lateral Ickey Shuffle - Two Feet.mp4" }
    ]
  },
  {
    id: "in-out",
    title: "In, In — Out, Out",
    blurb: "Lateral foot placement with rapid ground contacts. Builds hip mobility and rhythm under fatigue.",
    drills: [
      { name: "In In, Out Out",         orientation: "forward", file: "In In, Out Out.mp4" },
      { name: "Lateral In In, Out Out", orientation: "lateral", file: "Lateral In In, Out Out.mp4" }
    ]
  },
  {
    id: "hopscotch",
    title: "Hop Scotch",
    blurb: "Single-leg-into-split-stance pattern. Reactive ankles, controlled landings, stiff midsection.",
    drills: [
      { name: "Hop Scotch",             orientation: "forward", file: "Hop Scotch.mp4" },
      { name: "Alternating Hop Scotch", orientation: "forward", file: "Alternating Hop Scotch.mp4" },
      { name: "Lateral Hop Scotch",     orientation: "lateral", file: "Lateral Hop Scotch.mp4" }
    ]
  },
  {
    id: "ali",
    title: "Ali Shuffle",
    blurb: "Float-and-pull footwork made famous in the boxing ring. Balance and tempo over raw speed.",
    drills: [
      { name: "Ali Shuffle — Left Foot",  orientation: "forward", file: "Ali Shuffle - Left Foot.mp4" },
      { name: "Ali Shuffle — Right Foot", orientation: "forward", file: "Ali Shuffle - Right Foot.mp4" }
    ]
  },
  {
    id: "whips",
    title: "Lead & Tail Whips",
    blurb: "Hip rotation work. Whip the lead or trail leg around without losing posture or cadence.",
    drills: [
      { name: "Lead Whip — Left In",          orientation: "forward", file: "Lead Whip - Left In.mp4" },
      { name: "Lead Whip — Right In",         orientation: "forward", file: "Lead Whip - Right In.mp4" },
      { name: "Tail Whip — Left In",          orientation: "forward", file: "Tail Whip - Left In.mp4" },
      { name: "Tail Whip — Right In",         orientation: "forward", file: "Tail Whip - Right In.mp4" },
      { name: "Lateral Lead Whip — Left In",  orientation: "lateral", file: "Lateral Lead Whip - Left In.mp4" },
      { name: "Lateral Lead Whip — Right In", orientation: "lateral", file: "Lateral Lead Whip - Right In.mp4" },
      { name: "Lateral Tail Whip — Left In",  orientation: "lateral", file: "Lateral Tail Whip - Left In.mp4" },
      { name: "Lateral Tail Whip — Right In", orientation: "lateral", file: "Lateral Tail Whip - Right In.mp4" }
    ]
  },
  {
    id: "jabs",
    title: "Foot Jabs",
    blurb: "Quick tap-in / tap-out with one foot leading. Ankle stiffness and the first step out of the ladder.",
    drills: [
      { name: "Left Foot Jab",          orientation: "forward", file: "Left Foot Jab.mp4" },
      { name: "Right Foot Jab",         orientation: "forward", file: "Right Foot Jab.mp4" },
      { name: "Lateral Left Foot Jab",  orientation: "lateral", file: "Lateral Left Foot Jab.mp4" },
      { name: "Lateral Right Foot Jab", orientation: "lateral", file: "Lateral Right Foot Jab.mp4" }
    ]
  },
  {
    id: "zigzag",
    title: "Zig Zag",
    blurb: "Diagonal foot patterns through the ladder. Change of direction under control.",
    drills: [
      { name: "Lateral Zig Zag — One Foot",  orientation: "lateral", file: "Lateral Zig Zag - One Foot.mp4" },
      { name: "Lateral Zig Zag — Two Feet",  orientation: "lateral", file: "Lateral Zig Zag - Two Feet.mp4" }
    ]
  },
  {
    id: "single-leg",
    title: "Single Leg Hop",
    blurb: "Unilateral power and balance. Stick the landing, reset the hip, push to the next rung.",
    drills: [
      { name: "Single Leg Hop — Left",  orientation: "forward", file: "Single Leg Hop - Left.mp4" },
      { name: "Single Leg Hop — Right", orientation: "forward", file: "Single Leg Hop - Right.mp4" }
    ]
  },
  {
    id: "crossover",
    title: "Cross Over",
    blurb: "Cross-step coordination through the rungs. Hip turn, opposite arm drive, recover square.",
    drills: [
      { name: "Cross Over Combo", orientation: "forward", file: "Cross Over Combo.mp4" }
    ]
  }
];

const LADDER_VIDEO_DIR = "/videos/ladderdrills/";

function ladderVideoSrc(file) {
  return LADDER_VIDEO_DIR + encodeURIComponent(file);
}

const NUTRITION_TOPICS = [
  { n: "01", name: "Race-Day Breakfast", desc: "What to eat 3 hours before a meet — and what to avoid.", meta: "ARTICLE" },
  { n: "02", name: "Hydration Math", desc: "Body-weight-based fluid intake for warm-weather meets.", meta: "GUIDE" },
  { n: "03", name: "Post-Workout Recovery", desc: "The 30-minute window. Protein, carbs, and the role of sleep.", meta: "ARTICLE" },
  { n: "04", name: "In-Season Eating", desc: "Sample meal plans for sprinters, mid-distance, and distance.", meta: "MEAL PLAN" },
  { n: "05", name: "Cramping & Electrolytes", desc: "Sodium losses, leg cramps, and what actually helps.", meta: "GUIDE" }
];

const QUOTES = [
  { q: "It's not the will to win that matters — everyone has that. It's the will to prepare to win that matters.", a: "Paul \"Bear\" Bryant" },
  { q: "Pain is temporary. Quitting lasts forever.", a: "Lance Armstrong" },
  { q: "The miracle isn't that I finished. The miracle is that I had the courage to start.", a: "John Bingham" },
  { q: "Run when you can, walk if you have to, crawl if you must — just never give up.", a: "Dean Karnazes" },
  { q: "Champions keep playing until they get it right.", a: "Billie Jean King" },
  { q: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", a: "Aristotle" },
  { q: "To give anything less than your best is to sacrifice the gift.", a: "Steve Prefontaine" },
  { q: "Some people create with words, or with music, or with a brush and paints. I like to make something beautiful when I run.", a: "Steve Prefontaine" },
  { q: "A lot of people run a race to see who is fastest. I run to see who has the most guts.", a: "Steve Prefontaine" },
  { q: "I'm going to work so that it's a pure guts race at the end, and if it is, I am the only one who can win it.", a: "Steve Prefontaine" },
  { q: "Over every mountain there is a path, although it may not be seen from the valley.", a: "Steve Prefontaine" },
  { q: "The will to win means nothing without the will to prepare.", a: "Juma Ikangaa" },
  { q: "Hard work beats talent when talent doesn't work hard.", a: "Tim Notke" },
  { q: "Somewhere in the world someone is training when you are not. When you race him, he will win.", a: "Tom Fleming" },
  { q: "The difference between the impossible and the possible lies in a person's determination.", a: "Tommy Lasorda" },
  { q: "Today I will do what others won't, so tomorrow I can accomplish what others can't.", a: "Jerry Rice" }
];

const PRE_TOPICS = [
  { n: "01", name: "Warm-Up Progression", desc: "Easy jog → dynamic drills → strides → blocks. 35 minutes total.", meta: "ROUTINE" },
  { n: "02", name: "Mental Reset", desc: "The 60-second technique for clearing nerves before the gun.", meta: "MENTAL" },
  { n: "03", name: "Spike Check", desc: "Length, placement, surface. What changes between cinder and rubber.", meta: "GEAR" },
  { n: "04", name: "Heat-Sheet Strategy", desc: "Reading the heat, knowing your lane, picking the rabbit.", meta: "TACTICAL" }
];

const WORLD_RECORDS_DATA = [
  // === MEN ===
  { ev: "100m Dash (M)",     mark: "9.58",               athlete: "Usain Bolt (JAM)",                year: "2009", vid: "https://www.youtube.com/watch?v=3nbjhpcZ9_g" },
  { ev: "200m Dash (M)",     mark: "19.19",              athlete: "Usain Bolt (JAM)",                year: "2009", vid: "https://www.youtube.com/watch?v=_DjvvI-0xjc" },
  { ev: "400m Dash (M)",     mark: "43.03",              athlete: "Wayde van Niekerk (RSA)",         year: "2016", vid: "https://www.youtube.com/watch?v=wHFjtCwHs8w" },
  { ev: "800m Run (M)",      mark: "1:40.91",            athlete: "David Rudisha (KEN)",             year: "2012", vid: "https://www.youtube.com/watch?v=YKEOjWEzVGs" },
  { ev: "1500m Run (M)",     mark: "3:26.00",            athlete: "Hicham El Guerrouj (MAR)",        year: "1998", vid: "https://www.youtube.com/watch?v=BG5OqO65_Xg" },
  { ev: "5000m Run (M)",     mark: "12:35.36",           athlete: "Joshua Cheptegei (UGA)",          year: "2020", vid: "https://www.youtube.com/watch?v=uN9Y6gi24B4" },
  { ev: "110m Hurdles (M)",  mark: "12.80",              athlete: "Aries Merritt (USA)",             year: "2012", vid: "https://www.youtube.com/watch?v=xIhrKmSUkd8" },
  { ev: "400m Hurdles (M)",  mark: "45.94",              athlete: "Karsten Warholm (NOR)",           year: "2021", vid: "https://www.youtube.com/watch?v=n48P9pSIQKs" },
  { ev: "4×100m Relay (M)",  mark: "36.84",              athlete: "Jamaica",                         year: "2012", vid: "https://www.youtube.com/watch?v=uwLDpcye-VM" },
  { ev: "4×400m Relay (M)",  mark: "2:54.29",            athlete: "United States",                   year: "1993", vid: "https://www.youtube.com/watch?v=VL4vPXqMe0k" },
  { ev: "Long Jump (M)",     mark: "8.95m / 29'4½\"",   athlete: "Mike Powell (USA)",               year: "1991", vid: "https://www.youtube.com/watch?v=CFj6RzlWNtM" },
  { ev: "Triple Jump (M)",   mark: "18.29m / 60'0¼\"",  athlete: "Jonathan Edwards (GBR)",          year: "1995", vid: "https://www.youtube.com/watch?v=xdSMa1zDpc0" },
  { ev: "High Jump (M)",     mark: "2.45m / 8'0¼\"",    athlete: "Javier Sotomayor (CUB)",          year: "1993", vid: "https://www.youtube.com/watch?v=IKSD1OfI4C8" },
  { ev: "Pole Vault (M)",    mark: "6.31m / 20'8½\"",   athlete: "Armand Duplantis (SWE)",          year: "2026", vid: "https://www.youtube.com/watch?v=w9xtbZNj6zc" },
  { ev: "Shot Put (M)",      mark: "23.56m / 77'3¾\"",  athlete: "Ryan Crouser (USA)",              year: "2023", vid: "https://www.youtube.com/watch?v=isv0Tm0djMs" },
  { ev: "Discus (M)",        mark: "75.56m / 247'10\"",  athlete: "Mykolas Alekna (LTU)",            year: "2025", vid: "https://www.youtube.com/watch?v=_OHpiRDwWVU" },
  { ev: "Javelin (M)",       mark: "98.48m / 323'1\"",   athlete: "Jan Železný (CZE)",               year: "1996", vid: "https://www.youtube.com/watch?v=bPH0goL4xnY" },
  // === WOMEN ===
  { ev: "100m Dash (W)",     mark: "10.49",              athlete: "Florence Griffith-Joyner (USA)",  year: "1988", vid: "https://www.youtube.com/watch?v=Mrt9yZL8dbI" },
  { ev: "200m Dash (W)",     mark: "21.34",              athlete: "Florence Griffith-Joyner (USA)",  year: "1988", vid: "https://www.youtube.com/watch?v=y4Xs_OmfL2Y" },
  { ev: "400m Dash (W)",     mark: "47.60",              athlete: "Marita Koch (GDR)",               year: "1985", vid: "https://www.youtube.com/watch?v=WIQZAq6J4ug" },
  { ev: "800m Run (W)",      mark: "1:53.28",            athlete: "Jarmila Kratochvílová (CZE)",     year: "1983", vid: "https://www.youtube.com/watch?v=BPSM_j3Er1o" },
  { ev: "1500m Run (W)",     mark: "3:48.68",            athlete: "Faith Kipyegon (KEN)",            year: "2025", vid: "https://www.youtube.com/watch?v=uunSJYm67K4" },
  { ev: "5000m Run (W)",     mark: "13:58.06",           athlete: "Beatrice Chebet (KEN)",           year: "2025", vid: "https://www.youtube.com/watch?v=5HiDwoUTHoQ" },
  { ev: "100m Hurdles (W)",  mark: "12.12",              athlete: "Tobi Amusan (NGR)",               year: "2022", vid: "https://www.youtube.com/watch?v=bY9DlgdrQM4" },
  { ev: "400m Hurdles (W)",  mark: "50.37",              athlete: "Sydney McLaughlin-Levrone (USA)", year: "2024", vid: "https://www.youtube.com/watch?v=dpuqYd5qz94" },
  { ev: "4×100m Relay (W)",  mark: "40.82",              athlete: "United States",                   year: "2012", vid: "https://www.youtube.com/watch?v=sAfhf_u_QBI" },
  { ev: "4×400m Relay (W)",  mark: "3:15.17",            athlete: "USSR",                            year: "1988", vid: "https://www.youtube.com/watch?v=PhtFClCScpQ" },
  { ev: "Long Jump (W)",     mark: "7.52m / 24'8¼\"",   athlete: "Galina Chistyakova (USSR)",       year: "1988", vid: "https://www.youtube.com/watch?v=NXL70UdnFYk" },
  { ev: "Triple Jump (W)",   mark: "15.74m / 51'7¾\" (i)", athlete: "Yulimar Rojas (VEN)",          year: "2022", vid: "https://www.youtube.com/watch?v=SkuROrHlBlQ" },
  { ev: "High Jump (W)",     mark: "2.10m / 6'10¾\"",   athlete: "Yaroslava Mahuchikh (UKR)",       year: "2024", vid: "https://www.youtube.com/watch?v=P4Gph2C2I94" },
  { ev: "Pole Vault (W)",    mark: "5.06m / 16'7¼\"",   athlete: "Yelena Isinbayeva (RUS)",         year: "2009", vid: "https://www.youtube.com/watch?v=xOdNJsAknok" },
  { ev: "Shot Put (W)",      mark: "22.63m / 74'3\"",    athlete: "Natalya Lisovskaya (USSR)",       year: "1987", vid: "https://www.youtube.com/watch?v=BRA1Kr4xyM4" },
  { ev: "Discus (W)",        mark: "76.80m / 252'0\"",   athlete: "Gabriele Reinsch (GDR)",          year: "1988", vid: "https://www.youtube.com/watch?v=TKZPLfMYcWk" },
  { ev: "Javelin (W)",       mark: "72.28m / 237'1\"",   athlete: "Barbora Špotáková (CZE)",         year: "2008", vid: "https://www.youtube.com/watch?v=fWcvVJ1u-c0" },
];

function LearnIndex() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">RESOURCES FOR THE SQUAD</div>
          <h1 className="page-title">Learn</h1>
          <p className="page-subtitle">Drills, articles, nutrition info, and inspiration — everything Mustangs use to get better between meets.</p>
        </div>
      </div>
      <div className="learn-grid">
        {Object.entries(LEARN_TOPICS).map(([id, topic]) => (
          <a className="learn-card" href={routeHref("/learn/" + id)} key={id}>
            <div className="lcorner">{topic.subs.length} TOPICS</div>
            <h4>{topic.title}</h4>
            <div className="desc">{topic.eyebrow}</div>
            <div className="subtopic-list" style={{ marginTop: 18 }}>
              {topic.subs.map(s => (
                <div className="subtopic" key={s.id} style={{ padding: 14 }}>
                  <div className="nm" style={{ fontSize: 18 }}>{s.title}</div>
                  <div className="ct">{s.count}</div>
                </div>
              ))}
            </div>
            <div className="more">EXPLORE {topic.title.toUpperCase()} →</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function LearnCategory({ id }) {
  const topic = LEARN_TOPICS[id];
  if (!topic) return null;
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">LEARN · {topic.eyebrow}</div>
          <h1 className="page-title">{topic.title}</h1>
          <p className="page-subtitle">Choose a sub-topic to dig in. Each section includes drills, routines, or reference material.</p>
        </div>
      </div>
      <div className="subnav">
        <a className="subnav-tab" href={routeHref("/learn")}>← All Resources</a>
        {topic.subs.map(s => (
          <a key={s.id} className="subnav-tab" href={routeHref("/learn/" + id + "/" + s.id)}>
            {s.title}
          </a>
        ))}
      </div>
      <div className="subtopic-list">
        {topic.subs.map(s => (
          <a key={s.id} className="subtopic" href={routeHref("/learn/" + id + "/" + s.id)}>
            <div className="nm">{s.title}</div>
            <div className="ct">{s.count}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function LearnDrillList({ list, title, eyebrow }) {
  return (
    <div className="article-body">
      <h2>{title}</h2>
      <p style={{ color: "var(--grey)" }}>{eyebrow}</p>
      {list.map(d => (
        <div className="drill-card" key={d.n}>
          <div className="n">{d.n}</div>
          <div>
            <div className="nm">{d.name}</div>
            <div className="desc">{d.desc}</div>
          </div>
          <div className="meta">{d.meta}</div>
        </div>
      ))}
    </div>
  );
}

const ORIENTATION_LABELS = {
  forward: "Forward",
  lateral: "Lateral",
  wall: "Wall",
  combo: "Multi-Direction"
};

function VideoDrillLibrary({ families, videoSrc, orientationIds, hero, coachCards, onMedia }) {
  const [orientation, setOrientation] = React.useState("all");
  const [familyFilter, setFamilyFilter] = React.useState("all");

  const totals = React.useMemo(() => {
    const out = { _all: 0 };
    orientationIds.forEach(id => (out[id] = 0));
    families.forEach(f => f.drills.forEach(d => {
      out._all++;
      if (out[d.orientation] != null) out[d.orientation]++;
    }));
    return out;
  }, [families, orientationIds]);

  const visibleFamilies = families
    .filter(f => familyFilter === "all" || f.id === familyFilter)
    .map(f => ({
      ...f,
      drills: f.drills.filter(d => orientation === "all" || d.orientation === orientation)
    }))
    .filter(f => f.drills.length > 0);

  const openDrill = (family, drill) => {
    onMedia({
      type: "video",
      src: videoSrc(drill.file),
      name: drill.name,
      subtitle: family.title + " · " + (ORIENTATION_LABELS[drill.orientation] || drill.orientation).toUpperCase()
    });
  };

  return (
    <div className="ladder-lib">
      <div className="ladder-hero">
        <div className="ladder-hero-eb">{hero.eyebrow}</div>
        <h2 className="ladder-hero-title">{hero.title}</h2>
        <p className="ladder-hero-lede">{hero.lede}</p>
        <div className="ladder-coach">
          {coachCards.map((c, i) => (
            <div className="lc-card" key={i}>
              <div className="lc-eb">{c.eb}</div>
              <div className="lc-body">{c.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="ladder-filters">
        <div className="lf-row">
          <span className="lf-label">Orientation</span>
          <div className="lf-chips">
            <button className={"lf-chip" + (orientation === "all" ? " active" : "")} onClick={() => setOrientation("all")}>
              All <span className="lf-chip-ct">{totals._all}</span>
            </button>
            {orientationIds.map(id => (
              <button key={id}
                className={"lf-chip" + (orientation === id ? " active" : "")}
                onClick={() => setOrientation(id)}>
                {ORIENTATION_LABELS[id] || id} <span className="lf-chip-ct">{totals[id]}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="lf-row">
          <span className="lf-label">Movement</span>
          <div className="lf-chips">
            <button className={"lf-chip" + (familyFilter === "all" ? " active" : "")} onClick={() => setFamilyFilter("all")}>
              All Families
            </button>
            {families.map(f => (
              <button key={f.id}
                className={"lf-chip" + (familyFilter === f.id ? " active" : "")}
                onClick={() => setFamilyFilter(f.id)}>
                {f.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {visibleFamilies.length === 0 ? (
        <div className="ladder-empty">No drills match those filters. Try widening the orientation.</div>
      ) : (
        visibleFamilies.map(family => (
          <section className="ladder-family" key={family.id}>
            <div className="lfm-header">
              <div className="lfm-bar"></div>
              <div className="lfm-text">
                <h3 className="lfm-title">{family.title}</h3>
                <p className="lfm-blurb">{family.blurb}</p>
              </div>
            </div>
            <div className="ladder-grid">
              {family.drills.map(drill => (
                <button
                  key={drill.file}
                  type="button"
                  className="ladder-tile"
                  onClick={() => openDrill(family, drill)}
                  title={"Play " + drill.name}
                >
                  <span className="lt-frame">
                    <video
                      className="lt-video"
                      src={videoSrc(drill.file)}
                      preload="metadata"
                      muted
                      playsInline
                      onMouseEnter={(e) => { e.currentTarget.play().catch(() => {}); }}
                      onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                    />
                    <span className="lt-play" aria-hidden="true">▶</span>
                    <span className={"lt-orient lt-orient-" + drill.orientation}>
                      {(ORIENTATION_LABELS[drill.orientation] || drill.orientation).toUpperCase()}
                    </span>
                  </span>
                  <span className="lt-name">{drill.name}</span>
                </button>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function LadderDrillsLibrary({ onMedia }) {
  return (
    <VideoDrillLibrary
      families={LADDER_FAMILIES}
      videoSrc={ladderVideoSrc}
      orientationIds={["forward", "lateral"]}
      hero={{
        eyebrow: "FOOT SPEED · COORDINATION · AGILITY",
        title: "The Ladder Library",
        lede: "Short demonstration clips for every pattern we run. Use them as a daily warm-up, a between-set reset, or build a circuit by chaining one drill from each family."
      }}
      coachCards={[
        { eb: "Quality over Quantity", body: "Sharp footwork beats speed. Slow it down until the pattern is clean — speed shows up after rhythm." },
        { eb: "Eyes Up",                body: "Find a target past the ladder. Looking down teaches the wrong reflex when you sprint off the exit." },
        { eb: "Both Sides, Always",     body: "If a drill has a left version, run the right. Asymmetry shows up in the 100m, not in the ladder." }
      ]}
      onMedia={onMedia}
    />
  );
}

function HurdleDrillsLibrary({ onMedia }) {
  return (
    <VideoDrillLibrary
      families={HURDLE_FAMILIES}
      videoSrc={hurdleVideoSrc}
      orientationIds={["wall", "forward", "lateral", "combo"]}
      hero={{
        eyebrow: "RHYTHM · CLEARANCE · RECOVERY",
        title: "The Hurdle Library",
        lede: "Every hurdle drill we run, broken into the families coaches actually program around. Start at the wall, move through walkovers, then build to full-speed run-thrus."
      }}
      coachCards={[
        { eb: "Lead with the Knee",      body: "Drive the lead knee forward, not up. A high knee opens the hip and lets the foot snap down cleanly on the other side." },
        { eb: "Pull the Trail Leg Flat", body: "Trail leg fires parallel to the ground — knee up, heel through the armpit. Don't let it drop and drag." },
        { eb: "Three Steps Between",     body: "At race pace, every gap is three steps. Same foot leads, same foot trails — every hurdle, every rep." }
      ]}
      onMedia={onMedia}
    />
  );
}

function LearnSubPage({ cat, sub }) {
  const topic = LEARN_TOPICS[cat];
  const subTopic = topic && topic.subs.find(s => s.id === sub);
  const [recordGender, setRecordGender] = React.useState("men");
  const [media, setMedia] = React.useState(null);
  if (!topic || !subTopic) return null;

  let body = null;
  if (cat === "drills" && sub === "hurdles") {
    body = <HurdleDrillsLibrary onMedia={setMedia} />;
  } else if (cat === "drills" && sub === "ladders") {
    body = <LadderDrillsLibrary onMedia={setMedia} />;
  } else if (cat === "drills" && sub === "nutrition") {
    body = <LearnDrillList list={NUTRITION_TOPICS} title="Nutrition Resources" eyebrow="Practical eating guides built for high-school athletes balancing class loads, practice, and growth." />;
  } else if (cat === "inspiration" && sub === "pre") {
    body = <LearnDrillList list={PRE_TOPICS} title="Pre-Meet Routines" eyebrow="The 90 minutes before a race make or break it. These are the rituals the squad has standardized." />;
  } else if (cat === "inspiration" && sub === "quotes") {
    body = (
      <div className="article-body">
        <h2>Quotes</h2>
        <p style={{ color: "var(--grey)" }}>Lines we come back to when the work is hard.</p>
        {QUOTES.map((q, i) => (
          <div className="quote-card" key={i}>
            <div className="q">"{q.q}"</div>
            <div className="a">— {q.a}</div>
          </div>
        ))}
      </div>
    );
  } else if (cat === "inspiration" && sub === "records") {
    body = (
      <div>
        <div className="article-body" style={{ maxWidth: "100%" }}>
          <h2>World Record Standards</h2>
          <p style={{ color: "var(--grey)" }}>Where the top of the sport currently sits. Use these as a reference, not a ceiling.</p>
        </div>
        <div className="world-record-tabs">
          <button className={"wr-tab" + (recordGender === "men" ? " active" : "")} onClick={() => setRecordGender("men")}>Men's</button>
          <button className={"wr-tab" + (recordGender === "women" ? " active" : "")} onClick={() => setRecordGender("women")}>Women's</button>
        </div>
        <table className="data-table wr-table" role="table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Record</th>
              <th>Athlete</th>
              <th>Year</th>
              <th style={{ width: 90, textAlign: "right" }}>Watch</th>
            </tr>
          </thead>
          <tbody>
            {WORLD_RECORDS_DATA.filter(r => 
              (recordGender === "men" && r.ev.includes("(M)")) ||
              (recordGender === "women" && r.ev.includes("(W)"))
            ).map((r, i) => (
              <tr key={i}>
                <td className="event-name">{r.ev.replace(" (M)", "").replace(" (W)", "")}</td>
                <td className="mark" data-label="Record">{r.mark}</td>
                <td className="athlete" data-label="Athlete">{r.athlete}</td>
                <td className="yr" data-label="Year">{r.year}</td>
                <td className="record-action" style={{ textAlign: "right" }}>
                  <a className="wr-video-link" href={r.vid} target="_blank" rel="noopener" aria-label={"Watch " + r.ev + " on YouTube"}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22"><path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.546 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    <span className="wr-video-label">PLAY</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">LEARN · {topic.title.toUpperCase()}</div>
          <h1 className="page-title">{subTopic.title}</h1>
          <p className="page-subtitle">{subTopic.count}</p>
        </div>
      </div>
      <div className="subnav">
        <a className="subnav-tab" href={routeHref("/learn/" + cat)}>← Back to {topic.title}</a>
        {topic.subs.map(s => (
          <a key={s.id} className={"subnav-tab" + (s.id === sub ? " active" : "")} href={routeHref("/learn/" + cat + "/" + s.id)}>
            {s.title}
          </a>
        ))}
      </div>
      {body}
      <MediaLightbox media={media} onClose={() => setMedia(null)} />
    </div>
  );
}

export function LearnPage({ sub, deep }) {
  if (!sub) return <LearnIndex />;
  if (!deep) return <LearnCategory id={sub} />;
  return <LearnSubPage cat={sub} sub={deep} />;
}

