export type LiveFlight = {
  id: string;
  callsign: string;
  pilotHandle: string;
  lat: number;
  lng: number;
  heading: number;
  altitudeFt: number;
  speedKts: number;
  origin: string;
  destination: string;
  etaUtc: string;
  aircraft: string;
  phase: "cruise" | "climb" | "descent" | "ground";
  /** [lat, lng][] route preview for map polyline */
  path: [number, number][];
};

export type SavedFlight = {
  id: string;
  date: string;
  origin: string;
  destination: string;
  aircraft: string;
  durationMin: number;
  distanceNm: number;
  landingRateFpm: number;
  score: number;
};

export type Pilot = {
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  joined: string;
  hours: number;
  flights: number;
  favoriteAirports: string[];
  favoriteAircraft: string;
  showcase: SavedFlight[];
};

export type Aircraft = {
  id: string;
  registration: string;
  type: string;
  livery: string;
  hoursOnType: number;
  photoUrls: string[];
  jetPhotosQuery: string;
};

export type FeedPost = {
  id: string;
  authorHandle: string;
  authorName: string;
  avatarUrl: string;
  time: string;
  content: string;
  route?: string;
  likes: number;
  comments: number;
  liked?: boolean;
};

export type LeaderboardRow = {
  rank: number;
  handle: string;
  hours: number;
  landings: number;
};

export type EventRow = {
  id: string;
  title: string;
  startUtc: string;
  participants: number;
  server: string;
};

export const LIVE_FLIGHTS_SEED: LiveFlight[] = [
  {
    id: "1",
    callsign: "NORD1",
    pilotHandle: "linus",
    lat: 60.17,
    lng: 11.1,
    heading: 285,
    altitudeFt: 37000,
    speedKts: 445,
    origin: "ENGM",
    destination: "EKCH",
    etaUtc: "14:22",
    aircraft: "A320neo",
    phase: "cruise",
    path: [
      [60.197, 11.1],
      [58.4, 10.8],
      [56.2, 11.9],
      [55.618, 12.656],
    ],
  },
  {
    id: "2",
    callsign: "ATL77W",
    pilotHandle: "maya",
    lat: 51.47,
    lng: -0.45,
    heading: 120,
    altitudeFt: 2800,
    speedKts: 165,
    origin: "EGLL",
    destination: "KJFK",
    etaUtc: "19:05",
    aircraft: "787-10",
    phase: "climb",
    path: [
      [51.47, -0.45],
      [51.2, -2],
      [49.5, -8],
      [40.641, -73.778],
    ],
  },
  {
    id: "3",
    callsign: "SCAND",
    pilotHandle: "erik",
    lat: 55.97,
    lng: 12.65,
    heading: 340,
    altitudeFt: 12000,
    speedKts: 290,
    origin: "EKCH",
    destination: "ESSA",
    etaUtc: "13:40",
    aircraft: "CRJ900",
    phase: "descent",
    path: [
      [55.618, 12.656],
      [56.2, 12.1],
      [58.9, 17.5],
      [59.649, 17.923],
    ],
  },
];

export const SAVED_FLIGHTS: SavedFlight[] = [
  {
    id: "sf1",
    date: "2026-05-09",
    origin: "ENGM",
    destination: "ENBR",
    aircraft: "A320neo",
    durationMin: 52,
    distanceNm: 180,
    landingRateFpm: -320,
    score: 94,
  },
  {
    id: "sf2",
    date: "2026-05-07",
    origin: "ESSA",
    destination: "EKCH",
    aircraft: "B738",
    durationMin: 78,
    distanceNm: 320,
    landingRateFpm: -180,
    score: 98,
  },
  {
    id: "sf3",
    date: "2026-05-04",
    origin: "EGLL",
    destination: "LFPG",
    aircraft: "A359",
    durationMin: 62,
    distanceNm: 210,
    landingRateFpm: -410,
    score: 88,
  },
  {
    id: "sf4",
    date: "2026-04-28",
    origin: "KSEA",
    destination: "KSFO",
    aircraft: "B78X",
    durationMin: 128,
    distanceNm: 680,
    landingRateFpm: -240,
    score: 96,
  },
];

