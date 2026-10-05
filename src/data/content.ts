/**
 * All site copy, sourced from the client's current website (artattacktattoo.net).
 * Copy is lightly edited for flow — no invented facts, services, numbers or reviews.
 */

export type NavLink = { label: string; href: `#${string}` };

export type Service = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  body: string;
  /** Visual for the pinned services sequence (real shop photos). */
  image: { src: string; alt: string; credit: string; position?: string };
};

export type Highlight = { title: string; body: string; kicker: string };

export type Artist = {
  name: string;
  role: string;
  styles?: string[];
  bio?: string;
  note?: string;
  instagram: string;
  email?: string;
  /** Path in /public, omitted when the current site has no usable portrait. */
  portrait?: string;
  /** CSS object-position for the portrait crop (default centre). */
  portraitPosition?: string;
};

export type WorkItem = { src: string; artist: string; alt: string };

export type Policy = { title: string; body: string };

export type AftercareGuide = { title: string; steps: Policy[] };

export const site = {
  name: "Art Attack Tattoo",
  legalName: "Art Attack Tattoo LLC",
  url: "https://artattacktattoo.net",
  description:
    "Custom tattoos and body piercing in Winston-Salem, NC since 2008. Veteran-owned, health-department regulated, and consistently ranked among the best studios in the Triad.",
  founded: "2008-03-01",
} as const;

export const contact = {
  street: "3656 Reynolda Road",
  city: "Winston-Salem",
  region: "NC",
  postalCode: "27106",
  phoneDisplay: "(336) 924-INKU",
  phoneDigits: "(336) 924-4658",
  phoneHref: "tel:+13369244658",
  email: "artattacknc@gmail.com",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Art+Attack+Tattoo+3656+Reynolda+Rd+Winston-Salem+NC+27106",
  hours: [
    { days: "Tuesday – Saturday", time: "10am – 6pm" },
    { days: "Sunday & Monday", time: "Closed" },
  ],
  socials: [
    { label: "Instagram", handle: "@artattacktattoonc", href: "https://www.instagram.com/artattacktattoonc/" },
    { label: "Facebook", handle: "/ArtAttackTattoo", href: "https://www.facebook.com/ArtAttackTattoo" },
  ],
} as const;

