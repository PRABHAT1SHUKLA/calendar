import React, { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, addDays, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EventDialog from "./EventDialog";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
}

const CalendarGrid: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({});

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

  const handleCreateEvent = () => {
    if (!selectedDate) return;

    const newEvent: Event = {
      id: Date.now().toString(),
      title: `New Event for ${selectedDate}`,
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      description: "Description goes here",
    };

    setEvents((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEvent],
    }));
  };

  const handleEventClick = (event: Event) => {
    console.log("View/Edit Event:", event);
    // Implement logic for viewing or editing the event
  };

 const handleDayClick = (date: Date) => {
    setSelectedDate(format(date, "yyyy-MM-dd"));
  };

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
            onClick={() => handleDayClick(date)}
            className={cn(
              "p-4 text-center cursor-pointer",
              isToday(date) && "border-blue-500 bg-blue-50",
              selectedDate === format(date, "yyyy-MM-dd") && "bg-blue-100 border-blue-600",
              isWeekend(date) ? "text-red-500" : "text-gray-900",
              date.getMonth() !== currentDate.getMonth() && "text-gray-400"
            )}
          >
            <div>{format(date, "d")}</div>
          </Card>
        ))}
      </div>

      {/* Event Dialog */}
      {selectedDate && (
        <EventDialog
          selectedDate={selectedDate}
          events={events[selectedDate] || []}
          onCreateEvent={(newEvent) =>
            setEvents((prev) => ({
              ...prev,
              [selectedDate]: [...(prev[selectedDate] || []), newEvent],
            }))
          }
          onEditEvent={(updatedEvent) => {
            setEvents((prev) => ({
              ...prev,
              [selectedDate]: (prev[selectedDate] || []).map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event
              ),
            }));
          }}
          onDeleteEvent={(eventId) => {
            setEvents((prev) => ({
              ...prev,
              [selectedDate]: (prev[selectedDate] || []).filter((event) => event.id !== eventId),
            }));
          }}
          onEventClick={handleEventClick}
        />
      )}
    </div>
  );
};

export default CalendarGrid;
