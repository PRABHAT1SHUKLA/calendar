import React, { useState } from "react";
import dayjs from "dayjs";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Navigate to the previous or next month
  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => prevDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => prevDate.add(1, "month"));
  };

  // Generate the days to display in the calendar grid
  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDayOfWeek = startOfMonth.day(); // Day of the week (0-6)

    const daysInMonth = endOfMonth.date();
    const days: dayjs.Dayjs[] = [];

    // Fill in the blank days from the previous month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(startOfMonth.subtract(startDayOfWeek - i, "day"));
    }

    // Fill in the days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(startOfMonth.date(i));
    }

    // Fill in blank days to complete the grid
    while (days.length % 7 !== 0) {
      days.push(endOfMonth.add(days.length - daysInMonth, "day"));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Previous
        </button>
        <h2 className="text-lg font-bold">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center font-medium text-gray-600 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`p-4 text-center rounded ${
              day.isSame(currentDate, "month")
                ? "bg-gray-100 text-black"
                : "bg-gray-50 text-gray-400"
            } ${
              day.isSame(dayjs(), "day")
                ? "border-2 border-blue-500 font-bold"
                : "border border-gray-300"
            }`}
          >
            {day.date()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