export const PILOTS: Record<string, Pilot> = {
  you: {
    handle: "you",
    displayName: "Demo Pilot",
    bio: "IFR enthusiast · VATSIM B · Building bush trips on weekends.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
    joined: "Jan 2025",
    hours: 412,
    flights: 186,
    favoriteAirports: ["ENGM", "ESSA", "EKCH"],
    favoriteAircraft: "A320neo",
    showcase: SAVED_FLIGHTS.slice(0, 2),
  },
  linus: {
    handle: "linus",
    displayName: "Linus H.",
    bio: "Scandinavian hops · shared cockpit streams Tue/Thu.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=linus",
    joined: "Mar 2024",
    hours: 920,
    flights: 340,
    favoriteAirports: ["ENGM", "BIKF", "ENBR"],
    favoriteAircraft: "A320neo",
    showcase: SAVED_FLIGHTS.slice(1, 3),
  },
  maya: {
    handle: "maya",
    displayName: "Maya Chen",
    bio: "Long-haul only · SimBrief power user.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya",
    joined: "Nov 2023",
    hours: 1540,
    flights: 210,
    favoriteAirports: ["EGLL", "KJFK", "OMDB"],
    favoriteAircraft: "787-10",
    showcase: SAVED_FLIGHTS.slice(2, 4),
  },
};

export const AIRCRAFT: Record<string, Aircraft> = {
  a320: {
    id: "a320",
    registration: "LN-MSFS",
    type: "Airbus A320neo",
    livery: "SAS Scandinavian",
    hoursOnType: 210,
    photoUrls: [],
    jetPhotosQuery: "LN-MSFS",
  },
  b78x: {
    id: "b78x",
    registration: "N787FD",
    type: "Boeing 787-10",
    livery: "Generic house livery",
    hoursOnType: 128,
    photoUrls: [],
    jetPhotosQuery: "N787FD",
  },
};

export const FEED_POSTS: FeedPost[] = [
  {
    id: "p1",
    authorHandle: "linus",
    authorName: "Linus H.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=linus",
    time: "12m ago",
    content: "Butter on 04R at ENGM — crosswind practice paying off.",
    route: "EKCH → ENGM",
    likes: 24,
    comments: 5,
  },
  {
    id: "p2",
    authorHandle: "maya",
    authorName: "Maya Chen",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya",
    time: "1h ago",
    content: "Synced OFP from SimBrief, fuel looks perfect for step climb.",
    route: "EGLL → KJFK",
    likes: 41,
    comments: 12,
  },
  {
    id: "p3",
    authorHandle: "erik",
    authorName: "Erik V.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=erik",
    time: "3h ago",
    content: "Group flight tonight 19:00Z — Nordic Shuttle event.",
    likes: 67,
    comments: 28,
  },
];

export const FRIENDS = [
  { handle: "linus", name: "Linus H.", status: "In flight", callsign: "NORD1" },
  { handle: "maya", name: "Maya Chen", status: "Online", callsign: "—" },
  { handle: "erik", name: "Erik V.", status: "Offline", callsign: "—" },
];

export const LEADERBOARD: LeaderboardRow[] = [
  { rank: 1, handle: "maya", hours: 1540, landings: 412 },
  { rank: 2, handle: "linus", hours: 920, landings: 305 },
  { rank: 3, handle: "you", hours: 412, landings: 186 },
  { rank: 4, handle: "erik", hours: 390, landings: 140 },
];

export const EVENTS: EventRow[] = [
  {
    id: "e1",
    title: "Nordic Shuttle — ENGM wave",
    startUtc: "2026-05-11T18:00:00Z",
    participants: 48,
    server: "East US",
  },
  {
    id: "e2",
    title: "VATSIM Cross the Pond",
    startUtc: "2026-05-17T22:00:00Z",
    participants: 1204,
    server: "VATSIM",
  },
];

export function getPilot(handle: string): Pilot | null {
  const h = handle.trim().toLowerCase();
  return PILOTS[h] ?? null;
}

export function getAircraft(id: string): Aircraft | null {
  return AIRCRAFT[id] ?? null;
}
