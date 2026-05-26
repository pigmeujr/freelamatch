import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FreelaMatch — Vagas Freelancer por Cidade no Brasil";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "40px" }}>
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              width: "88px",
              height: "88px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: "bold",
              color: "#0f766e",
            }}
          >
            FM
          </div>
          <div style={{ color: "white", fontSize: "52px", fontWeight: "bold", letterSpacing: "-1px" }}>
            FreelaMatch
          </div>
        </div>
        <div
          style={{
            color: "white",
            fontSize: "38px",
            fontWeight: "600",
            textAlign: "center",
            lineHeight: "1.3",
            maxWidth: "800px",
          }}
        >
          Vagas Freelancer por Cidade no Brasil
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: "24px",
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          Conectando empresas e profissionais locais
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "48px",
          }}
        >
          {["Busca por cidade", "Cadastro gratuito", "Vagas verificadas"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "100px",
                padding: "12px 24px",
                color: "white",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
