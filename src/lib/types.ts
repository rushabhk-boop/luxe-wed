export type Lang = "en" | "hi" | "gu";

export type Travel = {
  airport?: string;
  railway?: string;
  hotels?: string;
  parking?: string;
  assistance?: string;
  accommodation?: string;
};

export type Wedding = {
  id: string;
  owner_id: string;
  slug: string;
  status: "draft" | "published";
  is_demo: boolean;
  bride_name: string;
  groom_name: string;
  bride_display: string;
  groom_display: string;
  initials: string;
  hashtag: string;
  welcome_message: string;
  family_names: string;
  wedding_date: string | null;
  wedding_time: string | null;
  city: string;
  venue: string;
  venue_address: string;
  language: Lang;
  timezone: string;
  maps_url: string;
  travel: Travel;
  onboarding_step: number;
  onboarding_done: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type WeddingEvent = {
  id: string;
  wedding_id: string;
  position: number;
  kind: string;
  name: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  venue: string;
  address: string;
  maps_url: string;
  dress_code: string;
  description: string;
  illustration: string;
};

export type Family = {
  wedding_id: string;
  bride_parents: string;
  groom_parents: string;
  grandparents: string;
  introduction: string;
  acknowledgements: string;
  hidden: boolean;
};

export type SectionKey =
  | "welcome"
  | "events"
  | "countdown"
  | "families"
  | "location"
  | "travel"
  | "rsvp";

export type SectionTexts = Partial<Record<SectionKey | "closing" | "tagline", string>>;

export type Design = {
  wedding_id: string;
  theme: ThemeKey;
  palette: string;
  colors: { bg?: string; ink?: string; accent?: string };
  typography: string;
  layout: "centered" | "editorial";
  background: "plain" | "paper" | "pattern" | "wash";
  decorations: "none" | "minimal" | "ornate";
  animation: "none" | "subtle" | "elegant";
  section_order: SectionKey[];
  hidden_sections: SectionKey[];
  texts: SectionTexts;
};

export type RsvpQuestion = {
  id: string;
  label: string;
  type: "text" | "yesno";
  required: boolean;
};

export type RsvpSettings = {
  wedding_id: string;
  enabled: boolean;
  deadline: string | null;
  ask_phone: boolean;
  ask_email: boolean;
  ask_dietary: boolean;
  ask_message: boolean;
  ask_events: boolean;
  max_attendees: number;
  questions: RsvpQuestion[];
  /** RSVPs are sent to the couple here (no database): WhatsApp number with country code, and/or email. */
  whatsapp: string;
  email: string;
};

export type ThemeKey =
  | "minimalist"
  | "luxury"
  | "botanical"
  | "royal"
  | "editorial"
  | "celestial";

export type Bundle = {
  wedding: Wedding;
  events: WeddingEvent[];
  family: Family;
  design: Design;
  rsvp: RsvpSettings;
};

export const ALL_SECTIONS: SectionKey[] = [
  "welcome",
  "events",
  "countdown",
  "families",
  "location",
  "travel",
  "rsvp",
];
