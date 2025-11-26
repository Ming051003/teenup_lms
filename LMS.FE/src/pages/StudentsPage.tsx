import { EditStudentDialog } from "@/components/EditStudentDialog";
import { StudentForm } from "@/components/forms/StudentForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useCreateStudent, useDeleteStudent, useParents, useStudents, useUpdateStudent } from "@/hooks/useApi";
import { CreateStudentRequest, StudentResponse } from "@/types/api";
import { Edit, Loader2, Plus, Trash2, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function StudentsPage() {
  const { data: students, isLoading: studentsLoading, error: studentsError } = useStudents();
  const { data: parents, isLoading: parentsLoading } = useParents();
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);
  const { toast } = useToast();

  const handleAddStudent = async (studentData: CreateStudentRequest) => {
    try {
      await createStudentMutation.mutateAsync(studentData);
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Student added successfully!",
      });
    } catch (error: any) {
      // Extract detailed error message from backend
      let errorMessage = "Failed to add student. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEditStudent = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsEditOpen(true);
  };

  const handleUpdateStudent = async (id: number, data: any) => {
    try {
      await updateStudentMutation.mutateAsync({ id, data });
      setIsEditOpen(false);
      setSelectedStudent(null);
      toast({
        title: "Success",
        description: "Student updated successfully!",
      });
    } catch (error: any) {
      let errorMessage = "Failed to update student. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteStudentMutation.mutateAsync(id);
        toast({
          title: "Success",
          description: "Student deleted successfully!",
        });
      } catch (error: any) {
        let errorMessage = "Failed to delete student. Please try again.";
        
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  if (studentsLoading || parentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading students...</span>
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className="text-center text-red-600">
        Error loading students: {studentsError.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 md:p-8 flex-1 border border-primary/20 w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Students</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage registered students</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 h-12 md:h-14 px-4 md:px-6 w-full sm:w-auto">
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">Add Student</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <StudentForm 
              parents={parents || []}
              onSubmit={handleAddStudent}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Students Table */}
      <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors shadow-sm">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <UserCheck className="h-6 w-6 text-primary" />
            All Students <span className="text-sm font-normal ml-2 text-muted-foreground">({students?.length || 0})</span>
          </CardTitle>
          <CardDescription>
            Complete list of registered students and their parent information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-primary/10 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-primary/10">
                  <TableHead className="font-semibold whitespace-nowrap">Name</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap hidden sm:table-cell">Grade</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap hidden md:table-cell">Gender</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap hidden lg:table-cell">Date of Birth</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap hidden md:table-cell">Parent</TableHead>
                  <TableHead className="text-right font-semibold whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {students?.map((student, index) => (
                  <TableRow key={student.id} className={`${index % 2 === 0 ? "bg-white/50" : "bg-slate-50/50"} hover:bg-primary/5 transition-colors border-primary/10`}>
                    <TableCell className="font-semibold text-foreground">
                      <div className="space-y-1">
                        <Link to={`/students/${student.id}`} className="hover:text-primary block">
                          {student.name}
                        </Link>
                        <div className="sm:hidden text-xs text-muted-foreground">
                          <Badge variant="outline" className="bg-blue-100/50 text-blue-700 border-blue-300 mr-2">
                            {student.currentGrade}
                          </Badge>
                          <span className="text-muted-foreground">{student.parent.name}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="bg-blue-100/50 text-blue-700 border-blue-300">
                        {student.currentGrade}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge>
                        {student.gender === 1 ? '👦 Male' : student.gender === 0 ? '👧 Female' : '🧑 Other'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                      {new Date(student.dateOfBirth).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-foreground hidden md:table-cell">{student.parent.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 md:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStudent(student)}
                          className="gap-1 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="hidden lg:inline">Edit</span>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="hover:bg-green-50">
                          <Link to={`/students/${student.id}`} title="View Details">
                            <span className="hidden lg:inline">View</span>
                            <span className="lg:hidden">👁</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteStudent(student.id, student.name)}
                          className="gap-1 text-destructive hover:bg-red-50 hover:text-red-600"
                          disabled={deleteStudentMutation.isPending}
                          title="Delete"
                        >
                          {deleteStudentMutation.isPending ? (
                            <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                          )}
                          <span className="hidden lg:inline">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-40" />
                      <p>No students found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Student Dialog */}
      <EditStudentDialog
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        parents={parents || []}
        onUpdate={handleUpdateStudent}
        isLoading={updateStudentMutation.isPending}
      />
    </div>
  );
}