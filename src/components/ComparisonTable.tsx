import Link from "next/link";
import { MapPin, Star, IndianRupee, TrendingUp, Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatPackage } from "@/lib/utils";
import type { CollegeDetail } from "@/types";

interface ComparisonTableProps {
  colleges: CollegeDetail[];
  onRemove: (id: string) => void;
}

interface RowConfig {
  label: string;
  icon?: React.ReactNode;
  render: (college: CollegeDetail) => React.ReactNode;
  highlight?: (colleges: CollegeDetail[]) => string | null;
}

function getBestId<T>(colleges: CollegeDetail[], key: keyof CollegeDetail, higher = true): string | null {
  if (colleges.length < 2) return null;
  const best = colleges.reduce((prev, curr) =>
    higher
      ? (curr[key] as number) > (prev[key] as number) ? curr : prev
      : (curr[key] as number) < (prev[key] as number) ? curr : prev
  );
  return best.id;
}

export function ComparisonTable({ colleges, onRemove }: ComparisonTableProps) {
  const rows: RowConfig[] = [
    {
      label: "Location",
      icon: <MapPin className="h-4 w-4" />,
      render: (c) => (
        <div className="flex items-center gap-1 text-gray-700">
          <MapPin className="h-3.5 w-3.5 text-gray-400" />
          {c.location}
        </div>
      ),
    },
    {
      label: "Annual Fees",
      icon: <IndianRupee className="h-4 w-4" />,
      render: (c) => <span className="font-semibold">{formatCurrency(c.fees)}</span>,
      highlight: (cs) => getBestId(cs, "fees", false),
    },
    {
      label: "Rating",
      icon: <Star className="h-4 w-4" />,
      render: (c) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{c.rating.toFixed(1)}</span>
          <span className="text-gray-400 text-sm">/ 5</span>
        </div>
      ),
      highlight: (cs) => getBestId(cs, "rating"),
    },
    {
      label: "Placement %",
      icon: <TrendingUp className="h-4 w-4" />,
      render: (c) => (
        <div>
          <div className="font-semibold">{c.placementPercentage}%</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${c.placementPercentage}%` }}
            />
          </div>
        </div>
      ),
      highlight: (cs) => getBestId(cs, "placementPercentage"),
    },
    {
      label: "Avg Package",
      icon: <Award className="h-4 w-4" />,
      render: (c) => <span className="font-semibold text-green-700">{formatPackage(c.averagePackage)}</span>,
      highlight: (cs) => getBestId(cs, "averagePackage"),
    },
    {
      label: "Highest Package",
      icon: <Award className="h-4 w-4" />,
      render: (c) => <span className="font-semibold text-blue-700">{formatPackage(c.highestPackage)}</span>,
      highlight: (cs) => getBestId(cs, "highestPackage"),
    },
    {
      label: "Courses",
      render: (c) => (
        <div className="flex flex-wrap gap-1">
          {c.courses.slice(0, 3).map((course) => (
            <Badge key={course.id} variant="secondary" className="text-xs">
              {course.name.replace("B.Tech ", "").replace("M.Tech ", "M.")}
            </Badge>
          ))}
          {c.courses.length > 3 && (
            <Badge variant="outline" className="text-xs">+{c.courses.length - 3} more</Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr>
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-500 bg-gray-50 w-36 rounded-tl-lg">
              Criteria
            </th>
            {colleges.map((college) => (
              <th key={college.id} className="px-4 py-3 bg-gray-50 last:rounded-tr-lg min-w-[180px]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/college/${college.id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 text-sm leading-tight block"
                    >
                      {college.name}
                    </Link>
                    <span className="text-xs text-gray-500">{college.location}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 flex-shrink-0"
                    onClick={() => onRemove(college.id)}
                    aria-label={`Remove ${college.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => {
            const bestId = row.highlight?.(colleges) ?? null;
            return (
              <tr key={row.label} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <td className="px-4 py-3 text-sm font-medium text-gray-600 flex items-center gap-1.5">
                  {row.icon}
                  {row.label}
                </td>
                {colleges.map((college) => (
                  <td
                    key={college.id}
                    className={cn(
                      "px-4 py-3 text-sm",
                      bestId === college.id && "bg-green-50"
                    )}
                  >
                    {row.render(college)}
                    {bestId === college.id && (
                      <Badge className="mt-1 text-xs bg-green-500 hover:bg-green-600">Best</Badge>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
