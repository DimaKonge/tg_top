import type { CSSProperties } from "react";
import { THEME_BACKGROUND_OPTIONS } from "@/contexts/ThemeContext";

export function getCommunityCardBackgroundStyle(preset?: string | null): CSSProperties | undefined {
  if (!preset) return undefined;
  const palette = THEME_BACKGROUND_OPTIONS.find(item => item.value === preset);
  if (!palette) return undefined;

  const isWhite = preset === "ivory_white";

  return {
    "--tg-community-card-bg": palette.color,
    "--tg-community-card-accent": palette.accent,
    backgroundColor: palette.color,
    backgroundImage: isWhite
      ? `linear-gradient(145deg, #ffffff, #f1f4f9)`
      : `radial-gradient(circle at 90% 12%, color-mix(in srgb, ${palette.accent} 38%, transparent), transparent 65%), linear-gradient(150deg, color-mix(in srgb, ${palette.color} 68%, ${palette.accent} 32%), ${palette.color})`,
    borderColor: isWhite
      ? `rgba(0, 0, 0, 0.15)`
      : `color-mix(in srgb, ${palette.accent} 72%, white 12%)`,
    boxShadow: isWhite
      ? `0 4px 20px rgba(0, 0, 0, 0.08)`
      : `0 4px 24px color-mix(in srgb, ${palette.accent} 28%, transparent)`,
    color: isWhite ? "#0f172a" : undefined,
  } as CSSProperties;
}

