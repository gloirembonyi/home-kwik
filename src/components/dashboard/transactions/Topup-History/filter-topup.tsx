import React from "react";
import { Dialog, DialogContent } from "@/components/ui/base/dialog";
import { Button } from "@/components/ui/base/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import { Calendar } from "@/components/ui/base/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/base/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface FilterTopupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  status: string;
  amountRange: {
    min: string;
    max: string;
  };
}

const FilterTopupDialog: React.FC<FilterTopupDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [filters, setFilters] = React.useState<FilterOptions>({
    dateRange: {
      from: undefined,
      to: undefined,
    },
    status: "all",
    amountRange: {
      min: "",
      max: "",
    },
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const clearFilters = () => {
    setFilters({
      dateRange: {
        from: undefined,
        to: undefined,
      },
      status: "all",
      amountRange: {
        min: "",
        max: "",
      },
    });
    onApplyFilters({
      dateRange: {
        from: undefined,
        to: undefined,
      },
      status: "all",
      amountRange: {
        min: "",
        max: "",
      },
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-lg p-6 bg-card border border-border">
        <h2 className="text-xl font-semibold mb-4">Filter topup history</h2>

        <div className="space-y-4">
          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? (
                      format(filters.dateRange.from, "PPP")
                    ) : (
                      <span>From date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from}
                    onSelect={(date) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          from: date || undefined,
                        },
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? (
                      format(filters.dateRange.to, "PPP")
                    ) : (
                      <span>To date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to}
                    onSelect={(date) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, to: date || undefined },
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Successful">Successful</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount Range (RWF)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.amountRange.min}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    amountRange: { ...prev.amountRange, min: e.target.value },
                  }))
                }
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.amountRange.max}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    amountRange: { ...prev.amountRange, max: e.target.value },
                  }))
                }
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="text-destructive hover:text-destructive"
          >
            Clear Filters
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterTopupDialog;
