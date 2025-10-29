"use client"

import * as React from "react"
import { format, startOfMonth } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/shadcn/button"
import { Calendar } from "@/components/ui/shadcn/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  date,
  setDate
}: DateRangePickerProps) {
  // Local state to hold the date selection before applying
  const [localDate, setLocalDate] = React.useState<DateRange | undefined>(date);
  const [isOpen, setIsOpen] = React.useState(false);

  // Update local state when the prop changes
  React.useEffect(() => {
    setLocalDate(date);
  }, [date]);

  const handleApply = () => {
    setDate(localDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Reset local state to the parent's state
    setLocalDate(date);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultDateRange = {
     from: startOfMonth(new Date()), 
      to: new Date(),
    };
    setDate(defaultDateRange);
    setIsOpen(false);
  };

  return (
    <div className={cn("", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-center text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd-MMM-yyyy")} - {format(date.to, "dd-MMM-yyyy")}
                </>
              ) : (
                format(date.from, "dd-MMM-yyyy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={localDate?.from}
            selected={localDate}
            onSelect={setLocalDate}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
          />
          <div className="flex justify-end gap-2 p-4 border-t">
            <Button variant="secondary" size="sm" onClick={handleReset} className="min-w-[79px] cursor-pointer">Reset</Button>
            <Button variant="secondary" size="sm" onClick={handleCancel} className="min-w-[79px] cursor-pointer">Cancel</Button>
            <Button size="sm" onClick={handleApply} className="min-w-[79px] cursor-pointer">Apply</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