export const nav: NavLink[] = [
  { label: "Studio", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Artists", href: "#artists" },
  { label: "Work", href: "#work" },
  { label: "Booking", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Electric Tattooing · Winston-Salem, NC · Est. 2008",
  headline: ["Not your", "typical", "tattoo studio."],
  sub: "Custom tattoos and body piercing in a clean, inviting, friendly studio, serving the Triad and beyond since March 1st, 2008.",
  primaryCta: { label: "Book a free consult", href: "#booking" },
  secondaryCta: { label: "See the work", href: "#work" },
};

export const about = {
  kicker: "01 — The Studio",
  title: "Your experience matters as much as your ink.",
  paragraphs: [
    "Art Attack Tattoo opened its doors on March 1st, 2008, and has been serving the Triad and beyond ever since. Our shop consistently ranks as one of the best tattoo studios in the Triad.",
    "We believe our customers are our most important asset, and we treat you that way. Whether it's your first tattoo or one of many, we work to make it comfortable and memorable.",
    "One of our talented artists will gladly consult with you on your design, or custom-draw one from your own ideas.",
  ],
  facts: [
    { label: "Doors opened", value: "03.01.2008" },
    { label: "Regulated by", value: "Forsyth County Health Dept." },
    { label: "Ownership", value: "U.S. Army Veteran" },
  ],
  owner: {
    name: "Marc Rainville",
    role: "Shop Owner",
    summary: "Art Attack is owned by Marc Rainville, a semi-retired U.S. Army veteran who specializes in realism, Polynesian and portrait tattooing.",
    cta: "Meet Marc and the crew",
  },
};

export const services: Service[] = [
  {
    id: "custom",
    index: "01",
    title: "Custom Tattoos",
    tagline: "Drawn from your ideas",
    body: "Our artists design with you, or draw a custom piece from your own ideas. We don't charge extra for custom designs unless the piece is rather large.",
    image: { src: "/images/work/ayla-1.webp", alt: "Red cardinal tattoo in flight", credit: "Tattoo by Ayla Matthews" },
  },
  {
    id: "piercing",
    index: "02",
    title: "Body Piercing",
    tagline: "Precise, clean, comfortable",
    body: "Our full-time piercer, Lee, started her piercing journey right here in 2015. She's fabulous with children, fluent in Spanish, and one of the sweetest people you'll ever meet.",
    image: { src: "/images/work/lee-11.webp", alt: "Ear piercing with a close-up of the jewelry", credit: "Piercing by Lee Leal" },
  },
  {
    id: "consult",
    index: "03",
    title: "Free Consultations",
    tagline: "Every piece starts here",
    body: "A consultation sets your appointment length and gives you an accurate price quote. They're free, and in-person consults need no appointment. Just stop by during business hours.",
    image: {
      src: "/images/shop/panorama.webp",
      alt: "The Art Attack Tattoo lobby, where walk-in consultations happen",
      credit: "The studio · 3656 Reynolda Road",
      position: "38% 50%",
    },
  },
  {
    id: "coverups",
    index: "04",
    title: "Cover-ups & Large Scale",
    tagline: "Sleeves, halves, quarters",
    body: "Full, half and quarter sleeves and cover-up tattoos are planned in person, so your artist can see the canvas and plan the piece properly.",
    image: { src: "/images/work/houston-1.webp", alt: "Red and black floral sleeve tattoo", credit: "Sleeve by Houston Black" },
  },
];

export const highlights = {
  kicker: "03 — Why Art Attack",
  title: "Clean. Comfortable. Committed.",
  items: [
    {
      kicker: "Clean & sterile",
      title: "Health-department regulated",
      body: "Art Attack is regulated by the Forsyth County Health Department, so you're tattooed in a clean, sterile environment. Customers often comment on how clean our studio is.",
    },
    {
      kicker: "Since 2008",
      title: "A Triad institution",
      body: "Open since March 1st, 2008, and consistently ranked one of the best tattoo studios in the Triad.",
    },
    {
      kicker: "Veteran owned",
      title: "Built on service",
      body: "Founded by U.S. Army veteran Marc Rainville and proudly listed as a Veteran Owned Business.",
    },
    {
      kicker: "No upcharge",
      title: "Custom at no extra cost",
      body: "We don't charge extra for custom designs unless the piece is rather large.",
    },
    {
      kicker: "Your comfort",
      title: "Private rooms",
      body: "Privacy rooms are available. For placements within the tan line, we suggest loose clothing or a bathing suit.",
    },
    {
      kicker: "Walk-ins welcome",
      title: "When time allows",
      body: "We prefer appointments but will take walk-ins if the time is available. Call the shop to check walk-in availability.",
    },
  ] satisfies Highlight[],
  quote: {
    text: "The bitterness of poor quality is remembered long after the sweetness of a cheap price is forgotten.",
    tag: "Cheap tattoos aren't good, and good tattoos aren't cheap.",
  },
};

export const artists: Artist[] = [
  {
    name: "Marc Rainville",
    role: "Shop Owner",
    styles: ["Realism", "Polynesian", "Portrait"],
    bio: "Marc owns the shop and is a semi-retired U.S. Army veteran. He lives on the NC coast and currently works at Hardwire Tattoo in downtown Wilmington, NC.",
    note: "Want to plan a trip to get tattooed by him? Contact him directly by email.",
    instagram: "marcrtattoos",
    email: "marcrtattoos@gmail.com",
    portrait: "/images/portraits/marc.webp",
    portraitPosition: "30% 35%",
  },
  {
    name: "Lee Leal",
    role: "Shop Manager · Piercer",
    bio: "Our full-time body piercer and manager. Her piercing journey started right here in March 2015, and she caught on faster than anyone we've ever seen. Great with children and fluent in Spanish.",
    instagram: "piercings.by.lee",
    portrait: "/images/portraits/lee.webp",
  },
  {
    name: "Jennifer Fowler",
    role: "Artist",
    styles: ["Neo Traditional", "Realism", "Cover-ups"],
    bio: "U.S. Navy veteran who apprenticed here under Marc in 2013. Her acrylic-painting background shows in the color theory of every tattoo. Some call her a jack of all trades, others “The Coverup Queen.”",
    note: "New clients: waitlist about 3 months. Message her on Instagram to join.",
    instagram: "jen_ink",
    portrait: "/images/portraits/jennifer.webp",
  },
  {
    name: "Houston Black",
    role: "Artist",
    styles: ["Black & Gray Realism", "Neo Traditional", "Trash Polka"],
    bio: "Tattooing across North Carolina since 2009, and back at Art Attack after working with us from 2015–2018. “I give everyone I tattoo a tiny bit of my soul.”",
    instagram: "lazerlettucetattoo",
    portrait: "/images/portraits/houston.webp",
  },
  {
    name: "Dale Conboy",
    role: "Artist",
    styles: ["Freehand"],
    bio: "26+ years of experience tattooing all over the US. Almost all of his tattoos are done freehand, and that speaks volumes.",
    instagram: "daleconboytattoos",
    portrait: "/images/portraits/dale.webp",
  },
  {
    name: "Ayla Matthews",
    role: "Artist",
    bio: "Started tattooing in 2021 in California before joining our family in North Carolina. No tattoo too small or too big. “If you want a tattoo, come by and ask for me. I'm ready to go.”",
    instagram: "ayla_inks",
    portrait: "/images/portraits/ayla.webp",
  },
  {
    name: "Jordan Mitchell",
    role: "Artist",
    instagram: "jdmitchell.tattoo",
  },
];

/** Each artist's gallery on the current site holds 15 pieces. */
const GALLERY_SIZE = 15;

/** Build a full gallery; the first pieces carry hand-written descriptions. */
const workBy = (artist: string, slug: string, described: string[], noun = "Tattoo"): WorkItem[] =>
  Array.from({ length: GALLERY_SIZE }, (_, i) => ({
    src: `/images/work/${slug}-${i + 1}.webp`,
    artist,
    alt: described[i] ?? `${noun} by ${artist}, piece ${i + 1} of ${GALLERY_SIZE}`,
  }));

export type Gallery = {
  /** URL-safe id, also used for the Work section tabs. */
  id: string;
  artist: string;
  kind: "tattoo" | "piercing";
  items: WorkItem[];
};

/** Full portfolio of every artist, from their galleries on the current site. */
export const galleries: Gallery[] = [
  {
    id: "ayla",
    artist: "Ayla Matthews",
    kind: "tattoo",
    items: workBy("Ayla Matthews", "ayla", [
      "Red cardinal tattoo in flight",
      "Fine-line pomegranate and leaves tattoo",
      "Cartoon character tattoos on forearm",
      "Black and gray skull tattoo",
      "Matching red rose and raven tattoos",
    ]),
  },
  {
    id: "dale",
    artist: "Dale Conboy",
    kind: "tattoo",
    items: workBy("Dale Conboy", "dale", [
      "Color skull tattoo with geometric frame",
      "Bull skull and flowers color tattoo",
      "Watercolor orca whale tattoo",
      "Pink rose tattoo with geometric linework",
      "Colorful galaxy sleeve tattoo",
    ]),
  },
  {
    id: "houston",
    artist: "Houston Black",
    kind: "tattoo",
    items: workBy("Houston Black", "houston", [
      "Red and black floral sleeve tattoo",
      "Large red peony tattoo",
      "Japanese-inspired back piece in progress",
      "Neo-traditional flower tattoo",
      "Native headdress portrait tattoo",
    ]),
  },
  {
    id: "jennifer",
    artist: "Jennifer Fowler",
    kind: "tattoo",
    items: workBy("Jennifer Fowler", "jennifer", [
      "Realistic portrait tattoo",
      "Fine-line lavender sprig tattoo",
      "Watercolor paw print tattoos",
      "Sun and moon color tattoo",
      "Realistic boxer dog portrait tattoo",
    ]),
  },
  {
    id: "jordan",
    artist: "Jordan Mitchell",
    kind: "tattoo",
    items: workBy("Jordan Mitchell", "jordan", [
      "Illustrative hand tattoo with red ribbon",
      "Orange salamander tattoo labeled N. viridescens",
      "Blackwork cherry blossom tattoo",
      "Fine-line swallow tattoo on ribs",
      "Surreal staircase and lightning tattoo",
    ]),
  },
  {
    id: "lee",
    artist: "Lee Leal",
    kind: "piercing",
    items: workBy("Lee Leal", "lee", [], "Body piercing"),
  },
];

export const galleryFor = (artist: string) => galleries.find((g) => g.artist === artist);

/** All tattoo pieces (piercings live in their own gallery). */
export const work: WorkItem[] = galleries.filter((g) => g.kind === "tattoo").flatMap((g) => g.items);

export const piercingWork: WorkItem[] = galleryFor("Lee Leal")!.items.slice(0, 5);

export const booking = {
  kicker: "05 — Booking",
  title: "From idea to appointment.",
  intro:
    "Consultations are needed before an appointment can be made. They're free, and our artists prefer them in person, though they can consult online through their business Instagram accounts.",
  steps: [
    {
      title: "Consult (free)",
      body: "Stop by Tues–Sat, 10am–6pm. No appointment needed. Large-scale work and cover-ups require an in-person consult.",
    },
    {
      title: "Deposit",
      body: "A non-refundable cash deposit is required when an appointment is booked. No appointments are made without one.",
    },
    {
      title: "Get tattooed",
      body: "Book in person at the shop or message your artist directly on Instagram. Schedules fill days, sometimes weeks, ahead, especially weekends.",
    },
  ],
  policies: [
    {
      title: "Bring a photo ID",
      body: "North Carolina requires you to be 18 or older to be tattooed, with a valid ID. A parent cannot sign consent for a minor to be tattooed. Forget your ID, forget your tattoo.",
    },
    {
      title: "Piercing minors",
      body: "Under 18? A parent or legal guardian with valid ID must be present and provide proof of guardianship (birth certificate, insurance card with both names, or the minor's permit/ID with matching last name and/or address). Piercing a minor is at the piercer's discretion.",
    },
    {
      title: "No drugs or alcohol",
      body: "No smoking, drugs or alcohol in our studio, ever. It is illegal for us to tattoo or pierce anyone under the influence. No exceptions.",
    },
    {
      title: "Sun & water",
      body: "Finish your sun and water activities first: no direct sunlight or swimming for 2 weeks on a new tattoo. If you're sunburned, even a little, we won't tattoo you.",
    },
    {
      title: "Eat well, be rested",
      body: "It's no fun to do anything on an empty stomach or a hangover. Wear loose clothing, and try not to wear white.",
    },
    {
      title: "Feeling sick? Reschedule",
      body: "If you're sick, please stay home and reschedule. We'll ask anyone who seems unwell to come back another time.",
    },
  ] satisfies Policy[],
  tagline: "They're permanent. Think before you ink.",
};

export const aftercare: AftercareGuide[] = [
  {
    title: "Tattoo aftercare",
    steps: [
      {
        title: "Leave that bandage alone",
        body: "Keep it on for 1–4 hours. It protects your fresh tattoo, which is still a wound, from airborne bacteria.",
      },
      {
        title: "Wash and treat",
        body: "With clean hands, gently wash with warm water and mild liquid antibacterial soap (no bar soap, no washcloth). Pat dry with a clean towel. Repeat 3–6 times a day for the first 3 days, with a light coat of ointment such as Aquaphor, then switch to unscented lotion. Do not use Neosporin or triple antibiotic ointments.",
      },
      {
        title: "Shower, don't soak",
        body: "Showering is fine. Avoid baths, hot tubs, pools, lakes and the ocean for at least 2 weeks.",
      },
      {
        title: "Don't pick, don't scratch",
        body: "Peeling and itching are normal as it heals. If it itches, gently slap it; if it peels, apply lotion.",
      },
      {
        title: "Protect it from the sun",
        body: "Once healed, use SPF 30+ sunblock to keep your tattoo vibrant for years.",
      },
    ],
  },
  {
    title: "Piercing aftercare",
    steps: [
      {
        title: "Leave your piercing alone",
        body: "Avoid touching, twisting or moving your jewelry, picking at scabs, snagging it, or sleeping on it. Irritation prolongs healing and can cause bumps.",
      },
      {
        title: "Clean with saline",
        body: "Spray sea salt or saline solution on the piercing 2–3 times a day and let it air dry. Skip Q-tips and cotton balls.",
      },
      {
        title: "Optional: anti-inflammatory",
        body: "Ibuprofen or Aleve can reduce swelling and soreness for 3 days to a week.",
      },
    ],
  },
];

export const aftercareNote =
  "Problems, questions or concerns? Contact your artist or piercer, not your friends. We do this every day; they don't.";

export const contactSection = {
  kicker: "06 — Visit",
  title: ["Stop by.", "We'll be glad", "you did."],
  body: "Stop by Art Attack Tattoo for your next tattoo or body piercing. In-person consultations need no appointment.",
};

export const footer = {
  tagline: "Think before you ink.",
  credit: "Veteran Owned Business",
};

/** Portfolio pieces interleaved by artist, for the 3D carousel / grid. */
export function getFeaturedWork(count: number): WorkItem[] {
  const byArtist = new Map<string, WorkItem[]>();
  for (const w of work) byArtist.set(w.artist, [...(byArtist.get(w.artist) ?? []), w]);
  const lists = [...byArtist.values()];
  const out: WorkItem[] = [];
  for (let k = 0; out.length < count && k < 10; k++) {
    for (const list of lists) if (list[k] && out.length < count) out.push(list[k]);
  }
  return out;
}

export const WORK_COUNT = { desktop: 12, mobile: 8 } as const;

export const FEATURED = "featured";

/** Items for the Work section's current selection. */
export function getWorkItems(selection: string, isMobile: boolean): WorkItem[] {
  const gallery = galleries.find((g) => g.id === selection);
  return gallery ? gallery.items : getFeaturedWork(isMobile ? WORK_COUNT.mobile : WORK_COUNT.desktop);
}
