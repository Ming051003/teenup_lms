import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateStudentRequest, Parent } from "@/types";
import { useState } from "react";

interface StudentFormProps {
  parents: Parent[];
  onSubmit: (data: CreateStudentRequest) => void;
  onCancel: () => void;
}

export function StudentForm({ parents, onSubmit, onCancel }: StudentFormProps) {
  const [formData, setFormData] = useState<CreateStudentRequest>({
    name: "",
    dateOfBirth: "",
    gender: 0,
    currentGrade: "",
    parentId: 0,
  });

  const [errors, setErrors] = useState<Partial<CreateStudentRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateStudentRequest> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.currentGrade.trim()) {
      newErrors.currentGrade = "Current grade is required";
    }

    if (!formData.parentId || formData.parentId === 0) {
      newErrors.parentId = "Please select a parent" as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CreateStudentRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Student Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter student's full name"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          className={errors.dateOfBirth ? "border-destructive" : ""}
        />
        {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender *</Label>
        <Select value={formData.gender.toString()} onValueChange={(value) => handleInputChange("gender", parseInt(value))}>
          <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Male</SelectItem>
            <SelectItem value="0">Female</SelectItem>
            <SelectItem value="2">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="grade">Current Grade *</Label>
        <Input
          id="grade"
          value={formData.currentGrade}
          onChange={(e) => handleInputChange("currentGrade", e.target.value)}
          placeholder="e.g., 6, 7, 8"
          className={errors.currentGrade ? "border-destructive" : ""}
        />
        {errors.currentGrade && <p className="text-sm text-destructive">{errors.currentGrade}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent">Parent *</Label>
        <Select value={formData.parentId.toString()} onValueChange={(value) => handleInputChange("parentId", parseInt(value))}>
          <SelectTrigger className={errors.parentId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select parent" />
          </SelectTrigger>
          <SelectContent>
            {parents.map((parent) => (
              <SelectItem key={parent.id} value={parent.id.toString()}>
                {parent.name} ({parent.phone})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.parentId && <p className="text-sm text-destructive">{errors.parentId}</p>}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Add Student
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}