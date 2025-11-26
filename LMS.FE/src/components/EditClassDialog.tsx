import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassResponse, UpdateClassRequest } from "@/types/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface EditClassDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: ClassResponse | null;
  onUpdate: (id: number, data: UpdateClassRequest) => void;
  isLoading?: boolean;
}

// Map day number (0-6) to day labels
// 0 = Sunday, 1 = Monday, 2 = Tuesday, ..., 6 = Saturday
const daysOfWeek: { value: number; label: string }[] = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

// Convert DayOfWeek string to number (0-6)
const dayOfWeekToNumber = (day: string): number => {
  const mapping: Record<string, number> = {
    'SUNDAY': 0,
    'MONDAY': 1,
    'TUESDAY': 2,
    'WEDNESDAY': 3,
    'THURSDAY': 4,
    'FRIDAY': 5,
    'SATURDAY': 6,
  };
  return mapping[day] ?? 1; // Default to Monday if not found
};

export function EditClassDialog({
  isOpen,
  onClose,
  classItem,
  onUpdate,
  isLoading = false
}: EditClassDialogProps) {
  const [formData, setFormData] = useState<UpdateClassRequest>({
    name: "",
    subject: "",
    dayOfWeek: 1,
    startTime: "",
    endTime: "",
    teacherName: "",
    maxStudents: 1
  });

  // Reset form when class changes
  useEffect(() => {
    if (classItem) {
      // Format time from "HH:mm:ss" to "HH:mm" for input type="time"
      const formatTimeForInput = (time: string) => {
        if (!time) return "";
        // If already in HH:mm format, return as is
        if (time.length === 5) return time;
        // If in HH:mm:ss format, remove seconds
        if (time.length === 8) return time.substring(0, 5);
        return time;
      };
      
      setFormData({
        name: classItem.name,
        subject: classItem.subject,
        dayOfWeek: dayOfWeekToNumber(classItem.dayOfWeek), // Convert DayOfWeek string to number (0-6)
        startTime: formatTimeForInput(classItem.startTime),
        endTime: formatTimeForInput(classItem.endTime),
        teacherName: classItem.teacherName,
        maxStudents: classItem.maxStudents
      });
    }
  }, [classItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classItem && !isLoading) {
      // Format time from "HH:mm" to "HH:mm:ss"
      const formattedData = {
        ...formData,
        startTime: formData.startTime ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime ? `${formData.endTime}:00` : formData.endTime,
      };
      onUpdate(classItem.id, formattedData);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!classItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>
            Update {classItem.name} information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Class Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter class name"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter subject"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="dayOfWeek">Day of Week</Label>
            <Select 
              value={formData.dayOfWeek?.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, dayOfWeek: parseInt(value) }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="teacherName">Teacher Name</Label>
            <Input
              id="teacherName"
              value={formData.teacherName}
              onChange={(e) => setFormData(prev => ({ ...prev, teacherName: e.target.value }))}
              placeholder="Enter teacher name"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="maxStudents">Maximum Students</Label>
            <Input
              id="maxStudents"
              type="number"
              min="1"
              value={formData.maxStudents}
              onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) }))}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Class"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
