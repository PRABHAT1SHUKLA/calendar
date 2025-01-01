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
import { format } from "date-fns";

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return format(date, "h:mm a");
};

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
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventDialog: React.FC<EventDialogProps> = ({
  selectedDate,
  events,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [updatedData, setUpdatedData] = useState<Event>({
    id: "",
    title: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsDialogOpen(true);
  };

  const handleEdit = () => {
    if (!selectedEvent) return;

    // Convert ISO times to local time format for the inputs
    const startDate = new Date(selectedEvent.startTime);
    const endDate = new Date(selectedEvent.endTime);

    setUpdatedData({
      ...selectedEvent,
      startTime: `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`,
      endTime: `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`,
    });

    setIsDetailsDialogOpen(false);
    setIsUpdateDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      onDeleteEvent(selectedEvent.id);
      setIsDetailsDialogOpen(false);
    }
  };

  const handleUpdate = () => {
    if (!updatedData.title || !updatedData.startTime || !updatedData.endTime) {
      alert("Please fill in all required fields!");
      return;
    }

    const convertToFullDate = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      const fullDate = new Date(selectedDate);
      fullDate.setHours(hours, minutes, 0, 0);
      return fullDate;
    };

    const newStartTime = convertToFullDate(updatedData.startTime);
    const newEndTime = convertToFullDate(updatedData.endTime);

    if (newStartTime >= newEndTime) {
      alert("Start time must be earlier than end time!");
      return;
    }

    // Check for overlapping events, excluding the current event being edited
    const isOverlapping = events.some((event) => {
      if (event.id === updatedData.id) return false;
      const existingStartTime = new Date(event.startTime);
      const existingEndTime = new Date(event.endTime);

      return (
        (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
        (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
        (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
      );
    });

    if (isOverlapping) {
      alert("The updated event time overlaps with an existing event!");
      return;
    }

    const updatedEvent: Event = {
      id: updatedData.id,
      title: updatedData.title,
      startTime: newStartTime.toISOString(),
      endTime: newEndTime.toISOString(),
      description: updatedData.description,
    };

    onEditEvent(updatedEvent);
    setIsUpdateDialogOpen(false);
  };

  const handleCreate = () => {
    if (!formData.title || !formData.startTime || !formData.endTime) {
      alert("Please fill in all required fields!");
      return;
    }

    const convertToFullDate = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      const fullDate = new Date(selectedDate);
      fullDate.setHours(hours, minutes, 0, 0);
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
      alert("The new event time overlaps with an existing event!");
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
    setFormData({ id: "", title: "", startTime: "", endTime: "", description: "" });
    setIsCreateDialogOpen(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          View Events for {selectedDate}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Events for {selectedDate}</DialogTitle>
          <DialogDescription>Manage and view events for this day.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <ScrollArea className="max-h-[300px] overflow-y-auto space-y-2">
            {events.length > 0 ? (
              events.map((event) => (
                <Card
                  key={event.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow mb-2"
                  onClick={() => handleEventClick(event)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <strong>Start:</strong> {formatTime(event.startTime)}
                    </p>
                    <p className="text-sm">
                      <strong>End:</strong> {formatTime(event.endTime)}
                    </p>
                    {event.description && (
                      <p className="text-sm mt-2">{event.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">No events scheduled for this day.</p>
            )}
          </ScrollArea>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>
      </DialogContent>

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>Add a new event for {selectedDate}</DialogDescription>
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
            <Button onClick={handleCreate} className="w-full">
              Create Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogDescription>
                {selectedEvent.description || "No description provided"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                <strong>Start:</strong> {formatTime(selectedEvent.startTime)}
              </p>
              <p>
                <strong>End:</strong> {formatTime(selectedEvent.endTime)}
              </p>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Update Event Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update event details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Event Title"
              name="title"
              value={updatedData.title}
              onChange={handleUpdateChange}
            />
            <Input
              type="time"
              placeholder="Start Time"
              name="startTime"
              value={updatedData.startTime}
              onChange={handleUpdateChange}
            />
            <Input
              type="time"
              placeholder="End Time"
              name="endTime"
              value={updatedData.endTime}
              onChange={handleUpdateChange}
            />
            <Textarea
              placeholder="Description (optional)"
              name="description"
              value={updatedData.description || ""}
              onChange={handleUpdateChange}
            />
            <Button onClick={handleUpdate} className="w-full">
              Update Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default EventDialog;