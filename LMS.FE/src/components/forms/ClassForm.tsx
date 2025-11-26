import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateClassRequest } from "@/types";
import { useState } from "react";

interface ClassFormProps {
  onSubmit: (data: CreateClassRequest) => void;
  onCancel: () => void;
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

export function ClassForm({ onSubmit, onCancel }: ClassFormProps) {
  const [formData, setFormData] = useState<CreateClassRequest>({
    name: "",
    subject: "",
    dayOfWeek: 1, // Monday by default
    startTime: "",
    endTime: "",
    teacherName: "",
    maxStudents: 10,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateClassRequest, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateClassRequest, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Class name is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = "End time must be after start time";
    }

    if (!formData.teacherName.trim()) {
      newErrors.teacherName = "Teacher name is required";
    }

    if (formData.maxStudents < 1) {
      newErrors.maxStudents = "Maximum students must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Format time from "HH:mm" to "HH:mm:ss"
      const formattedData = {
        ...formData,
        startTime: formData.startTime ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime ? `${formData.endTime}:00` : formData.endTime,
      };
      onSubmit(formattedData);
    }
  };

  const handleInputChange = (field: keyof CreateClassRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Class Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="e.g., Math Basics"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          placeholder="e.g., Mathematics"
          className={errors.subject ? "border-destructive" : ""}
        />
        {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dayOfWeek">Day of Week *</Label>
        <Select 
          value={formData.dayOfWeek.toString()} 
          onValueChange={(value) => handleInputChange("dayOfWeek", parseInt(value))}
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
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
            className={errors.startTime ? "border-destructive" : ""}
          />
          {errors.startTime && <p className="text-sm text-destructive">{errors.startTime}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
            className={errors.endTime ? "border-destructive" : ""}
          />
          {errors.endTime && <p className="text-sm text-destructive">{errors.endTime}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="teacherName">Teacher Name *</Label>
        <Input
          id="teacherName"
          value={formData.teacherName}
          onChange={(e) => handleInputChange("teacherName", e.target.value)}
          placeholder="e.g., Teacher Nam"
          className={errors.teacherName ? "border-destructive" : ""}
        />
        {errors.teacherName && <p className="text-sm text-destructive">{errors.teacherName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxStudents">Maximum Students *</Label>
        <Input
          id="maxStudents"
          type="number"
          min="1"
          value={formData.maxStudents}
          onChange={(e) => handleInputChange("maxStudents", parseInt(e.target.value))}
          className={errors.maxStudents ? "border-destructive" : ""}
        />
        {errors.maxStudents && <p className="text-sm text-destructive">{errors.maxStudents}</p>}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Create Class
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}