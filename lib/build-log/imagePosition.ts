import type { CSSProperties } from "react";

/**
 * CSS object-position value for cropped build-log images.
 * Examples: "center", "top", "bottom", "left", "50% 25%", "center top"
 */
export type BuildLogImagePosition = string;

export function buildLogImagePositionStyle(
  position?: BuildLogImagePosition,
): CSSProperties | undefined {
  if (!position) {
    return undefined;
  }

  return { objectPosition: position };
}
