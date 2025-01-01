import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";

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
  onCreateEvent: () => void;
  onEventClick: (event: Event) => void;
}

const EventDialog: React.FC<EventDialogProps> = ({ selectedDate, events, onCreateEvent, onEventClick }) => {
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
          <Button onClick={onCreateEvent} variant="ghost" className="w-full flex items-center justify-center">
            <PlusCircle className="mr-2" /> Create Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
