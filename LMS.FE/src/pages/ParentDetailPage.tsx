import { EditParentDialog } from "@/components/EditParentDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDeleteParent, useParent, useUpdateParent } from "@/hooks/useApi";
import { ArrowLeft, Edit, Loader2, Mail, Phone, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ParentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const parentId = id ? parseInt(id) : 0;
  const { data: parent, isLoading, error } = useParent(parentId);
  const updateParentMutation = useUpdateParent();
  const deleteParentMutation = useDeleteParent();
  const { toast } = useToast();

  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    document.title = parent ? `${parent.name} – Parent Details` : "Parent Details";
  }, [parent]);

  const handleUpdateParent = async (id: number, data: any) => {
    try {
      await updateParentMutation.mutateAsync({ id, data });
      setIsEditOpen(false);
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

  const handleDeleteParent = async () => {
    if (!parent) return;
    
    if (window.confirm(`Are you sure you want to delete ${parent.name}? This will also affect their children's records and cannot be undone.`)) {
      try {
        await deleteParentMutation.mutateAsync(parent.id);
        toast({
          title: "Success",
          description: "Parent deleted successfully!",
        });
        navigate("/parents");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete parent. Please try again.",
          variant: "destructive",
        });
      }
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading parent details...</span>
      </div>
    );
  }

  if (error || !parent) {
    return (
      <div className="space-y-4">
        <Link to="/parents">
          <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Parent not found</CardTitle>
            <CardDescription>
              {error ? `Error: ${error.message}` : "We couldn't find this parent."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-3 flex-1 min-w-0">
          <Link to="/parents">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" /> 
              <span className="hidden sm:inline">Back to Parents</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight truncate">{parent.name}</h1>
            <p className="text-muted-foreground text-sm md:text-lg mt-1">Parent/Guardian Information</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setIsEditOpen(true)}
            className="gap-2 shadow-sm hover:shadow transition-shadow"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteParent}
            disabled={deleteParentMutation.isPending}
            className="gap-2 shadow-sm hover:shadow transition-shadow"
          >
            {deleteParentMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="border shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              Contact Information
            </CardTitle>
            <CardDescription className="mt-2">
              Parent/Guardian contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-base font-semibold text-foreground">{parent.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Email</p>
                  <p className="text-base font-semibold text-foreground truncate">{parent.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

       
      </div>

      {/* Edit Parent Dialog */}
      <EditParentDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        parent={parent}
        onUpdate={handleUpdateParent}
        isLoading={updateParentMutation.isPending}
      />
    </div>
  );
}
