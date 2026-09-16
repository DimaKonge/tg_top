import type { CSSProperties } from "react";
import { THEME_BACKGROUND_OPTIONS } from "@/contexts/ThemeContext";

export function getCommunityCardBackgroundStyle(
  preset?: string | null,
  variant: "hero" | "surface" | "raised" = "hero"
): CSSProperties | undefined {
  if (!preset) return undefined;
  const palette = THEME_BACKGROUND_OPTIONS.find(item => item.value === preset);
  if (!palette) return undefined;

  const isWhite = preset === "ivory_white";
  if (isWhite) {
    return {
      "--tg-community-card-bg": "#ffffff",
      "--tg-community-card-surface": "#ffffff",
      "--tg-community-card-accent": "#0f172a",
      backgroundColor: "#ffffff",
      backgroundImage: variant === "hero" ? "linear-gradient(145deg, #ffffff, #f1f4f9)" : "none",
      borderColor: "rgba(0, 0, 0, 0.14)",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
      color: "#0f172a",
    } as CSSProperties;
  }

  const surfaceBg =
    variant === "hero"
      ? `radial-gradient(circle at 85% 15%, color-mix(in srgb, ${palette.accent} 45%, transparent), transparent 70%), linear-gradient(150deg, color-mix(in srgb, ${palette.color} 70%, ${palette.accent} 30%), ${palette.color})`
      : variant === "raised"
      ? `linear-gradient(145deg, color-mix(in srgb, ${palette.color} 76%, ${palette.accent} 24%), color-mix(in srgb, ${palette.color} 88%, #0f1725))`
      : `linear-gradient(150deg, color-mix(in srgb, ${palette.color} 84%, #121c2d), color-mix(in srgb, ${palette.color} 92%, #0a111c))`;

  const borderColor = `color-mix(in srgb, ${palette.accent} 58%, transparent)`;
  const shadowColor = `color-mix(in srgb, ${palette.accent} 26%, transparent)`;

  return {
    "--tg-community-card-bg": palette.color,
    "--tg-community-card-surface": `color-mix(in srgb, ${palette.color} 84%, #121c2d)`,
    "--tg-community-card-accent": palette.accent,
    backgroundColor: palette.color,
    background: surfaceBg,
    borderColor,
    boxShadow: `0 4px 20px ${shadowColor}`,
  } as CSSProperties;
}

