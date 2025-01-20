"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/base/card";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface PriceDistanceEntry {
  distance: string;
  priceRange: string;
  duration: string;
}

const PriceDistanceForm = () => {
  const entries: PriceDistanceEntry[] = [
    {
      distance: "1 KM",
      priceRange: "2000 RWF - 5000 RWF",
      duration: "5.0",
    },
    {
      distance: "5 KM",
      priceRange: "2000 RWF - 5000 RWF",
      duration: "3.0",
    },
    {
      distance: "10 KM",
      priceRange: "2000 RWF - 5000 RWF",
      duration: "1.0",
    },
    {
      distance: "15 KM",
      priceRange: "2000 RWF - 5000 RWF",
      duration: "5.0",
    },
  ];

  return (
    <Card className="bg-background rounded-2xl">
      <CardContent className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-xs font-medium text-muted-foreground">
                  DISTANCE IN KM
                </th>
                <th className="text-left py-3 text-xs font-medium text-muted-foreground">
                  PRICE RANGE IN RWF
                </th>
                <th className="text-left py-3 text-xs font-medium text-muted-foreground">
                  ESTIMATED DURATION
                </th>
                <th className="text-left py-3 text-xs font-medium text-muted-foreground">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={index}
                  className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 2L19 21H5L12 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">
                        {entry.distance}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-foreground">
                    {entry.priceRange}
                  </td>
                  <td className="py-3 text-sm text-foreground">
                    {entry.duration}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-accent rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 hover:bg-accent rounded-lg transition-colors">
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 hover:bg-accent rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <button className="text-xs text-muted-foreground hover:text-foreground">
            ‹ Previous
          </button>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-lg bg-primary text-white text-xs flex items-center justify-center">
              1
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-accent text-xs flex items-center justify-center text-muted-foreground">
              2
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-accent text-xs flex items-center justify-center text-muted-foreground">
              3
            </button>
            <span className="text-xs text-muted-foreground">...</span>
            <button className="w-7 h-7 rounded-lg hover:bg-accent text-xs flex items-center justify-center text-muted-foreground">
              10
            </button>
          </div>
          <button className="text-xs text-muted-foreground hover:text-foreground">
            Next ›
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceDistanceForm;
