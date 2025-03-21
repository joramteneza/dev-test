import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, ChevronDown } from "lucide-react"
import { cn, formatDateWithOrdinal, toNumericTimestamp } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/useMediaQuery"

interface Goal {
  id: number
  name: string
  date: string
  description: string
  color: string
  timestamp?: number
}

interface TimelineProps {
  goals: Goal[]
}

export function Timeline({ goals }: TimelineProps) {
  const [showTimeBetweenEvents, setShowTimeBetweenEvents] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")


  const goalsWithTimestamps = goals
  .map((goal) => {
    const timestamp = toNumericTimestamp(goal.date)
    return { ...goal, timestamp }
  })
  .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))

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
    <div>
      {/* Filter and toggle controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          <Filter className="mr-2 h-4 w-4" />
          Filter
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-2 bg-white rounded-md px-3 py-1 border border-light-blue-200">
          <Checkbox
            id="showTimeBetween"
            checked={showTimeBetweenEvents}
            onCheckedChange={(checked) => setShowTimeBetweenEvents(checked === true)}
          />
          <label
            htmlFor="showTimeBetween"
            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-light-blue-200"
          >
            Show time between events
          </label>
        </div>
      </div>

      {/* Timeline */}
      <div className={cn("relative", isDesktop ? "mx-auto" : "ml-4")}>
        {/* Timeline line */}
        <div
          className={cn(
            "absolute top-20 bottom-20 w-1.5 bg-light-gray-200",
            isDesktop ? "left-1/2 -translate-x-1/2" : "left-0",
          )}
        ></div>

        <div className="space-y-0">
          {goalsWithTimestamps.map((goal, index) => {
            const spacing = calculateSpacing(goal, index)
            const isLeft = isDesktop ? index % 2 === 0 : false
            const date = formatDateWithOrdinal((goal.date))

            console.log("goal", goal)

            return (
              <div
                key={goal.id}
                className={cn(
                  "relative",
                  isDesktop ? "mx-auto grid grid-cols-2 gap-4 items-center" : "pl-12",
                  index > 0 && spacing > 0 ? `mt-${Math.min(24, Math.floor(spacing / 4))}` : "mt-5",
                )}
                style={index > 0 && spacing > 0 ? { marginTop: `${spacing}px` } : { }}
              >
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute w-7 h-7 rounded-full bg-light-gray-200 border-4 border-white z-10",
                    isDesktop ? "left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" : "-left-3 top-[60px]",
                  )}
                ></div>

                {/* Card positioning */}
                <div className={cn('rounded-xl overflow-hidden shadow-lg', isDesktop && isLeft ? "col-start-1 mr-5" : isDesktop ? "col-start-2 ml-5" : "", "relative")}>
                  <Card className="">
                    <div
                      className={cn(
                        `absolute top-0 h-full w-3`,
                        isDesktop && isLeft ? "left-0" : "right-0",
                      )}
                      style={{ backgroundColor: goal.color }}
                    ></div>
                    <CardHeader className="">
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
            )
          })}
        </div>
      </div>
    </div>
  )
}

