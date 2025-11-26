import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useClass, useRegisterStudentToClass, useStudents } from "@/hooks/useApi";
import { ArrowLeft, Check, Clock, GraduationCap, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ClassRegisterPage() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const classIdNum = classId ? parseInt(classId) : 0;
  
  const { data: classData, isLoading: classLoading, error: classError } = useClass(classIdNum);
  const { data: students, isLoading: studentsLoading } = useStudents();
  const registerStudentMutation = useRegisterStudentToClass();
  
  const { toast } = useToast();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  useEffect(() => {
    document.title = classData ? `Register Student – ${classData.name}` : "Register Student";
  }, [classData]);

  const handleRegister = async () => {
    if (!selectedStudentId || !classData || classData.full) return;
    
    try {
      await registerStudentMutation.mutateAsync({
        classId: classData.id,
        data: { studentId: parseInt(selectedStudentId) }
      });
      
      toast({ 
        title: "Success", 
        description: "Student registered successfully!" 
      });
      navigate("/classes");
    } catch (error: any) {
      // Extract error message from backend
      let errorMessage = "Failed to register student. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (classLoading || studentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading class details...</span>
      </div>
    );
  }

  if (classError || !classData) {
    return (
      <div className="space-y-4">
        <Link to="/classes">
          <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Class not found</CardTitle>
            <CardDescription>
              {classError ? `Error: ${classError.message}` : "We couldn't find this class."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/classes">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back to Classes</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground">Register Student</h1>
          <p className="text-muted-foreground text-sm md:text-lg mt-1 truncate">Add a student to {classData.name}</p>
        </div>
      </div>

      {/* Class Information */}
      <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl text-foreground">{classData.name}</CardTitle>
              <CardDescription className="text-base mt-1">{classData.subject}</CardDescription>
            </div>
            <Badge variant={classData.full ? "destructive" : "default"} className="h-fit">
              {classData.full ? "Full" : "Available"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground mb-1">Time</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary/60" />
                <span className="font-semibold">{classData.timeSlot}</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground mb-1">Enrollment</p>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary/60" />
                <span className="font-semibold">{classData.currentStudentsCount}/{classData.maxStudents}</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground mb-1">Day</p>
              <span className="font-semibold">{classData.dayOfWeek}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground mb-1">Teacher</p>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary/60" />
                <span className="font-semibold text-sm">{classData.teacherName}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Selection */}
      <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
          <CardTitle>Select Student to Register</CardTitle>
          <CardDescription>Choose a student to add to this class</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <Label htmlFor="student" className="text-base mb-3 block">Student</Label>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select a student to register" />
              </SelectTrigger>
              <SelectContent>
                {students?.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{student.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Grade {student.currentGrade} • {student.parent?.name ?? student.parentName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => navigate("/classes")}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRegister}
              disabled={!selectedStudentId || classData.full || registerStudentMutation.isPending}
              className="gap-2 px-6"
              size="lg"
            >
              {registerStudentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Register Student
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
