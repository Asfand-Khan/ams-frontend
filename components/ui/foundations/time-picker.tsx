"use client";
 
import * as React from "react";
import { TimePickerInput } from "./time-picker-input";
import { Period } from "./time-picker-utils";
import { TimePeriodSelect } from "./time-picker-period-select";
 
interface TimePickerDemoProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}
 
export function TimePicker12Demo({ date, setDate }: TimePickerDemoProps) {
  const [period, setPeriod] = React.useState<Period>("AM");
 
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);
  const periodRef = React.useRef<HTMLButtonElement>(null);
 
  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <div className="gap-1 text-center flex items-center">
        <TimePickerInput
          picker="hours"
          period={period}
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <span className="font-bold">:</span>
      <div className="gap-1 text-center flex items-center">
        <TimePickerInput
          picker="minutes"
          id="minutes12"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      <span className="font-bold">:</span>
      <div className="gap-1 text-center flex items-center">
        <TimePickerInput
          picker="seconds"
          id="seconds12"
          date={date}
          setDate={setDate}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
          onRightFocus={() => periodRef.current?.focus()}
        />
      </div>
      <span className="font-bold">:</span>
      <div className="gap-1 text-center flex items-center">
        <TimePeriodSelect
          period={period}
          setPeriod={setPeriod}
          date={date}
          setDate={setDate}
          ref={periodRef}
          onLeftFocus={() => secondRef.current?.focus()}
        />
      </div>
    </div>
  );
}