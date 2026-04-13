import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: 32, md: 40, lg: 56 };

export function Avatar({ src, alt, fallback, size = "md" }: AvatarProps) {
  const px = sizeMap[size];
  const style: React.CSSProperties = {
    width: px,
    height: px,
    borderRadius: "50%",
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e2e8f0",
    fontSize: px * 0.4,
    fontWeight: 600,
    color: "#64748b",
  };

  if (src) {
    return <img src={src} alt={alt ?? ""} style={{ ...style, objectFit: "cover" }} />;
  }

  return <span style={style}>{fallback?.charAt(0).toUpperCase() ?? "?"}</span>;
}
