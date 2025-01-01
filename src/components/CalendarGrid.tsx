import React, { useState, useEffect } from "react";
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

const STORAGE_KEY = 'calendar_events';

const CalendarGrid: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({});

  // Load events from localStorage when component mounts
  useEffect(() => {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Error loading events from localStorage:', error);
      }
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(events).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

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

  const handleEventClick = (event: Event) => {
    console.log("Event clicked:", event);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(format(date, "yyyy-MM-dd"));
  };

  const handleCreateEvent = (newEvent: Event) => {
    if (!selectedDate) return;
    
    setEvents(prev => {
      const updatedEvents = {
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), newEvent]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };

  const handleEditEvent = (updatedEvent: Event) => {
    if (!selectedDate) return;

    setEvents(prev => {
      const updatedEvents = {
        ...prev,
        [selectedDate]: (prev[selectedDate] || []).map(event =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    if (!selectedDate) return;

    setEvents(prev => {
      const updatedEvents = {
        ...prev,
        [selectedDate]: (prev[selectedDate] || []).filter(event => event.id !== eventId)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };

  const getEventCount = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return events[dateStr]?.length || 0;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={handlePrevMonth}>
          Previous
        </Button>
        <h2 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
        <Button variant="outline" onClick={handleNextMonth}>
          Next
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
      {days.map((date, idx) => {
  const eventCount = getEventCount(date);
  return (
    <Card
      key={idx}
      onClick={() => handleDayClick(date)}
      className={cn(
        "p-4 text-center cursor-pointer relative min-h-[80px]", // Added min-height
        selectedDate === format(date, "yyyy-MM-dd") && "bg-blue-100 border-blue-600",
        isWeekend(date) ? "text-red-500" : "text-gray-900",
        date.getMonth() !== currentDate.getMonth() && "text-gray-400"
      )}
    >
      <div className="relative">
        {format(date, "d")}
        {isToday(date) && (
          <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
          </div>
        )}
      </div>
      {eventCount > 0 && (
        <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {eventCount}
        </div>
      )}
    </Card>
  );
})}
      </div>

      {selectedDate && (
        <EventDialog
          selectedDate={selectedDate}
          events={events[selectedDate] || []}
          onCreateEvent={handleCreateEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onEventClick={handleEventClick}
        />
      )}
    </div>
  );
};

export default CalendarGrid;