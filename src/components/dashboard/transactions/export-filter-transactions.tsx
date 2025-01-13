import React, { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Clock, Download, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/base/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/base/dialog';
import { Button } from '@/components/ui/base/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/base/radio-group';
import { Label } from '@/components/ui/base/label';
import type { DateRange } from "react-day-picker";

interface ExportFilterModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (dateRange: DateRange | undefined, timezone: string) => void;
}

const ExportFilterModal = ({ open, onClose, onExport }: ExportFilterModalProps) => {
  const [timezone, setTimezone] = useState<"GMT+2" | "UTC">("GMT+2");
  const [dateRange, setDateRange] = useState<string>("today");
  const [isLoading, setIsLoading] = useState(false);
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);

  // Calculate date ranges
  const today = new Date();
  const dateRanges = [
    {
      id: "today",
      label: "Today",
      date: format(today, "MMM d"),
      getRange: (): DateRange => ({
        from: today,
        to: today,
      }),
    },
    {
      id: "currentMonth",
      label: "Current month",
      date: `${format(startOfMonth(today), "MMM d")}–${format(today, "MMM d")}`,
      getRange: (): DateRange => ({
        from: startOfMonth(today),
        to: today,
      }),
    },
    {
      id: "last7days",
      label: "Last 7 days",
      date: `${format(subDays(today, 7), "MMM d")}–${format(today, "MMM d")}`,
      getRange: (): DateRange => ({
        from: subDays(today, 7),
        to: today,
      }),
    },
    {
      id: "lastMonth",
      label: "Last month",
      date: `${format(startOfMonth(subMonths(today, 1)), "MMM d")}–${format(
        endOfMonth(subMonths(today, 1)),
        "MMM d"
      )}`,
      getRange: (): DateRange => ({
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
      }),
    },
    {
      id: "all",
      label: "All",
      date: "",
      getRange: (): DateRange => ({
        from: undefined,
        to: undefined,
      }),
    },
    {
      id: "custom",
      label: "Custom",
      date: customRange?.from && customRange?.to
        ? `${format(customRange.from, "MMM d")}–${format(customRange.to, "MMM d")}`
        : "",
      getRange: (): DateRange | undefined => customRange,
    },
  ];

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const selectedRange = dateRanges.find((r) => r.id === dateRange)?.getRange();
      await onExport(selectedRange, timezone);
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] flex flex-col bg-white rounded-xl">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <Download className="w-5 h-5 text-blue-600" />
            Export Transactions
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Time zone section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Time Zone
              </h3>
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <RadioGroup
                  defaultValue={timezone}
                  onValueChange={(value: "GMT+2" | "UTC") => setTimezone(value)}
                  className="flex flex-wrap items-center gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="GMT+2" id="gmt" className="text-blue-600" />
                    <Label htmlFor="gmt" className="flex items-center space-x-2 font-medium">
                      <span>GMT+2 (UTC+02:00)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="UTC" id="utc" className="text-blue-600" />
                    <Label htmlFor="utc" className="font-medium">UTC</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Date range section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                Date Range
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <RadioGroup
                  defaultValue={dateRange}
                  onValueChange={(value: React.SetStateAction<string>) => {
                    setDateRange(value);
                    setShowCalendar(value === "custom");
                  }}
                  className="flex flex-col space-y-2"
                >
                  {dateRanges.map((range) => (
                    <div
                      key={range.id}
                      className={`flex items-center justify-between py-3 px-4 rounded-md transition-all
                        ${dateRange === range.id
                          ? "bg-white shadow-sm border border-gray-200"
                          : "hover:bg-white/60"
                        }`}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={range.id} id={range.id} className="text-blue-600" />
                        <Label htmlFor={range.id} className="font-medium">{range.label}</Label>
                      </div>
                      {range.date && (
                        <span className="text-sm text-gray-600 break-normal">
                          {range.date}
                        </span>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Custom Date Range Calendar */}
              {showCalendar && (
                <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
                  <div className="min-w-[600px] lg:min-w-0">
                    <Calendar
                      mode="range"
                      selected={customRange}
                      onSelect={(range: DateRange | undefined) => setCustomRange(range)}
                      className="rounded-md"
                      numberOfMonths={2}
                      defaultMonth={new Date()}
                      classNames={{
                        day_selected: "bg-blue-600",
                        day_today: "bg-gray-100 text-gray-900",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportFilterModal;