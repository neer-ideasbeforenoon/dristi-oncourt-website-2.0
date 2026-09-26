import { Inter, Noto_Sans_Malayalam } from "next/font/google";

/**
 * Portal typefaces. Inter is interface text. Georgia is a system face and is
 * named in oncourts-typography.css, not loaded here. Noto Sans Malayalam covers
 * the script neither of those faces has.
 *
 * Weights follow the portal roles: 400 body, 500 headings (the Malayalam
 * fallback; Georgia itself has no 500 face), 700 navigation and actions,
 * 800 eyebrows. `scripts/check-typography.mjs` requires these weights.
 */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--portal-font-inter",
  display: "swap",
});

export const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  weight: ["400", "500", "700", "800"],
  variable: "--portal-font-malayalam",
  display: "swap",
});

export const portalFontVariables = `${inter.variable} ${notoMalayalam.variable}`;
