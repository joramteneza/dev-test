import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  import { Button } from "@/components/ui/button";
  import { Label } from "@/components/ui/label";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { ChevronDown, Filter } from "lucide-react";
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
  import dayjs from "dayjs";
  import { useState } from "react";
  
  type FilterPopoverProps = {
    yearFilter: string;
    setYearFilter: (value: string) => void;
    years: string[];
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
  };
  
  export function FilterPopover({
    yearFilter,
    setYearFilter,
    years,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  }: FilterPopoverProps) {
    const [localYearFilter, setLocalYearFilter] = useState(yearFilter);
    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localEndDate, setLocalEndDate] = useState(endDate);
    const [open, setOpen] = useState(false);

    const handleStartChange = (date: Date | null) => {
        if (date) {
          setLocalStartDate(dayjs(date).format("YYYY-MM-DD"));
        } else {
          setLocalStartDate("");
        }
      };
      
      const handleEndChange = (date: Date | null) => {
        if (date) {
          setLocalEndDate(dayjs(date).format("YYYY-MM-DD"));
        } else {
          setLocalEndDate("");
        }
      };
      
  
    const parseDate = (dateString: string) => {
      return dateString ? new Date(dateString) : null;
    };
  
    const handleApply = () => {
      setYearFilter(localYearFilter);
      setStartDate(localStartDate);
      setEndDate(localEndDate);
      setOpen(false)
    };
  
    const handleClear = () => {
      setLocalYearFilter("All");
      setLocalStartDate("");
      setLocalEndDate("");
    };
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            <Filter className="h-4 w-4" />
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
  
        <PopoverContent side="bottom" align="start" className="lg:w-2xl mt-2 shadow-lg rounded-sm">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Filter Timeline</h4>
  
            {/* Year Filter */}
            <div className="flex gap-2 lg:gap-5 flex-col lg:flex-row lg:items-center space-y-2">
              <Label htmlFor="year" className="m-0">Filter by Year</Label>
              <Select value={localYearFilter} onValueChange={setLocalYearFilter}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
  
            {/* Date Range */}
            <div className="flex gap-2 lg:gap-7 flex-col lg:flex-row lg:items-center space-y-2">
              <Label className="m-0">Date Range</Label>
              <div className="flex w-fit flex-col lg:flex-row lg:items-center gap-2">
                <DatePicker
                  selected={parseDate(localStartDate)}
                  onChange={handleStartChange}
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholderText="Start date"
                  filterDate={(date: any) =>
                    localYearFilter === "All" || dayjs(date).year().toString() === localYearFilter
                  }
                />
                <span className="text-sm">to</span>
                <DatePicker
                  selected={parseDate(localEndDate)}
                  onChange={handleEndChange}
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholderText="End date"
                  filterDate={(date: any) =>
                    localYearFilter === "All" || dayjs(date).year().toString() === localYearFilter
                  }
                />
              </div>
            </div>
  
            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="bg-white font-normal text-light-blue-200 hover:text-blue-600 hover:bg-gray-50 border border-light-blue-200 cursor-pointer py-5 px-6"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                className="bg-light-blue-200 font-normal hover:bg-blue-400 cursor-pointer py-5 px-6"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  