import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useStudent, useSubscription, useUseSession } from "@/hooks/useApi";
import { SubscriptionStatus } from "@/types/api";
import { ArrowLeft, Calendar, CreditCard, Loader2, Package, Play, User } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default function SubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const subscriptionId = id ? parseInt(id, 10) : 0;
  const { data: subscription, isLoading, error } = useSubscription(subscriptionId);
  const { data: student } = useStudent(subscription?.studentId || 0);
  const useSessionMutation = useUseSession();
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
  const getRemainingSessions = (): number => {
    if (subscription?.remainingSessions !== undefined) {
      return subscription.remainingSessions;
    }
    return (subscription?.totalSessions || 0) - (subscription?.usedSessions || 0);
  };

  // Get student name from subscription or student data
  const getStudentName = (): string => {
    if (subscription?.studentName) return subscription.studentName;
    if (student?.name) return student.name;
    return `Student #${subscription?.studentId || 'N/A'}`;
  };

  // Get normalized subscription data
  const normalizedSubscription = subscription ? {
    ...subscription,
    status: getStatusString(subscription.status),
    remainingSessions: getRemainingSessions(),
    studentName: getStudentName(),
  } : null;

  useEffect(() => {
    document.title = normalizedSubscription ? `${normalizedSubscription.packageName} – Subscription Details` : "Subscription Details";
  }, [normalizedSubscription]);

  const handleUseSession = async () => {
    if (!normalizedSubscription) return;
    
    // Frontend validation before API call
    if (normalizedSubscription.status !== 'ACTIVE') {
      toast({
        title: "Cannot Use Session",
        description: `Subscription is ${normalizedSubscription.status.toLowerCase()}, not active.`,
        variant: "destructive",
      });
      return;
    }

    if (normalizedSubscription.remainingSessions <= 0) {
      toast({
        title: "Cannot Use Session",
        description: "No remaining sessions available.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await useSessionMutation.mutateAsync(normalizedSubscription.id);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading subscription details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/subscriptions">
          <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Subscriptions</Button>
        </Link>
        <Card className="border-2 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Subscription</CardTitle>
            <CardDescription>
              {error.message || "An error occurred while loading the subscription details."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!subscription && !isLoading) {
    return (
      <div className="space-y-4">
        <Link to="/subscriptions">
          <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Subscriptions</Button>
        </Link>
        <Card className="border-2 border-primary/10">
          <CardHeader>
            <CardTitle>Subscription not found</CardTitle>
            <CardDescription>
              We couldn't find the subscription with ID: {subscriptionId}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!normalizedSubscription) {
    return null;
  }

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/subscriptions">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back to Subscriptions</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground truncate">{normalizedSubscription.packageName}</h1>
          <p className="text-muted-foreground text-sm md:text-lg mt-1">Subscription ID: {normalizedSubscription.id}</p>
        </div>
        <Badge variant={getStatusBadgeVariant(normalizedSubscription.status)} className="text-sm md:text-base px-3 md:px-4 py-2 h-fit">
          {normalizedSubscription.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main Information */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Package Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 pt-4 md:pt-6">
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                {/* Student Information */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-primary/10">
                  <h3 className="text-lg font-bold text-foreground">Student</h3>
                  <div className="space-y-3">
                    <Link 
                      to={`/students/${normalizedSubscription.studentId}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors">
                        <User className="h-5 w-5 text-primary/60" />
                        <div>
                          <p className="text-xs text-muted-foreground">Name</p>
                          <span className="text-sm font-semibold group-hover:text-primary">{normalizedSubscription.studentName}</span>
                        </div>
                      </div>
                    </Link>
                    <div className="text-xs text-muted-foreground p-2">
                      <p>ID: {normalizedSubscription.studentId}</p>
                    </div>
                  </div>
                </div>

                {/* Period Information */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-primary/10">
                  <h3 className="text-lg font-bold text-foreground">Period</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors">
                      <Calendar className="h-5 w-5 text-primary/60" />
                      <div>
                        <p className="text-xs text-muted-foreground">Dates</p>
                        <span className="text-sm font-semibold">{new Date(normalizedSubscription.startDate).toLocaleDateString()}</span>
                        <span className="text-xs text-muted-foreground"> → </span>
                        <span className="text-sm font-semibold">{new Date(normalizedSubscription.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {normalizedSubscription.createdAt && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="font-semibold text-sm">{new Date(normalizedSubscription.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                  {normalizedSubscription.updatedAt && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-muted-foreground">Updated</p>
                      <p className="font-semibold text-sm">{new Date(normalizedSubscription.updatedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session Management Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors sticky top-6">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Session Stats */}
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-primary/10">
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="text-3xl font-bold text-foreground">{normalizedSubscription.totalSessions}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <p className="text-xs text-muted-foreground mb-1">Used</p>
                  <p className="text-3xl font-bold text-orange-600">{normalizedSubscription.usedSessions}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                  <p className="text-3xl font-bold text-green-600">{normalizedSubscription.remainingSessions}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Progress</span>
                  <span className="text-muted-foreground">{Math.round((normalizedSubscription.usedSessions / normalizedSubscription.totalSessions) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-3 bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all"
                    style={{ width: `${(normalizedSubscription.usedSessions / normalizedSubscription.totalSessions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Use Session Button */}
              {normalizedSubscription.status === 'ACTIVE' && normalizedSubscription.remainingSessions > 0 && (
                <Button 
                  onClick={handleUseSession}
                  disabled={useSessionMutation.isPending}
                  className="w-full gap-2 mt-4"
                >
                  {useSessionMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Using...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Use Session
                    </>
                  )}
                </Button>
              )}

              {(normalizedSubscription.status !== 'ACTIVE' || normalizedSubscription.remainingSessions === 0) && (
                <div className="text-center text-muted-foreground text-sm p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 mt-4">
                  {normalizedSubscription.status !== 'ACTIVE' 
                    ? `Subscription is ${normalizedSubscription.status.toLowerCase()}`
                    : "No remaining sessions"
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
