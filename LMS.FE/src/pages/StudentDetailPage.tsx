import { EditStudentDialog } from "@/components/EditStudentDialog";
import { SubscriptionForm } from "@/components/forms/SubscriptionForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCreateSubscription, useDeleteStudent, useParents, useStudent, useStudentDetails, useUpdateStudent } from "@/hooks/useApi";
import { CreateSubscriptionRequest } from "@/types/api";
import { ArrowLeft, BookOpen, Calendar, CreditCard, Edit, Loader2, Mail, Phone, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const studentId = id ? parseInt(id) : 0;
  
  // Use both hooks - student for basic info and studentDetails for classes
  const { data: student, isLoading: studentLoading, error: studentError } = useStudent(studentId);
  const { data: studentDetails, isLoading: detailsLoading, error: detailsError } = useStudentDetails(studentId);
  const { data: parents } = useParents();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();
  const createSubscriptionMutation = useCreateSubscription();
  const { toast } = useToast();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  useEffect(() => {
    document.title = student ? `${student.name} – Student Details` : "Student Details";
  }, [student]);

  const handleUpdateStudent = async (id: number, data: any) => {
    try {
      await updateStudentMutation.mutateAsync({ id, data });
      setIsEditOpen(false);
      toast({
        title: "Success",
        description: "Student updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async () => {
    if (!student) return;

    if (window.confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
      try {
        await deleteStudentMutation.mutateAsync(student.id);
        toast({
          title: "Success",
          description: "Student deleted successfully!",
        });
        navigate("/students");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete student. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateSubscription = async (subscriptionData: CreateSubscriptionRequest) => {
    try {
      const result = await createSubscriptionMutation.mutateAsync(subscriptionData);
      setIsSubscriptionOpen(false);
      toast({
        title: "Success",
        description: `Subscription created successfully! ID: ${result.id}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLoading = studentLoading || detailsLoading;
  const error = studentError || detailsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading student details...</span>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-4">
        <Link to="/students">
          <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Student not found</CardTitle>
            <CardDescription>
              {error ? `Error: ${error.message}` : "We couldn't find this student."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/students">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back to Students</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground truncate">{student.name}</h1>
          <p className="text-muted-foreground text-sm md:text-lg mt-1">Grade {student.currentGrade} • {student.gender === 1 ? 'Male' : student.gender === 0 ? 'Female' : 'Other'}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setIsEditOpen(true)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteStudent}
            disabled={deleteStudentMutation.isPending}
            className="gap-2"
          >
            {deleteStudentMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main Information Card */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Student Details */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-primary/10">
                  <h3 className="text-lg font-bold text-foreground">Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors">
                      <Calendar className="h-5 w-5 text-primary/60" />
                      <div>
                        <p className="text-xs text-muted-foreground">Date of Birth</p>
                        <span className="text-sm font-semibold">{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors">
                      <div className="h-5 w-5 flex items-center justify-center text-lg">
                        {student.gender === 1 ? '👦' : student.gender === 0 ? '👧' : '🧑'}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Gender</p>
                        <span className="text-sm font-semibold">{student.gender === 1 ? 'Male' : student.gender === 0 ? 'Female' : 'Other'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors">
                      <div className="h-5 w-5 flex items-center justify-center text-lg">
                        📚
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Grade</p>
                        <span className="text-sm font-semibold">{student.currentGrade}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-primary/10">
                  <h3 className="text-lg font-bold text-foreground">Parent/Guardian</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors group">
                      <User className="h-5 w-5 text-primary/60" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Name</p>
                        {student.parent ? (
                          <Link 
                            to={`/parents/${student.parent.id}`}
                            className="text-sm font-semibold group-hover:text-primary transition-colors hover:underline"
                          >
                            {student.parent.name}
                          </Link>
                        ) : (
                          <span className="text-sm font-semibold">{student.parentName}</span>
                        )}
                      </div>
                    </div>
                    {student.parent && (
                      <>
                        <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors">
                          <Phone className="h-5 w-5 text-primary/60" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <span className="text-sm font-semibold">{student.parent.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors">
                          <Mail className="h-5 w-5 text-primary/60" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Email</p>
                            <span className="text-sm font-semibold truncate">{student.parent.email}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-muted-foreground">Student ID</p>
                    <p className="font-semibold">{student.id}</p>
                  </div>
                  {student.createdAt && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-muted-foreground">Registered</p>
                      <p className="font-semibold text-sm">{new Date(student.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge className="mt-1">Active</Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Dialog open={isSubscriptionOpen} onOpenChange={setIsSubscriptionOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 flex-1">
                      <CreditCard className="h-4 w-4" />
                      Create Subscription
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create Subscription for {student.name}</DialogTitle>
                    </DialogHeader>
                    <SubscriptionForm 
                      students={[student]}
                      onSubmit={handleCreateSubscription}
                      onCancel={() => setIsSubscriptionOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Classes Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors sticky top-6">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                Classes <span className="text-xs font-normal bg-primary/10 px-2 py-0.5 rounded-full ml-auto">{studentDetails?.classes?.length || 0}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {studentDetails?.classes && studentDetails.classes.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {studentDetails.classes.map((classInfo) => (
                    <Link key={classInfo.id} to={`/classes/${classInfo.id}`} className="block group">
                      <div className="p-3 rounded-lg border border-primary/10 hover:border-primary/30 hover:bg-accent transition-all">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary">{classInfo.name}</h4>
                          <Badge 
                            variant={classInfo.registrationStatus === 'ACTIVE' ? 'default' : 'secondary'}
                            className="text-xs px-2 py-0.5"
                          >
                            {classInfo.registrationStatus}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📚</span>
                            <span>{classInfo.subject}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📅</span>
                            <span>{classInfo.dayOfWeek}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">⏰</span>
                            <span>{classInfo.timeSlot}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <h3 className="text-sm font-semibold mb-1">No Classes Yet</h3>
                  <p className="text-xs mb-3">Not enrolled in any classes</p>
                  <Button asChild variant="outline" size="sm" className="w-full text-xs">
                    <Link to="/classes">
                      Browse Classes
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Student Dialog */}
      <EditStudentDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        student={student}
        parents={parents || []}
        onUpdate={handleUpdateStudent}
        isLoading={updateStudentMutation.isPending}
      />
    </div>
  );
}
