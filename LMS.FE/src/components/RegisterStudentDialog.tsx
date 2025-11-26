import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassResponse, StudentResponse } from "@/types/api";
import { Clock, GraduationCap, Loader2, Users } from "lucide-react";
import { useState } from "react";

interface RegisterStudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: ClassResponse;
  students: StudentResponse[];
  onRegister: (classId: number, studentId: number) => void;
  isLoading?: boolean;
}

export function RegisterStudentDialog({
  isOpen,
  onClose,
  classItem,
  students,
  onRegister,
  isLoading = false
}: RegisterStudentDialogProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  // Format time from "HH:mm:ss" to "HH:mm"
  const formatTime = (time: string): string => {
    if (!time) return "";
    if (time.length === 5) return time;
    if (time.length === 8) return time.substring(0, 5);
    return time;
  };

  // Create timeSlot from startTime and endTime
  const getTimeSlot = (): string => {
    if (classItem.timeSlot) return classItem.timeSlot;
    const start = formatTime(classItem.startTime);
    const end = formatTime(classItem.endTime);
    return `${start} - ${end}`;
  };

  const handleRegister = () => {
    if (selectedStudentId && !isLoading) {
      onRegister(classItem.id, parseInt(selectedStudentId));
      setSelectedStudentId("");
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedStudentId("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Register Student to Class</DialogTitle>
          <DialogDescription>
            Add a student to {classItem.name}
          </DialogDescription>
        </DialogHeader>

        {/* Class Information */}
        <div className="space-y-4 p-4 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent rounded-lg border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-lg text-foreground">{classItem.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">{classItem.subject}</p>
            </div>
            <Badge variant={classItem.full ? "destructive" : "default"}>
              {classItem.full ? "Full" : "Available"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Time Slot */}
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-primary/10">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Time</p>
                <p className="text-sm font-semibold text-foreground">{getTimeSlot()}</p>
              </div>
            </div>

            {/* Teacher */}
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-primary/10">
              <div className="p-2 bg-primary/10 rounded-lg">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Teacher</p>
                <p className="text-sm font-semibold text-foreground">{classItem.teacherName}</p>
              </div>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-primary/10">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Capacity</p>
                <p className="text-sm font-semibold text-foreground">
                 {classItem.maxStudents} students
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Selection */}
        <div className="space-y-2">
          <Label htmlFor="student">Select Student</Label>
          <Select
            value={selectedStudentId}
            onValueChange={setSelectedStudentId}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a student to register" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  <div className="flex flex-col">
                    <span>{student.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Grade {student.currentGrade} • {student.parent?.name ?? student.parentName}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRegister} 
            disabled={!selectedStudentId || classItem.full || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register Student"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}