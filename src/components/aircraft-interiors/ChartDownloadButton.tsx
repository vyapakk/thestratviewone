import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChartDownloadButtonProps {
  onClick: () => void;
  className?: string;
}

export function ChartDownloadButton({ onClick, className }: ChartDownloadButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`h-8 w-8 text-muted-foreground hover:text-foreground ${className}`}
      title="Download chart as PNG"
    >
      <Download className="h-4 w-4" />
    </Button>
  );
}
