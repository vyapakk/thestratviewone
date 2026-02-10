import { useState } from "react";
import { BarChart3, Table2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ChartTableViewToggleProps {
  view: "chart" | "table";
  onViewChange: (view: "chart" | "table") => void;
}

export function ChartTableViewToggle({ view, onViewChange }: ChartTableViewToggleProps) {
  return (
    <div className="flex items-center rounded-lg border border-border bg-secondary/50 p-0.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onViewChange("chart")}
        className={`h-7 w-7 ${
          view === "chart"
            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Chart view"
      >
        <BarChart3 className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onViewChange("table")}
        className={`h-7 w-7 ${
          view === "table"
            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Table view"
      >
        <Table2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function AnimatedViewSwitch({ view, chart, table }: { view: "chart" | "table"; chart: React.ReactNode; table: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      {view === "chart" ? (
        <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {chart}
        </motion.div>
      ) : (
        <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {table}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DataTableProps {
  headers: string[];
  rows: (string | number)[][];
}

export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            {headers.map((header, i) => (
              <th
                key={i}
                className={`px-4 sm:px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground ${
                  i === 0 ? "text-left" : "text-right"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-secondary/20 transition-colors">
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className={`px-4 sm:px-6 py-3 text-sm ${
                    cellIdx === 0
                      ? "text-left font-medium text-foreground"
                      : "text-right font-mono text-muted-foreground"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
