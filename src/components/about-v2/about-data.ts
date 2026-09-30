// Content for the About page. Fill in the [bracketed] placeholders; sections read from here.

export const EXPERIENCE = [
  { company: "Mesh.ai", role: "Lead Product Designer", years: "2022 – now", logo: "/mesh.jpg" },
  { company: "Hypersonix.ai", role: "Senior Product Designer", years: "2020 – 2022", logo: "/hypersonix.jpg" },
  { company: "Zealth", note: "exited to Findem.ai", role: "Product Designer", years: "2018 – 2020", logo: "/zealth.jpg" },
  { company: "Nearbuy.com", role: "Graphic Designer", years: "2017 – 2018", logo: "/nearbuy.jpg" },
  { company: "Lincode Labs", role: "Frontend Dev", years: "2017 – 2018", logo: "/lincodelabs.jpg" },
];

// Songs on repeat. `url` can be a Spotify or YouTube link.
export const SONGS: { title: string; artist: string; url?: string }[] = [
  { title: "[Song]", artist: "[Artist]" },
  { title: "[Song]", artist: "[Artist]" },
  { title: "[Song]", artist: "[Artist]" },
];

// Favourite moments inside songs, e.g. { time: "1:48", title: "Close to Home", artist: "Vienna Teng" }.
export const MOMENTS: { time: string; title: string; artist: string }[] = [
  { time: "[m:ss]", title: "[song]", artist: "[artist]" },
  { time: "[m:ss]", title: "[song]", artist: "[artist]" },
  { time: "[m:ss]", title: "[song]", artist: "[artist]" },
];

// The games from the footer collage.
export const GAMES: { title: string; when?: string }[] = [
  { title: "TMNT III: The Manhattan Project", when: "As a kid" },
  { title: "Contra", when: "As a kid" },
  { title: "Need for Speed II", when: "Middle school" },
  { title: "Call of Duty: Modern Warfare 2" },
  { title: "GTA V", when: "College" },
  { title: "Counter-Strike 2" },
  { title: "Overwatch", when: "College · played pro" },
  { title: "Red Dead Redemption 2", when: "College" },
];
