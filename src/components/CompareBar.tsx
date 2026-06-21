"use client";

import { useRouter } from "next/navigation";
import { GitCompare, X, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/hooks/useCompare";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const { compareIds, compareNames, removeFromCompare, clearCompare } = useCompare();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  if (compareIds.length === 0) return null;

  const handleCompare = () => {
    router.push(`/compare?ids=${compareIds.join(",")}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              Compare ({compareIds.length}/3)
            </span>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        <div className={cn("overflow-hidden transition-all duration-200", collapsed ? "max-h-0" : "max-h-40 pb-3")}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex flex-wrap gap-2 flex-1">
              {compareIds.map((id, idx) => (
                <div
                  key={id}
                  className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full pl-3 pr-1.5 py-1"
                >
                  <span className="text-xs font-medium text-blue-800 max-w-[140px] truncate">
                    {compareNames[idx] ?? id}
                  </span>
                  <button
                    onClick={() => removeFromCompare(id)}
                    className="rounded-full p-0.5 text-blue-400 hover:text-red-500 hover:bg-red-50"
                    aria-label={`Remove ${compareNames[idx]}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {Array.from({ length: 3 - compareIds.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center px-3 py-1 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full"
                >
                  <span className="text-xs text-gray-400">Add college</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCompare}
                className="text-xs h-8"
              >
                Clear All
              </Button>
              <Button
                size="sm"
                onClick={handleCompare}
                disabled={compareIds.length < 2}
                className="text-xs h-8"
              >
                <GitCompare className="h-3.5 w-3.5 mr-1.5" />
                Compare Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
