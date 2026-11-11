import { themeDefaults } from "./themes";
import type { Bundle, Design, Family, RsvpSettings, ThemeKey, Wedding, WeddingEvent } from "./types";
import { ALL_SECTIONS } from "./types";

export function defaultDesign(weddingId: string, theme: ThemeKey = "minimalist"): Design {
  return {
    wedding_id: weddingId,
    ...themeDefaults(theme),
    animation: "subtle",
    section_order: [...ALL_SECTIONS],
    hidden_sections: [],
    texts: {},
  };
}

export function defaultFamily(weddingId: string): Family {
  return {
    wedding_id: weddingId,
    bride_parents: "",
    groom_parents: "",
    grandparents: "",
    introduction: "",
    acknowledgements: "",
    hidden: false,
  };
}

export function defaultRsvp(weddingId: string): RsvpSettings {
  return {
    wedding_id: weddingId,
    enabled: true,
    deadline: null,
    ask_phone: true,
    ask_email: true,
    ask_dietary: true,
    ask_message: true,
    ask_events: true,
    max_attendees: 6,
    questions: [],
    whatsapp: "",
    email: "",
  };
}

export function names(w: Pick<Wedding, "bride_name" | "groom_name" | "bride_display" | "groom_display">) {
  const a = w.bride_display || w.bride_name.split(/\s+/)[0] || "";
  const b = w.groom_display || w.groom_name.split(/\s+/)[0] || "";
  return { a, b, both: a && b ? `${a} & ${b}` : a || b || "Our Wedding" };
}

export function initialsOf(w: Pick<Wedding, "initials" | "bride_name" | "groom_name" | "bride_display" | "groom_display">) {
  if (w.initials) return w.initials;
  const { a, b } = names(w);
  return [a[0], b[0]].filter(Boolean).join("").toUpperCase() || "♥";
}

/** Fictional couple used for the design gallery and the homepage preview. */
export function sampleBundle(theme: ThemeKey = "minimalist"): Bundle {
  const id = "sample";
  const wedding: Wedding = {
    id,
    owner_id: "",
    slug: "riya-and-rahul",
    status: "published",
    is_demo: false,
    bride_name: "Riya Mehta",
    groom_name: "Rahul Kapoor",
    bride_display: "Riya",
    groom_display: "Rahul",
    initials: "R&R",
    hashtag: "#RiyaWedsRahul",
    welcome_message:
      "Two families, one celebration. We would be honoured to have you with us as we begin our journey together — three days of music, colour, blessings and a great deal of food.",
    family_names: "The Mehta & Kapoor families",
    wedding_date: "2027-02-14",
    wedding_time: "18:30",
    city: "Udaipur",
    venue: "The Lake Palace Gardens",
    venue_address: "Lake Pichola, Udaipur, Rajasthan 313001",
    language: "en",
    timezone: "Asia/Kolkata",
    maps_url: "",
    travel: {
      airport: "Maharana Pratap Airport (UDR), 25 km — about 40 minutes by car",
      railway: "Udaipur City Railway Station, 6 km",
      hotels: "Rooms are held for our guests at The Lake View Residency and Aravali Courtyard.",
      parking: "Valet parking at the main gate for all events.",
      assistance: "Our travel desk will arrange airport pick-ups. Message Karan on +91 98765 43210.",
      accommodation: "Please share your arrival details by 20 January so we can arrange your stay.",
    },
    onboarding_step: 8,
    onboarding_done: true,
    published_at: null,
    created_at: "",
    updated_at: "",
  };
  const ev = (p: number, kind: string, name: string, date: string, start: string, end: string | null, venue: string, dress: string, description: string): WeddingEvent => ({
    id: `sample-${p}`,
    wedding_id: id,
    position: p,
    kind,
    name,
    event_date: date,
    start_time: start,
    end_time: end,
    venue,
    address: "Udaipur, Rajasthan",
    maps_url: "",
    dress_code: dress,
    description,
    illustration: "auto",
  });
  return {
    wedding,
    events: [
      ev(0, "mehendi", "Mehendi", "2027-02-12", "15:00", "19:00", "Courtyard of Flowers", "Greens and florals", "Henna, folk music and chai in the afternoon sun."),
      ev(1, "sangeet", "Sangeet", "2027-02-13", "19:30", "23:30", "The Durbar Hall", "Indo-western glam", "An evening of dance performances by both families."),
      ev(2, "ceremony", "Wedding Ceremony", "2027-02-14", "18:30", "21:00", "The Lake Palace Gardens", "Traditional Indian", "The pheras by the lake at sunset."),
      ev(3, "reception", "Reception", "2027-02-15", "20:00", null, "The Crystal Ballroom", "Formal evening wear", "Dinner and dancing with the newlyweds."),
    ],
    family: {
      wedding_id: id,
      bride_parents: "Mrs. Anjali & Mr. Sanjay Mehta",
      groom_parents: "Mrs. Kavita & Mr. Vikram Kapoor",
      grandparents: "Smt. Kamla Devi Mehta · Shri Harish Kapoor",
      introduction: "Our families met over a cup of tea and have not stopped talking since.",
      acknowledgements: "With love to everyone who travelled near and far to be with us.",
      hidden: false,
    },
    design: defaultDesign(id, theme),
    rsvp: { ...defaultRsvp(id), deadline: "2027-01-20", whatsapp: "+91 98765 43210" },
  };
}

/** An empty wedding, used for a new draft and as the base when reading a share link. */
export function blankBundle(theme: ThemeKey = "minimalist"): Bundle {
  const id = "local";
  return {
    wedding: {
      id, owner_id: "", slug: "", status: "draft", is_demo: false,
      bride_name: "", groom_name: "", bride_display: "", groom_display: "", initials: "", hashtag: "",
      welcome_message: "", family_names: "", wedding_date: null, wedding_time: null, city: "", venue: "",
      venue_address: "", language: "en", timezone: "Asia/Kolkata", maps_url: "", travel: {},
      onboarding_step: 1, onboarding_done: false, published_at: null, created_at: "", updated_at: "",
    },
    events: [],
    family: defaultFamily(id),
    design: defaultDesign(id, theme),
    rsvp: defaultRsvp(id),
  };
}
