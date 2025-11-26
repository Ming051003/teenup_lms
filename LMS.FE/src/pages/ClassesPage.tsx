import { ClassSchedule } from "@/components/ClassSchedule";
import { RegisterStudentDialog } from "@/components/RegisterStudentDialog";
import { useToast } from "@/hooks/use-toast";
import { useRegisterStudentToClass, useStudents } from "@/hooks/useApi";
import { ClassResponse } from "@/types/api";
import { useState } from "react";

export default function ClassesPage() {
  const { data: students } = useStudents();
  const registerStudentMutation = useRegisterStudentToClass();

  const [selectedClass, setSelectedClass] = useState<ClassResponse | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { toast } = useToast();

  const handleRegisterStudent = async (classId: number, studentId: number) => {
    try {
      await registerStudentMutation.mutateAsync({
        classId,
        data: { studentId }
      });
      setIsRegisterOpen(false);
      setSelectedClass(null);
      toast({
        title: "Success",
        description: "Student registered successfully!",
      });
    } catch (error) {
      // Extract detailed error message from backend
      let errorMessage = "Failed to register student. Please try again.";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.response?.data?.message) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errorMessage = (error as any).response.data.message;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((error as any)?.message) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errorMessage = (error as any).message;
      }

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const openRegisterDialog = (classItem: ClassResponse) => {
    setSelectedClass(classItem);
    setIsRegisterOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 border border-primary/20">
        <h1 className="text-3xl font-bold text-foreground mb-2">Classes</h1>
        <p className="text-muted-foreground">Manage class schedules and enrollment</p>
      </div>

      {/* Class Schedule */}
      <ClassSchedule onRegisterStudent={openRegisterDialog} />

      {/* Register Student Dialog */}
      {selectedClass && (
        <RegisterStudentDialog
          isOpen={isRegisterOpen}
          onClose={() => {
            setIsRegisterOpen(false);
            setSelectedClass(null);
          }}
          classItem={selectedClass}
          students={students || []}
          onRegister={handleRegisterStudent}
          isLoading={registerStudentMutation.isPending}
        />
      )}
    </div>
  );
}