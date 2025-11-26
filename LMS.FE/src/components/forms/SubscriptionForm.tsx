import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateSubscriptionRequest, Student } from "@/types";

interface SubscriptionFormProps {
  students: Student[];
  onSubmit: (data: CreateSubscriptionRequest) => void;
  onCancel: () => void;
}

const packageOptions = [
  { value: "Basic Math Package", label: "Basic Math Package (8 sessions)" },
  { value: "Premium Math Package", label: "Premium Math Package (16 sessions)" },
  { value: "Advanced Math Package", label: "Advanced Math Package (24 sessions)" },
  { value: "Basic English Package", label: "Basic English Package (8 sessions)" },
  { value: "Premium English Package", label: "Premium English Package (16 sessions)" },
  { value: "Science Exploration Package", label: "Science Exploration Package (12 sessions)" },
  { value: "Art & Creativity Package", label: "Art & Creativity Package (10 sessions)" },
];

export function SubscriptionForm({ students, onSubmit, onCancel }: SubscriptionFormProps) {
  const [formData, setFormData] = useState<CreateSubscriptionRequest>({
    studentId: 0,
    packageName: "",
    startDate: "",
    endDate: "",
    totalSessions: 8,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateSubscriptionRequest, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateSubscriptionRequest, string>> = {};

    if (!formData.studentId || formData.studentId === 0) {
      newErrors.studentId = "Please select a student";
    }

    if (!formData.packageName.trim()) {
      newErrors.packageName = "Please select a package";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = "End date must be after start date";
    }

    if (formData.totalSessions < 1) {
      newErrors.totalSessions = "Total sessions must be at least 1";
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

  const handleInputChange = (field: keyof CreateSubscriptionRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePackageChange = (packageName: string) => {
    handleInputChange("packageName", packageName);
    
    // Auto-set sessions based on package
    if (packageName.includes("Basic")) {
      handleInputChange("totalSessions", 8);
    } else if (packageName.includes("Premium")) {
      handleInputChange("totalSessions", 16);
    } else if (packageName.includes("Advanced")) {
      handleInputChange("totalSessions", 24);
    } else if (packageName.includes("Science")) {
      handleInputChange("totalSessions", 12);
    } else if (packageName.includes("Art")) {
      handleInputChange("totalSessions", 10);
    }
  };

  // Auto-calculate end date when start date changes
  const handleStartDateChange = (startDate: string) => {
    handleInputChange("startDate", startDate);
    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 6); // Default 6 months duration
      handleInputChange("endDate", end.toISOString().split('T')[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="student">Student *</Label>
        <Select 
          value={formData.studentId.toString()} 
          onValueChange={(value) => handleInputChange("studentId", parseInt(value))}
        >
          <SelectTrigger className={errors.studentId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select student" />
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
        {errors.studentId && <p className="text-sm text-destructive">{errors.studentId}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="package">Package *</Label>
        <Select value={formData.packageName} onValueChange={handlePackageChange}>
          <SelectTrigger className={errors.packageName ? "border-destructive" : ""}>
            <SelectValue placeholder="Select package" />
          </SelectTrigger>
          <SelectContent>
            {packageOptions.map((pkg) => (
              <SelectItem key={pkg.value} value={pkg.value}>
                {pkg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.packageName && <p className="text-sm text-destructive">{errors.packageName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className={errors.startDate ? "border-destructive" : ""}
          />
          {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className={errors.endDate ? "border-destructive" : ""}
          />
          {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalSessions">Total Sessions *</Label>
        <Input
          id="totalSessions"
          type="number"
          min="1"
          value={formData.totalSessions}
          onChange={(e) => handleInputChange("totalSessions", parseInt(e.target.value))}
          className={errors.totalSessions ? "border-destructive" : ""}
        />
        {errors.totalSessions && <p className="text-sm text-destructive">{errors.totalSessions}</p>}
        <p className="text-xs text-muted-foreground">
          Number of sessions included in this package
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Create Subscription
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}