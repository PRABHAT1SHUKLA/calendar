import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
}

interface EventDialogProps {
  selectedDate: string;
  events: Event[];
  onCreateEvent: (event: Event) => void;
  onEventClick: (event: Event) => void;
}

const EventDialog: React.FC<EventDialogProps> = ({
  selectedDate,
  events,
  onCreateEvent,
  onEventClick,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.startTime || !formData.endTime) {
      alert("Please fill in all required fields!");
      return;
    }
  
    // Helper function to convert time to Date object
    const convertToFullDate = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      const fullDate = new Date(selectedDate); // Base date
      fullDate.setHours(hours, minutes, 0, 0); // Set time
      return fullDate;
    };
  
    const newStartTime = convertToFullDate(formData.startTime);
    const newEndTime = convertToFullDate(formData.endTime);
  
    if (newStartTime >= newEndTime) {
      alert("Start time must be earlier than end time!");
      return;
    }
  
    const isOverlapping = events.some((event) => {
      const existingStartTime = new Date(event.startTime);
      const existingEndTime = new Date(event.endTime);
  
      return (
        (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
        (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
        (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
      );
    });
  
    if (isOverlapping) {
      alert("The new event's time overlaps with an existing event!");
      return;
    }
  
    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.title,
      startTime: newStartTime.toISOString(),
      endTime: newEndTime.toISOString(),
      description: formData.description,
    };
  
    onCreateEvent(newEvent);
    setFormData({ title: "", startTime: "", endTime: "", description: "" });
    setIsCreateDialogOpen(false);
  };
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          View Events for {selectedDate}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Events for {selectedDate}</DialogTitle>
          <DialogDescription>Manage and view events for this day.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <ScrollArea className="max-h-[300px] space-y-2">
            {events.length > 0 ? (
              events.map((event) => (
                <Card
                  key={event.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onEventClick(event)}
                >
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Start:</strong> {event.startTime}
                    </p>
                    <p>
                      <strong>End:</strong> {event.endTime}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">No events scheduled for this day.</p>
            )}
          </ScrollArea>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <PlusCircle className="mr-2" /> Create Event
          </Button>
        </div>
      </DialogContent>

      {isCreateDialogOpen && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>Fill in the details for the new event.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Event Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              <Input
                type="time"
                placeholder="Start Time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
              />
              <Input
                type="time"
                placeholder="End Time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
              />
              <Textarea
                placeholder="Description (optional)"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
              <Button onClick={handleSubmit} className="w-full">
                Save Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default EventDialog;
