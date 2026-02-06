import { useCallback, RefObject } from "react";
import { toPng } from "html-to-image";
import stratviewLogoWhite from "@/assets/stratview-logo-white.png";

const EXPORT_WIDTH = 1920;
const EXPORT_HEIGHT = 1080;
const FOOTER_HEIGHT = 60;
const BG_COLOR = "#0a0f1a";

export function useChartDownload() {
  const downloadChart = useCallback(
    async (ref: RefObject<HTMLDivElement>, filename: string) => {
      if (!ref.current) return;

      try {
        const chartDataUrl = await toPng(ref.current, {
          backgroundColor: BG_COLOR,
          quality: 1,
          pixelRatio: 3,
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = EXPORT_WIDTH;
        canvas.height = EXPORT_HEIGHT;

        // Background
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

        // Draw chart in top area (above footer)
        const chartImg = new Image();
        chartImg.src = chartDataUrl;
        await new Promise((resolve) => { chartImg.onload = resolve; });

        const chartAreaHeight = EXPORT_HEIGHT - FOOTER_HEIGHT;
        const scale = Math.min(EXPORT_WIDTH / chartImg.width, chartAreaHeight / chartImg.height);
        const drawW = chartImg.width * scale;
        const drawH = chartImg.height * scale;
        const drawX = (EXPORT_WIDTH - drawW) / 2;
        const drawY = (chartAreaHeight - drawH) / 2;
        ctx.drawImage(chartImg, drawX, drawY, drawW, drawH);

        // Footer bar
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(0, EXPORT_HEIGHT - FOOTER_HEIGHT, EXPORT_WIDTH, FOOTER_HEIGHT);

        // Logo in footer-left
        const logoImg = new Image();
        logoImg.src = stratviewLogoWhite;
        await new Promise((resolve) => { logoImg.onload = resolve; });

        const logoH = 30;
        const logoW = (logoImg.width / logoImg.height) * logoH;
        const logoY = EXPORT_HEIGHT - FOOTER_HEIGHT + (FOOTER_HEIGHT - logoH) / 2;
        ctx.drawImage(logoImg, 24, logoY, logoW, logoH);

        // URL in footer-right
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "14px system-ui, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("stratviewresearch.com", EXPORT_WIDTH - 24, EXPORT_HEIGHT - FOOTER_HEIGHT + (FOOTER_HEIGHT + 10) / 2);

        const finalDataUrl = canvas.toDataURL("image/png", 1);
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = finalDataUrl;
        link.click();
      } catch (error) {
        console.error("Failed to download chart:", error);
      }
    },
    []
  );

  return { downloadChart };
}
