import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterPopover } from "./FilterPopover";
import { cn, formatDateWithOrdinal, toNumericTimestamp } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import dayjs from "dayjs";

interface Goal {
  id: number;
  name: string;
  date: string;
  description: string;
  color: string;
  timestamp?: number;
}

interface TimelineProps {
  goals: Goal[];
}

export function Timeline({ goals }: TimelineProps) {
  const [showTimeBetweenEvents, setShowTimeBetweenEvents] = useState(false);
  const [yearFilter, setYearFilter] = useState<string>("All");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [visibleDate, setVisibleDate] = useState<string | null>(null);
  const [showIndicator, setShowIndicator] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get unique years from goals for filtering
  const years = Array.from(new Set(goals.map(goal => dayjs(goal.date).year().toString())))
    .sort((a, b) => Number(a) - Number(b));

  // Convert goals to timestamps and sort by date
  const goalsWithTimestamps = goals
    .map(goal => ({
      ...goal,
      timestamp: toNumericTimestamp(goal.date),
    }))
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  // Filter goals based on year and date range
  const filteredGoals = goalsWithTimestamps.filter(goal => {
    const goalYear = dayjs(goal.date).year().toString();
    const goalDate = dayjs(goal.date).format("YYYY-MM-DD");

    const isInYear = yearFilter === "All" || goalYear === yearFilter;
    const isInDateRange = (!startDate || goalDate >= startDate) && (!endDate || goalDate <= endDate);

    return isInYear && isInDateRange;
  });

  // Detect first visible goal in viewport
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const goalDate = entry.target.getAttribute("data-date");
          if (goalDate) {
            setVisibleDate(formatDateWithOrdinal(goalDate));
            setShowIndicator(true);

            // Hide indicator after 1 second of inactivity
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setShowIndicator(false), 1000);
          }
          break;
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Trigger when at least 50% of the goal is in view
    });

    const goalElements = document.querySelectorAll(".timeline-goal");
    goalElements.forEach(el => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [filteredGoals]);

  // Calculate spacing between goals
  const calculateSpacing = (currentGoal: Goal, index: number) => {
    if (index === 0 || !showTimeBetweenEvents || !currentGoal.timestamp) return 0

    const prevGoal = goalsWithTimestamps[index - 1]
    if (!prevGoal.timestamp) return 0

    const timeDiff = currentGoal.timestamp - prevGoal.timestamp
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24)

    // Scale the spacing: 1 month ≈ 30px, with a minimum of 48px
    return Math.max(10, daysDiff * 0.2)
  }

  return (
    <div className="relative">
      {/* Sticky Filter Controls */}
      <div className="sticky top-0 -left-10 w-screen z-20 bg-light-gray-50 flex flex-wrap items-center gap-3 mb-6 py-3">
        <FilterPopover
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          years={years}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        {/* Show time between events checkbox */}
        <div className="flex items-center space-x-2 bg-white rounded-md px-3 py-1 border border-light-blue-200 cursor-pointer">
          <Checkbox
            id="showTimeBetween"
            checked={showTimeBetweenEvents}
            onCheckedChange={checked => setShowTimeBetweenEvents(checked === true)}
            className="cursor-pointer"
          />
          <label htmlFor="showTimeBetween" className="text-xs font-medium text-light-blue-200 cursor-pointer">
            Show time between events
          </label>
        </div>
      </div>

      {/* Floating Date Indicator */}
      {showIndicator && visibleDate && (
        <div className="fixed top-1/2 right-4 z-50 px-3 py-1 bg-white shadow-md border rounded-md text-xs text-gray-600">
          {visibleDate}
        </div>
      )}

      {/* Timeline */}
      <div className={cn("relative", isDesktop ? "mx-auto" : "ml-4")}>
        {/* Timeline line */}
        <div className={cn("absolute top-20 bottom-20 w-1.5 bg-light-gray-200", isDesktop ? "left-1/2 -translate-x-1/2" : "left-0")}></div>

        <div className="space-y-0">
          {filteredGoals.map((goal, index) => {
            const spacing = calculateSpacing(goal, index)
            const isLeft = isDesktop ? index % 2 === 0 : false;
            const date = formatDateWithOrdinal(goal.date);

            return (
              <div
                key={goal.id}
                className={cn(
                  "relative timeline-goal",
                  isDesktop ? "mx-auto grid grid-cols-2 gap-4 items-center" : "pl-12",
                  index > 0 && spacing > 0 ? `mt-${Math.min(24, Math.floor(spacing / 4))}` : "mt-5",
                )}
                style={index > 0 && spacing > 0 ? { marginTop: `${spacing}px` } : {}}
                data-date={goal.date}
              >
                {/* Timeline dot */}
                <div className={cn("absolute w-7 h-7 rounded-full bg-light-gray-200 border-4 border-white z-10", isDesktop ? "left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" : "-left-3 top-[60px]")}></div>

                {/* Goal Card */}
                <div className={cn("rounded-xl overflow-hidden shadow-lg", isDesktop && isLeft ? "col-start-1 mr-5" : isDesktop ? "col-start-2 ml-5" : "", "relative")}>
                  <Card>
                    <div className={cn("absolute top-0 h-full w-3", isDesktop && isLeft ? "left-0" : "right-0")} style={{ backgroundColor: goal.color }}></div>
                    <CardHeader>
                      <CardTitle className="text-dark-gray text-xs">{goal.name}</CardTitle>
                      <p className="text-light-gray text-xs">{date}</p>
                    </CardHeader>
                    <CardContent className="px-10">
                      <p className="text-gray-700 text-tiny italic">{goal.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Empty column for desktop layout */}
                {isDesktop && <div className={isLeft ? "col-start-2" : "col-start-1"}></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
