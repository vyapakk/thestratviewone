import { useCallback, RefObject } from "react";
import { toPng } from "html-to-image";
import stratviewLogo from "@/assets/stratview-logo.png";

export function useChartDownload() {
  const downloadChart = useCallback(
    async (ref: RefObject<HTMLDivElement>, filename: string) => {
      if (!ref.current) return;

      try {
        const chartDataUrl = await toPng(ref.current, {
          backgroundColor: "#0a0f1a",
          quality: 1,
          pixelRatio: 2,
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const chartImg = new Image();
        chartImg.src = chartDataUrl;

        await new Promise((resolve) => {
          chartImg.onload = resolve;
        });

        canvas.width = chartImg.width;
        canvas.height = chartImg.height;
        ctx.drawImage(chartImg, 0, 0);

        const logoImg = new Image();
        logoImg.src = stratviewLogo;

        await new Promise((resolve) => {
          logoImg.onload = resolve;
        });

        const maxLogoWidth = 200;
        const logoScale = maxLogoWidth / logoImg.width;
        const logoWidth = maxLogoWidth;
        const logoHeight = logoImg.height * logoScale;

        const padding = 20;
        const logoX = canvas.width - logoWidth - padding;
        const logoY = canvas.height - logoHeight - padding;

        ctx.fillStyle = "rgba(10, 15, 26, 0.7)";
        ctx.fillRect(logoX - 10, logoY - 10, logoWidth + 20, logoHeight + 20);
        ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.font = "bold 16px system-ui, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("stratviewresearch.com", canvas.width - padding, canvas.height - padding + 5);

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
