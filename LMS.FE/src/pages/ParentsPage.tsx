import { EditParentDialog } from "@/components/EditParentDialog";
import { ParentForm } from "@/components/forms/ParentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useCreateParent, useDeleteParent, useParents, useUpdateParent } from "@/hooks/useApi";
import { CreateParentRequest, ParentResponse } from "@/types/api";
import { Edit, Eye, Loader2, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ParentsPage() {
  const { data: parents, isLoading: parentsLoading, error: parentsError } = useParents();
  const createParentMutation = useCreateParent();
  const updateParentMutation = useUpdateParent();
  const deleteParentMutation = useDeleteParent();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentResponse | null>(null);
  const { toast } = useToast();

  const handleAddParent = async (parentData: CreateParentRequest) => {
    try {
      await createParentMutation.mutateAsync(parentData);
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Parent added successfully!",
      });
    } catch (error: any) {
      // Extract detailed error message from backend
      let errorMessage = "Failed to add parent. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        // Remove "System.InvalidOperationException: " prefix if present
        errorMessage = errorMessage.replace(/^System\.InvalidOperationException:\s*/i, '');
      } else if (error?.response?.data) {
        // Sometimes error is directly in response.data
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.toString();
        errorMessage = errorMessage.replace(/^System\.InvalidOperationException:\s*/i, '');
      } else if (error?.message) {
        errorMessage = error.message;
        errorMessage = errorMessage.replace(/^System\.InvalidOperationException:\s*/i, '');
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEditParent = (parent: ParentResponse) => {
    setSelectedParent(parent);
    setIsEditOpen(true);
  };

  const handleUpdateParent = async (id: number, data: any) => {
    try {
      await updateParentMutation.mutateAsync({ id, data });
      setIsEditOpen(false);
      setSelectedParent(null);
      toast({
        title: "Success",
        description: "Parent updated successfully!",
      });
    } catch (error: any) {
      // Extract detailed error message from backend
      let errorMessage = "Failed to update parent. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        // Remove "System.InvalidOperationException: " prefix if present
        errorMessage = errorMessage.replace(/^System\.InvalidOperationException:\s*/i, '');
      } else if (error?.response?.data) {
        // Sometimes error is directly in response.data
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.toString();
        errorMessage = errorMessage.replace(/^System\.InvalidOperationException:\s*/i, '');
      } else if (error?.message) {
        errorMessage = error.message;
        errorMessage = errorMessage.replace(/^System\.InvalidOperationException:\s*/i, '');
      }
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteParent = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will also affect their children's records.`)) {
      try {
        await deleteParentMutation.mutateAsync(id);
        toast({
          title: "Success",
          description: "Parent deleted successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete parent. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (parentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading parents...</span>
      </div>
    );
  }

  if (parentsError) {
    return (
      <div className="text-center text-red-600">
        Error loading parents: {parentsError.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">Parents Management</h1>
          <p className="text-muted-foreground text-sm md:text-lg">Manage and organize parent information</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto h-12 md:h-auto">
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">Add Parent</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">Add New Parent</DialogTitle>
            </DialogHeader>
            <ParentForm 
              onSubmit={handleAddParent}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Parents Table */}
      <Card className="border shadow-lg">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                All Parents
                <span className="text-base font-normal ml-2 text-muted-foreground">
                  ({parents?.length || 0})
                </span>
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Complete list of all registered parents
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold text-sm md:text-base h-12 whitespace-nowrap">Name</TableHead>
                  <TableHead className="font-semibold text-sm md:text-base whitespace-nowrap hidden sm:table-cell">Phone</TableHead>
                  <TableHead className="font-semibold text-sm md:text-base whitespace-nowrap hidden md:table-cell">Email</TableHead>
                  <TableHead className="text-right font-semibold text-sm md:text-base whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parents && parents.length > 0 ? (
                  parents.map((parent, index) => (
                    <TableRow 
                      key={parent.id} 
                      className={`hover:bg-muted/50 transition-colors ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }`}
                    >
                      <TableCell className="font-medium py-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-foreground block truncate">{parent.name}</span>
                            <div className="sm:hidden text-xs text-muted-foreground mt-1">
                              <div>{parent.phone}</div>
                              <div className="truncate">{parent.email}</div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 hidden sm:table-cell whitespace-nowrap">
                        <span className="text-muted-foreground">{parent.phone}</span>
                      </TableCell>
                      <TableCell className="py-4 hidden md:table-cell">
                        <span className="text-muted-foreground truncate block max-w-xs">{parent.email}</span>
                      </TableCell>                  
                      <TableCell className="text-right py-4">
                        <div className="flex items-center justify-end gap-1 md:gap-2">                       
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                            className="gap-1 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all"
                            title="View"
                          >
                            <Link to={`/parents/${parent.id}`}>
                              <Eye className="h-3 w-3 md:h-4 md:w-4" />
                              <span className="hidden lg:inline">View</span>
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditParent(parent)}
                            className="gap-1 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all"
                            title="Edit"
                          >
                            <Edit className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="hidden lg:inline">Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteParent(parent.id, parent.name)}
                            className="gap-1 text-destructive hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all"
                            disabled={deleteParentMutation.isPending}
                            title="Delete"
                          >
                            {deleteParentMutation.isPending ? (
                              <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                            )}
                            <span className="hidden lg:inline">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-foreground">No parents found</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Get started by adding a new parent
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Parent Dialog */}
      <EditParentDialog
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedParent(null);
        }}
        parent={selectedParent}
        onUpdate={handleUpdateParent}
        isLoading={updateParentMutation.isPending}
      />
    </div>
  );
}