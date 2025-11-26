import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ParentResponse, StudentResponse, UpdateStudentRequest } from "@/types/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface EditStudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentResponse | null;
  parents: ParentResponse[];
  onUpdate: (id: number, data: UpdateStudentRequest) => void;
  isLoading?: boolean;
}

export function EditStudentDialog({
  isOpen,
  onClose,
  student,
  parents,
  onUpdate,
  isLoading = false
}: EditStudentDialogProps) {
  const [formData, setFormData] = useState<UpdateStudentRequest>({
    name: "",
    dateOfBirth: "",
    gender: 0,
    currentGrade: "",
    parentId: 0
  });

  // Reset form when student changes
  useEffect(() => {
    if (student) {
      // Format date for input type="date" (YYYY-MM-DD)
      const dateOfBirth = student.dateOfBirth 
        ? new Date(student.dateOfBirth).toISOString().split('T')[0]
        : "";
      
      setFormData({
        name: student.name || "",
        dateOfBirth: dateOfBirth,
        gender: student.gender ?? 0,
        currentGrade: student.currentGrade || "",
        parentId: student.parentId || 0
      });
    } else {
      // Reset form when student is null
      setFormData({
        name: "",
        dateOfBirth: "",
        gender: 0,
        currentGrade: "",
        parentId: 0
      });
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (student && !isLoading) {
      onUpdate(student.id, formData);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update {student.name}'s information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter student name"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select 
              value={formData.gender?.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, gender: parseInt(value) }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Male</SelectItem>
                <SelectItem value="0">Female</SelectItem>
                <SelectItem value="2">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="currentGrade">Current Grade</Label>
            <Input
              id="currentGrade"
              value={formData.currentGrade}
              onChange={(e) => setFormData(prev => ({ ...prev, currentGrade: e.target.value }))}
              placeholder="e.g., 8, 9, 10"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="parent">Parent</Label>
            <Select 
              value={formData.parentId && formData.parentId > 0 ? formData.parentId.toString() : undefined} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: parseInt(value) }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent" />
              </SelectTrigger>
              <SelectContent>
                {parents.map((parent) => (
                  <SelectItem key={parent.id} value={parent.id.toString()}>
                    <div className="flex flex-col">
                      <span>{parent.name}</span>
                      <span className="text-xs text-muted-foreground">{parent.phone}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                "Update Student"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
