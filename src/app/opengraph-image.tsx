import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = "Gerald Baldoza — Game Developer | Unity, UE, Threejs | 2D/3D Games";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at 30% 20%, #10283a 0%, #0a0b12 55%), #0a0b12",
          color: "#eef3f7",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(121,232,208,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(121,232,208,0.06) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div style={{ fontSize: 24, letterSpacing: 10, color: "#79E8D0", textTransform: "uppercase" }}>
          {profile.name}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 84,
            fontWeight: 900,
            lineHeight: 1,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundImage: "linear-gradient(90deg, #79E8D0, #8E9EFF, #FF52B8)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          <span>BUILDING WORLDS.</span>
          <span>CRAFTING GAMEPLAY.</span>
        </div>
        <div style={{ marginTop: 36, fontSize: 26, color: "#ff8fd0", letterSpacing: 3 }}>{profile.headline}</div>
      </div>
    ),
    size,
  );
}
