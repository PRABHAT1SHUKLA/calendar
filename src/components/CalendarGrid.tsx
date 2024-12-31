import React, { useState } from "react";
import dayjs from "dayjs";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Event {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStartTime, setFormStartTime] = useState("");
  const [formEndTime, setFormEndTime] = useState("");

  // Navigation handlers
  const handlePreviousMonth = () => setCurrentDate((prev) => prev.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate((prev) => prev.add(1, "month"));

  // Open modal for a specific day
  const handleDayClick = (day: dayjs.Dayjs) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormTitle("");
    setFormDescription("");
    setFormStartTime("");
    setFormEndTime("");
  };

  // Save event
  const handleSaveEvent = () => {
    if (!selectedDate) return;

    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const newEvent: Event = {
      title: formTitle,
      description: formDescription,
      startTime: formStartTime,
      endTime: formEndTime,
    };

    setEvents((prev) => ({
      ...prev,
      [formattedDate]: [...(prev[formattedDate] || []), newEvent],
    }));

    closeModal();
  };

  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDayOfWeek = startOfMonth.day();

    const days: dayjs.Dayjs[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(startOfMonth.subtract(startDayOfWeek - i, "day"));
    }

    for (let i = 0; i < endOfMonth.date(); i++) {
      days.push(startOfMonth.add(i, "day"));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Button variant="secondary" onClick={handlePreviousMonth}>Previous</Button>
        <h2 className="text-xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
        <Button variant="secondary" onClick={handleNextMonth}>Next</Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`border rounded-lg p-2 text-center cursor-pointer ${day.isSame(dayjs(), "day") ? "bg-blue-500 text-white" : ""}`}
            onClick={() => handleDayClick(day)}
          >
            {day.date()}
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDate ? selectedDate.format("MMMM DD, YYYY") : "Add Event"}</DialogTitle>
            <DialogDescription>Fill in the event details below:</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Event Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
            <Textarea placeholder="Event Description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
            <div className="flex space-x-4">
              <Input type="time" value={formStartTime} onChange={(e) => setFormStartTime(e.target.value)} placeholder="Start Time" />
              <Input type="time" value={formEndTime} onChange={(e) => setFormEndTime(e.target.value)} placeholder="End Time" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSaveEvent}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
