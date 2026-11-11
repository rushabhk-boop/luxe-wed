import {
  Bodoni_Moda,
  Cinzel,
  Cormorant_Garamond,
  Great_Vibes,
  Inter,
  Italiana,
  Jost,
  Manrope,
  Marcellus,
  Playfair_Display,
} from "next/font/google";

// Platform fonts (preloaded)
export const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--f-cormorant", display: "swap" });
export const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--f-jost", display: "swap" });

// Theme fonts (loaded when used)
export const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--f-playfair", display: "swap", preload: false });
export const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--f-bodoni", display: "swap", preload: false });
export const cinzel = Cinzel({ subsets: ["latin"], variable: "--f-cinzel", display: "swap", preload: false });
export const italiana = Italiana({ subsets: ["latin"], weight: "400", variable: "--f-italiana", display: "swap", preload: false });
export const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--f-marcellus", display: "swap", preload: false });
export const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--f-greatvibes", display: "swap", preload: false });
export const inter = Inter({ subsets: ["latin"], variable: "--f-inter", display: "swap", preload: false });
export const manrope = Manrope({ subsets: ["latin"], variable: "--f-manrope", display: "swap", preload: false });

export const fontVars = [cormorant, jost, playfair, bodoni, cinzel, italiana, marcellus, greatVibes, inter, manrope]
  .map((f) => f.variable)
  .join(" ");
