/**
 * Lighting presets for the Storm hero viewer.
 *
 * Two looks are kept side by side so they can be A/B'd without re-implementing:
 *
 *  - `studio`      — dark product-shot stage. Near-black field, strong cool
 *                    back-rim for a silhouette edge, dim front-below fill, and
 *                    a low accent-red graze as the brand touch.
 *  - `atmospheric` — the same shaping, softened, plus depth haze and a slow
 *                    dust drift so distance reads as air rather than falloff.
 *
 * The CSS field behind the canvas belongs to the preset too (the canvas is
 * alpha, so the DOM background *is* the scene background).
 */
export type LightingPreset = "studio" | "atmospheric";

export const DEFAULT_LIGHTING_PRESET: LightingPreset = "studio";

export function isLightingPreset(value: string | null): value is LightingPreset {
  return value === "studio" || value === "atmospheric";
}

export const PRESET_BACKGROUNDS: Record<LightingPreset, string> = {
  // Near-black studio wall. The only lift is a soft pool just behind the
  // subject — enough to read as a lit backdrop, gone well before the corners.
  studio: [
    "radial-gradient(48% 42% at 56% 40%, rgba(44,56,120,0.52) 0%, rgba(18,23,60,0.22) 48%, rgba(5,6,18,0) 76%)",
    "radial-gradient(120% 110% at 56% 40%, #0B0E24 0%, #07091C 46%, #050612 72%, #030409 100%)",
  ].join(", "),
  // Same field, hazier: the center pool is wider and cooler so the depth fog
  // has something to fade into instead of hitting flat black.
  atmospheric: [
    "radial-gradient(62% 56% at 54% 44%, rgba(46,60,126,0.40) 0%, rgba(20,26,70,0.22) 52%, rgba(6,8,24,0) 82%)",
    "radial-gradient(130% 120% at 54% 42%, #0B0F28 0%, #080B20 48%, #050714 76%, #02030A 100%)",
  ].join(", "),
};

/** Depth-haze colour for the `atmospheric` preset, matched to its backdrop. */
export const ATMOSPHERIC_FOG_COLOR = "#080B20";
