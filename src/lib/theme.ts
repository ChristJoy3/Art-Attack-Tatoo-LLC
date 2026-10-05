/**
 * Brand palette — single source of truth.
 * The same values are mirrored as CSS variables in `app/globals.css`
 * (keep both in sync). The 3D scene imports these directly so materials,
 * lights and fog match the DOM exactly.
 *
 *  - ink:      the logo's black field (logo.png background is ~#020001)
 *  - bone:     the logo's white engraving, warmed like old etching paper
 *  - electric: accent from the red "TATTOO" storefront lettering and the
 *              word "Electric" in the logo — used sparingly
 */
export const palette = {
  ink: "#020202",
  bone: "#EDE8DF",
  electric: "#E0262B",
} as const;

export type PaletteKey = keyof typeof palette;
