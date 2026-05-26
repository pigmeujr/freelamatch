import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d9488",
          borderRadius: "8px",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: "bold",
          color: "white",
          fontFamily: "sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        FM
      </div>
    ),
    size,
  );
}
