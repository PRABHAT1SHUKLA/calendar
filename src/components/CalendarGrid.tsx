import React, { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, addDays, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CalendarGrid: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = addDays(endOfMonth(currentDate), 6 - endOfMonth(currentDate).getDay());

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const isWeekend = (date: Date) => [0, 6].includes(date.getDay());

  const handlePrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={handlePrevMonth}>
          Previous
        </Button>
        <h2 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
        <Button variant="outline" onClick={handleNextMonth}>
          Next
        </Button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 text-center font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2 mt-2">
        {days.map((date, idx) => (
          <Card
            key={idx}
            onClick={() => setSelectedDate(date)}
            className={cn(
              "p-4 text-center cursor-pointer",
              isToday(date) && "border-blue-500 bg-blue-50",
              selectedDate && date.toDateString() === selectedDate.toDateString() && "bg-blue-100 border-blue-600",
              isWeekend(date) ? "text-red-500" : "text-gray-900",
              date.getMonth() !== currentDate.getMonth() && "text-gray-400"
            )}
          >
            <div>{format(date, "d")}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
