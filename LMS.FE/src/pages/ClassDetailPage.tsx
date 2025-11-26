import { RegisterStudentDialog } from "@/components/RegisterStudentDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useClass, useRegisterStudentToClass, useStudents } from "@/hooks/useApi";
import { ArrowLeft, BookOpen, Calendar, Clock, Loader2, User, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const classId = id ? parseInt(id) : 0;

  const { data: classData, isLoading: classLoading, error: classError } = useClass(classId);
  const { data: students } = useStudents();
  const registerStudentMutation = useRegisterStudentToClass();
  const { toast } = useToast();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'CANCELLED' | 'ALL'>('ALL');

  useEffect(() => {
    document.title = classData ? `${classData.name} – Class Details` : "Class Details";
  }, [classData]);

  const handleRegisterStudent = async (classId: number, studentId: number) => {
    try {
      await registerStudentMutation.mutateAsync({
        classId,
        data: { studentId }
      });
      setIsRegisterOpen(false);
      toast({
        title: "Success",
        description: "Student registered successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to register student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLoading = classLoading;
  const error = classError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading class details...</span>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="space-y-4">
        <Link to="/classes">
          <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Class not found</CardTitle>
            <CardDescription>
              {error ? `Error: ${error.message}` : "We couldn't find this class."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Note: classDetails API is not available, using empty array for now
  const filteredStudents: any[] = [];

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/classes">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back to Classes</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground truncate">{classData.name}</h1>
          <p className="text-muted-foreground text-sm md:text-lg mt-1">{classData.subject}</p>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Class Information - Main Card */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Class Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Class Information */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-primary/10">
                  <h3 className="text-lg font-bold text-foreground">Schedule</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors">
                      <Calendar className="h-5 w-5 text-primary/60" />
                      <div>
                        <p className="text-xs text-muted-foreground">Day</p>
                        <span className="text-sm font-semibold">{classData.dayOfWeek}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors">
                      <Clock className="h-5 w-5 text-primary/60" />
                      <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <span className="text-sm font-semibold">{classData.startTime} - {classData.endTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors">
                      <User className="h-5 w-5 text-primary/60" />
                      <div>
                        <p className="text-xs text-muted-foreground">Teacher</p>
                        <span className="text-sm font-semibold">{classData.teacherName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrollment Information */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-primary/10">
                  <h3 className="text-lg font-bold text-foreground">Enrollment</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Capacity</span>
                        <span className="text-sm font-bold">{classData.currentStudentsCount}/{classData.maxStudents}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${classData.full ? "bg-red-500" : "bg-green-500"}`}
                          style={{ width: `${(classData.currentStudentsCount / classData.maxStudents) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{Math.round((classData.currentStudentsCount / classData.maxStudents) * 100)}% full</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Badge variant={classData.full ? "destructive" : "default"} className="text-base px-3 py-1">
                        {classData.full ? "Full" : "Available"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-muted-foreground">Class ID</p>
                    <p className="font-semibold">{classData.id}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-muted-foreground">Subject</p>
                    <p className="font-semibold text-sm">{classData.subject}</p>
                  </div>
                  {classData.createdAt && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="font-semibold text-sm">{new Date(classData.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => setIsRegisterOpen(true)}
                  disabled={classData.full}
                  className="gap-2 flex-1"
                >
                  <UserPlus className="h-4 w-4" />
                  Register Student
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Students Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors sticky top-6">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Students <span className="text-xs font-normal bg-primary/10 px-2 py-0.5 rounded-full ml-auto">0</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Status Filter */}
              <div className="mb-4">
                <Select
                  onValueChange={(value: any) => setStatusFilter(value)}
                  defaultValue="ALL"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Students</SelectItem>
                    <SelectItem value="ACTIVE">Active Only</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredStudents && filteredStudents.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="p-3 rounded-lg border border-primary/10 hover:border-primary/30 hover:bg-accent transition-all group">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/students/${student.id}`}
                          className="font-semibold text-primary hover:underline text-sm flex-1"
                        >
                          {student.name}
                        </Link>
                        <Badge
                          variant={student.registrationStatus === 'ACTIVE' ? 'default' : 'secondary'}
                          className="text-xs px-2 py-0.5"
                        >
                          {student.registrationStatus}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 space-y-1">
                        <p>Grade {student.currentGrade}</p>
                        <p className="truncate">Parent: {student.parentName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No students {statusFilter !== 'ALL' ? 'in this status' : 'yet'}</p>
                  {classData.full === false && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => setIsRegisterOpen(true)}
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Register First
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Register Student Dialog */}
      <RegisterStudentDialog
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        classItem={classData}
        students={students || []}
        onRegister={handleRegisterStudent}
        isLoading={registerStudentMutation.isPending}
      />
    </div>
  );
}
