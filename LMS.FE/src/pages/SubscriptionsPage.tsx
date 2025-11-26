import { SubscriptionForm } from "@/components/forms/SubscriptionForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useCreateSubscription, useStudents, useSubscriptions, useUseSession } from "@/hooks/useApi";
import { CreateSubscriptionRequest, SubscriptionResponse, SubscriptionStatus } from "@/types/api";
import { CreditCard, Eye, Loader2, Play, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SubscriptionsPage() {
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: subscriptions, isLoading: subscriptionsLoading, error: subscriptionsError } = useSubscriptions();
  const createSubscriptionMutation = useCreateSubscription();
  const useSessionMutation = useUseSession();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  // Helper function to convert status number to string
  // Mapping based on backend logic:
  // 0 = EXPIRED (hết hạn - EndDate < hôm nay)
  // 1 = ACTIVE (đang hoạt động)
  // 2 = COMPLETED (dùng hết buổi - UsedSessions >= TotalSessions)
  const getStatusString = (status: SubscriptionStatus | number): SubscriptionStatus => {
    if (typeof status === 'string') return status;
    switch (status) {
      case 0: return 'EXPIRED';
      case 1: return 'ACTIVE';
      case 2: return 'COMPLETED';
      default: return 'EXPIRED';
    }
  };

  // Calculate remaining sessions if not provided
  const getRemainingSessions = (sub: SubscriptionResponse): number => {
    if (sub.remainingSessions !== undefined) {
      return sub.remainingSessions;
    }
    return (sub.totalSessions || 0) - (sub.usedSessions || 0);
  };

  const handleAddSubscription = async (subscriptionData: CreateSubscriptionRequest) => {
    try {
      const result = await createSubscriptionMutation.mutateAsync(subscriptionData);
      setIsFormOpen(false);
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


  const handleUseSession = async (id: number) => {
    // Find the subscription to validate before making API call
    const subscription = subscriptions?.find(sub => sub.id === id);
    
    if (!subscription) {
      toast({
        title: "Error",
        description: "Subscription not found.",
        variant: "destructive",
      });
      return;
    }

    const status = getStatusString(subscription.status);
    const remainingSessions = getRemainingSessions(subscription);

    // Frontend validation before API call
    if (status !== 'ACTIVE') {
      toast({
        title: "Cannot Use Session",
        description: `Subscription is ${status.toLowerCase()}, not active.`,
        variant: "destructive",
      });
      return;
    }

    if (remainingSessions <= 0) {
      toast({
        title: "Cannot Use Session",
        description: "No remaining sessions available.",
        variant: "destructive",
      });
      return;
    }

    try {
      await useSessionMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Session used successfully!",
      });
    } catch (error: any) {
      // Better error handling with specific backend error messages
      let errorMessage = "Failed to use session. Please try again.";
      
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

  const getStatusBadgeVariant = (status: SubscriptionStatus) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'EXPIRED': return 'destructive';
      case 'COMPLETED': return 'secondary';
      default: return 'outline';
    }
  };

  if (studentsLoading || subscriptionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading subscriptions...</span>
      </div>
    );
  }

  if (subscriptionsError) {
    return (
      <div className="text-center text-red-600">
        Error loading subscriptions: {subscriptionsError.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 md:p-8 flex-1 border border-primary/20 w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Subscriptions</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage student subscription packages</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 h-12 md:h-14 px-4 md:px-6 w-full sm:w-auto">
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">New Subscription</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Subscription</DialogTitle>
            </DialogHeader>
            <SubscriptionForm 
              students={students || []}
              onSubmit={handleAddSubscription}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Subscriptions Table */}
      <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors shadow-sm">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CreditCard className="h-6 w-6 text-primary" />
            All Subscriptions <span className="text-sm font-normal ml-2 text-muted-foreground">({subscriptions?.length || 0})</span>
          </CardTitle>
          <CardDescription>
            Complete list of student subscriptions and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-primary/10 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-primary/10">
                  <TableHead className="font-semibold whitespace-nowrap">Package Name</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap hidden sm:table-cell">Student</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">Status</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap hidden md:table-cell">Sessions</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap hidden lg:table-cell">Period</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap hidden xl:table-cell">Created</TableHead>
                  <TableHead className="text-right font-semibold whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions?.map((subscription, index) => {
                  const status = getStatusString(subscription.status);
                  const remainingSessions = getRemainingSessions(subscription);
                  // Get student name from subscription or find in students list
                  const student = students?.find(s => s.id === subscription.studentId);
                  const studentName = subscription.studentName || student?.name || `Student #${subscription.studentId}`;
                  
                  return (
                  <TableRow key={subscription.id} className={`${index % 2 === 0 ? "bg-white/50" : "bg-slate-50/50"} hover:bg-primary/5 transition-colors border-primary/10`}>
                    <TableCell className="font-semibold text-foreground">
                      <div className="space-y-1">
                        <div className="truncate max-w-xs">{subscription.packageName}</div>
                        <div className="sm:hidden text-xs text-muted-foreground">
                          <Link
                            to={`/students/${subscription.studentId}`}
                            className="text-primary hover:underline font-medium"
                          >
                            {studentName}
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Link
                        to={`/students/${subscription.studentId}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {studentName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(status)} className="px-2 md:px-3 py-1 text-xs">
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">{subscription.usedSessions}/{subscription.totalSessions}</div>
                        <div className="text-xs text-muted-foreground">
                          {remainingSessions} remaining
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs hidden lg:table-cell whitespace-nowrap">
                      <div>{new Date(subscription.startDate).toLocaleDateString()}</div>
                      <div>{new Date(subscription.endDate).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs hidden xl:table-cell whitespace-nowrap">
                      {subscription.createdAt ? new Date(subscription.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 md:gap-2">
                        <Button asChild variant="outline" size="sm" className="hover:bg-green-50" title="View Details">
                          <Link to={`/subscriptions/${subscription.id}`}>
                            <Eye className="h-3 w-3 md:h-4 md:w-4" />
                          </Link>
                        </Button>
                        {status === 'ACTIVE' && remainingSessions > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUseSession(subscription.id)}
                            disabled={useSessionMutation.isPending}
                            className="gap-1 hover:bg-amber-50 hover:text-amber-600"
                            title="Use Session"
                          >
                            <Play className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                }) || (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-40" />
                      <p>No subscriptions found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}