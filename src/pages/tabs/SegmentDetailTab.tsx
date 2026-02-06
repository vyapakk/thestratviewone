import { DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { KPICard } from "@/components/aircraft-interiors/KPICard";
import { MarketTrendChart } from "@/components/aircraft-interiors/MarketTrendChart";
import { SegmentPieChart } from "@/components/aircraft-interiors/SegmentPieChart";
import { ComparisonTable } from "@/components/aircraft-interiors/ComparisonTable";
import { DrillDownModal } from "@/components/aircraft-interiors/DrillDownModal";
import { StackedBarChart } from "@/components/aircraft-interiors/StackedBarChart";
import { useDrillDown } from "@/hooks/useDrillDown";
import { YearlyData, SegmentData, MarketData, calculateCAGR } from "@/hooks/useMarketData";

type SegmentType = "overview" | "endUser" | "aircraft" | "region" | "application" | "equipment";

interface SegmentDetailTabProps {
  segmentType: SegmentType;
  segmentData: SegmentData[];
  totalMarket: YearlyData[];
  marketData: MarketData;
  title: string;
  selectedYear: number;
}

const SEGMENT_COLORS = [
  "hsl(192, 95%, 55%)", "hsl(38, 92%, 55%)", "hsl(262, 83%, 58%)",
  "hsl(142, 71%, 45%)", "hsl(346, 77%, 50%)", "hsl(199, 89%, 48%)",
  "hsl(28, 80%, 52%)", "hsl(180, 70%, 45%)",
];

export function SegmentDetailTab({ segmentType, segmentData, totalMarket, marketData, title, selectedYear }: SegmentDetailTabProps) {
  const { drillDownState, openDrillDown, closeDrillDown } = useDrillDown();

  const currentYearTotal = segmentData.reduce((sum, seg) => sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0), 0);
  const value2024Total = segmentData.reduce((sum, seg) => sum + (seg.data.find((d) => d.year === 2024)?.value ?? 0), 0);
  const value2034Total = segmentData.reduce((sum, seg) => sum + (seg.data.find((d) => d.year === 2034)?.value ?? 0), 0);
  const cagr = calculateCAGR(value2024Total, value2034Total, 10);

  const aircraftTypeNames = marketData.aircraftType.map((s) => s.name);
  const regionNames = marketData.region.map((s) => s.name);
  const applicationNames = marketData.application.map((s) => s.name);
  const equipmentNames = marketData.furnishedEquipment.map((s) => s.name);
  const endUserNames = ["OE", "Aftermarket"];

  const getAllCountries = (): SegmentData[] => {
    const allCountries: SegmentData[] = [];
    Object.values(marketData.countryDataByRegion).forEach((countries) => allCountries.push(...countries));
    return allCountries;
  };

  const getEndUserByAircraftTypeData = () => {
    if (!marketData.endUserByAircraftType) return [];
    return ["OE", "Aftermarket"].map((endUserKey) => {
      const segments = marketData.endUserByAircraftType[endUserKey] || [];
      const total = segments.reduce((sum, seg) => sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0), 0);
      return { name: endUserKey === "OE" ? "OE (Original Equipment)" : "Aftermarket", segments: segments.map((seg) => ({ name: seg.name, value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0, fullData: seg.data })), total };
    });
  };

  const getEndUserByRegionData = () => {
    if (!marketData.endUserByRegion) return [];
    return ["OE", "Aftermarket"].map((endUserKey) => {
      const segments = marketData.endUserByRegion[endUserKey] || [];
      const total = segments.reduce((sum, seg) => sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0), 0);
      return { name: endUserKey === "OE" ? "OE (Original Equipment)" : "Aftermarket", segments: segments.map((seg) => ({ name: seg.name, value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0, fullData: seg.data })), total };
    });
  };

  const getAircraftByRegionData = () => {
    if (!marketData.aircraftTypeByRegion) return [];
    return marketData.aircraftType.map((aircraft) => {
      const segments = marketData.aircraftTypeByRegion[aircraft.name] || [];
      const total = segments.reduce((sum, seg) => sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0), 0);
      return { name: aircraft.name, segments: segments.map((seg) => ({ name: seg.name, value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0, fullData: seg.data })), total };
    });
  };

  const getApplicationByRegionData = () => {
    if (!marketData.applicationByRegion) return [];
    return marketData.application.map((app) => {
      const segments = marketData.applicationByRegion[app.name] || [];
      const total = segments.reduce((sum, seg) => sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0), 0);
      return { name: app.name, segments: segments.map((seg) => ({ name: seg.name, value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0, fullData: seg.data })), total };
    });
  };

  const getEquipmentByRegionData = () => {
    if (!marketData.equipmentByRegion) return [];
    return marketData.furnishedEquipment.map((equip) => {
      const shortName = equip.name.includes("BFE") ? "BFE" : "SFE";
      const segments = marketData.equipmentByRegion[shortName] || [];
      const total = segments.reduce((sum, seg) => sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0), 0);
      return { name: equip.name, segments: segments.map((seg) => ({ name: seg.name, value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0, fullData: seg.data })), total };
    });
  };

  const aircraftTypeStackedData = segmentType === "endUser" ? getEndUserByAircraftTypeData() : [];
  const regionStackedDataForEndUser = segmentType === "endUser" ? getEndUserByRegionData() : [];
  const aircraftByRegionData = segmentType === "aircraft" ? getAircraftByRegionData() : [];
  const applicationByRegionData = segmentType === "application" ? getApplicationByRegionData() : [];
  const equipmentByRegionData = segmentType === "equipment" ? getEquipmentByRegionData() : [];
  const allCountries = segmentType === "region" ? getAllCountries() : [];

  const handlePieSegmentClick = (segmentName: string, data: YearlyData[], color: string) => openDrillDown(segmentName, data, color, undefined);
  const handleTrendSegmentClick = (segmentName: string, data: YearlyData[], color: string) => openDrillDown(segmentName, data, color, undefined);
  const handleTableRowClick = (segmentName: string, data: YearlyData[], color: string) => openDrillDown(segmentName, data, color, undefined);

  const handleStackedBarClick = (endUserType: string, segmentName: string, _value: number, fullData?: YearlyData[]) => {
    const allNames = [...aircraftTypeNames, ...regionNames, ...applicationNames, ...equipmentNames, ...endUserNames];
    const idx = allNames.indexOf(segmentName);
    const color = SEGMENT_COLORS[idx % SEGMENT_COLORS.length] || "hsl(192, 95%, 55%)";
    if (fullData) openDrillDown(`${segmentName} (${endUserType})`, fullData, color, undefined);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MarketTrendChart data={totalMarket} segments={segmentData} title={`${title} - Market Trend`} subtitle="Historical and forecast data (US$ Millions) - Click legend to drill down" showSegments onSegmentClick={handleTrendSegmentClick} />
        </div>
        <SegmentPieChart data={segmentData} year={selectedYear} title={title} onSegmentClick={handlePieSegmentClick} />
      </div>

      {segmentType === "region" && allCountries.length > 0 && (
        <MarketTrendChart data={totalMarket} segments={allCountries} title="Countries - Market Trend" subtitle="All countries historical and forecast data (US$ Millions)" showSegments onSegmentClick={handleTrendSegmentClick} />
      )}

      {segmentType === "endUser" && (
        <>
          <StackedBarChart data={aircraftTypeStackedData} year={selectedYear} title="OE vs Aftermarket by Aircraft Type" segmentColors={SEGMENT_COLORS} segmentNames={aircraftTypeNames} onSegmentClick={handleStackedBarClick} />
          <StackedBarChart data={regionStackedDataForEndUser} year={selectedYear} title="OE vs Aftermarket by Region" segmentColors={SEGMENT_COLORS} segmentNames={regionNames} onSegmentClick={handleStackedBarClick} />
        </>
      )}

      {segmentType === "aircraft" && (
        <StackedBarChart data={aircraftByRegionData} year={selectedYear} title="Aircraft Type by Region" segmentColors={SEGMENT_COLORS} segmentNames={regionNames} onSegmentClick={handleStackedBarClick} />
      )}

      {segmentType === "application" && (
        <StackedBarChart data={applicationByRegionData} year={selectedYear} title="Applications by Region" segmentColors={SEGMENT_COLORS} segmentNames={regionNames} onSegmentClick={handleStackedBarClick} />
      )}

      {segmentType === "equipment" && (
        <StackedBarChart data={equipmentByRegionData} year={selectedYear} title="Equipment Type by Region" segmentColors={SEGMENT_COLORS} segmentNames={regionNames} onSegmentClick={handleStackedBarClick} />
      )}

      <ComparisonTable data={segmentData} startYear={2024} endYear={2034} title={`${title} - Growth Analysis`} onRowClick={handleTableRowClick} />
      <DrillDownModal isOpen={drillDownState.isOpen} onClose={closeDrillDown} segmentName={drillDownState.segmentName} segmentData={drillDownState.segmentData} color={drillDownState.color} />
    </div>
  );
}
