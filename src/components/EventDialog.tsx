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
  return format(date, "h:mm a"); // e.g., "9:00 AM"
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
  onEditEvent: (eventId : Event) => void,
  onDeleteEvent: (eventId : string) => void;

}

// const EventDialog: React.FC<EventDialogProps> = ({
//   selectedDate,
//   events,
//   onCreateEvent,
//   onEventClick
// }) => {
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     startTime: "",
//     endTime: "",
//     description: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//     if (!formData.title || !formData.startTime || !formData.endTime) {
//       alert("Please fill in all required fields!");
//       return;
//     }
  
//     // Helper function to convert time to Date object
//     const convertToFullDate = (time: string) => {
//       const [hours, minutes] = time.split(":").map(Number);
//       const fullDate = new Date(selectedDate); // Base date
//       fullDate.setHours(hours, minutes, 0, 0); // Set time
//       return fullDate;
//     };
  
//     const newStartTime = convertToFullDate(formData.startTime);
//     const newEndTime = convertToFullDate(formData.endTime);
  
//     if (newStartTime >= newEndTime) {
//       alert("Start time must be earlier than end time!");
//       return;
//     }
  
//     const isOverlapping = events.some((event) => {
//       const existingStartTime = new Date(event.startTime);
//       const existingEndTime = new Date(event.endTime);
  
//       return (
//         (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
//         (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
//         (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
//       );
//     });
  
//     if (isOverlapping) {
//       alert("The new event's time overlaps with an existing event!");
//       return;
//     }
  
//     const newEvent: Event = {
//       id: Date.now().toString(),
//       title: formData.title,
//       startTime: newStartTime.toISOString(),
//       endTime: newEndTime.toISOString(),
//       description: formData.description,
//     };
  
//     onCreateEvent(newEvent);
//     setFormData({ title: "", startTime: "", endTime: "", description: "" });
//     setIsCreateDialogOpen(false);
//   };
  

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="w-full">
//           View Events for {selectedDate}
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Events for {selectedDate}</DialogTitle>
//           <DialogDescription>Manage and view events for this day.</DialogDescription>
//         </DialogHeader>
//         <div className="space-y-4">
//           <ScrollArea className="max-h-[300px] space-y-2">
//             {events.length > 0 ? (
//               events.map((event) => (
//                 <Card
//                   key={event.id}
//                   className="cursor-pointer hover:shadow-lg transition-shadow"
//                   onClick={() => onEventClick(event)}
//                 >
//                   <CardHeader>
//                     <CardTitle>{event.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p>
//                       <strong>Start:</strong>  {formatTime(event.startTime)}
//                     </p>
//                     <p>
//                       <strong>End:</strong>  {formatTime(event.endTime)}
//                     </p>
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">No events scheduled for this day.</p>
//             )}
//           </ScrollArea>
//           <Button
//             variant="ghost"
//             className="w-full flex items-center justify-center"
//             onClick={() => setIsCreateDialogOpen(true)}
//           >
//             <PlusCircle className="mr-2" /> Create Event
//           </Button>
//         </div>
//       </DialogContent>

//       {isCreateDialogOpen && (
//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Create Event</DialogTitle>
//               <DialogDescription>Fill in the details for the new event.</DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <Input
//                 placeholder="Event Title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//               />
//               <Input
//                 type="time"
//                 placeholder="Start Time"
//                 name="startTime"
//                 value={formData.startTime}
//                 onChange={handleInputChange}
//               />
//               <Input
//                 type="time"
//                 placeholder="End Time"
//                 name="endTime"
//                 value={formData.endTime}
//                 onChange={handleInputChange}
//               />
//               <Textarea
//                 placeholder="Description (optional)"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//               />
//               <Button onClick={handleSubmit} className="w-full">
//                 Save Event
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </Dialog>
//   );
// };

// export default EventDialog;





const EventDialog: React.FC<EventDialogProps> = ({
  selectedDate,
  events,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onEventClick,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUpdateDialogOpen , setIsUpdateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [updatedData , setUpdatedData] = useState({
    id: "",
    title: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name , value} = e.target;
    setUpdatedData((prev) => ({...prev , [name]: value}));
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsDialogOpen(true);
  };

  const handleEdit = () => {
    if (!selectedEvent) return;

    setUpdatedData({
      id: selectedEvent.id,
      title: selectedEvent.title,
      startTime: new Date(selectedEvent.startTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata", // Explicitly specify the IST timezone
      }),
      endTime: new Date(selectedEvent.endTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata", // Explicitly specify the IST timezone
      }),
      description: selectedEvent.description || "",
    });

    onDeleteEvent(selectedEvent.id);

    setIsDetailsDialogOpen(false);
    setIsUpdateDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      onDeleteEvent(selectedEvent.id);
      setIsDetailsDialogOpen(false);
    }
  };

  // const handleSubmit = () => {
  //   // Common validation logic
  //   if (!formData.title || !formData.startTime || !formData.endTime) {
  //     alert("Please fill in all required fields!");
  //     return;
  //   }
  
  //   const convertToFullDate = (time: string) => {
  //     const [hours, minutes] = time.split(":").map(Number);
  //     const fullDate = new Date(selectedDate);
  //     fullDate.setHours(hours, minutes, 0, 0);
  //     return fullDate;
  //   };
  
  //   const newStartTime = convertToFullDate(formData.startTime);
  //   const newEndTime = convertToFullDate(formData.endTime);
  
  //   if (newStartTime >= newEndTime) {
  //     alert("Start time must be earlier than end time!");
  //     return;
  //   }
  
  //   const isOverlapping = events.some((event) => {
  //     const existingStartTime = new Date(event.startTime);
  //     const existingEndTime = new Date(event.endTime);
  
  //     return (
  //       (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
  //       (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
  //       (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
  //     );
  //   });
  
  //   if (isOverlapping) {
  //     alert("The new event's time overlaps with an existing event!");
  //     return;
  //   }
  
  //   if (selectedEvent) {
  //     onDeleteEvent(selectedEvent.id);
  //     // Editing existing event
  //     const updatedEvent: Event = {
  //       id: selectedEvent.id,
  //       title: formData.title,
  //       startTime: newStartTime.toISOString(),
  //       endTime: newEndTime.toISOString(),
  //       description: formData.description,
  //     };
  
  //     onEditEvent(updatedEvent); // Pass the correct type for editing
  //   } else {
  //     // Creating new event
  //     const newEvent: Event = {
  //       id: Date.now().toString(),
  //       title: formData.title,
  //       startTime: newStartTime.toISOString(),
  //       endTime: newEndTime.toISOString(),
  //       description: formData.description,
  //     };
  
  //     onCreateEvent(newEvent);
  //   }
  
  // setFormData({ id: "", title: "", startTime: "", endTime: "", description: "" });
  // setSelectedEvent(null);
  // setIsCreateDialogOpen(false);
  // setIsDetailsDialogOpen(false);
  // };
  
  const handleUpdate = () =>{
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
      title: updatedData.title,
      startTime: newStartTime.toISOString(),
      endTime: newEndTime.toISOString(),
      description: updatedData.description,
    };

    onCreateEvent(newEvent);

    setFormData({ id: "", title: "", startTime: "", endTime: "", description: "" });

    setIsUpdateDialogOpen(false)

  }


  const handleCreate = () =>{
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

    setFormData({ id: "", title: "", startTime: "", endTime: "", description: "" });
    setIsCreateDialogOpen(false);
  }
  

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
                  onClick={() => handleEventClick(event)}
                >
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Start:</strong> {formatTime(event.startTime)}
                    </p>
                    <p>
                      <strong>End:</strong> {formatTime(event.endTime)}
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

      {/* Event Details Dialog */}
      {isDetailsDialogOpen && selectedEvent && (
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
                  disabled={new Date(selectedEvent.startTime) <= new Date()}
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

      {/* Create Dialog */}
      {isCreateDialogOpen && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle> 
              <DialogDescription>Fill in the details for the event.</DialogDescription>
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
                Save Event 
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* { Update Dialog Box } */}
      {
        isUpdateDialogOpen && (
          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle> 
              <DialogDescription>Edit the details for the event.</DialogDescription>
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
                value={updatedData.description}
                onChange={handleUpdateChange}
              />
              <Button onClick={handleUpdate} className="w-full">
                Save Event 
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        )
      }
    </Dialog>
  );
};

export default EventDialog
