import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubscriptionResponse, UpdateSubscriptionRequest, SubscriptionStatus } from "@/types/api";
import { Loader2 } from "lucide-react";

interface EditSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionResponse | null;
  onUpdate: (id: number, data: UpdateSubscriptionRequest) => void;
  isLoading?: boolean;
}

export function EditSubscriptionDialog({
  isOpen,
  onClose,
  subscription,
  onUpdate,
  isLoading = false
}: EditSubscriptionDialogProps) {
  const [formData, setFormData] = useState<UpdateSubscriptionRequest>({
    packageName: "",
    startDate: "",
    endDate: "",
    totalSessions: 1,
    status: "ACTIVE" as SubscriptionStatus
  });

  // Reset form when subscription changes
  useEffect(() => {
    if (subscription) {
      setFormData({
        packageName: subscription.packageName,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        totalSessions: subscription.totalSessions,
        status: subscription.status
      });
    }
  }, [subscription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscription && !isLoading) {
      onUpdate(subscription.id, formData);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!subscription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            Update subscription for {subscription.studentName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="packageName">Package Name</Label>
            <Input
              id="packageName"
              value={formData.packageName}
              onChange={(e) => setFormData(prev => ({ ...prev, packageName: e.target.value }))}
              placeholder="Enter package name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="totalSessions">Total Sessions</Label>
            <Input
              id="totalSessions"
              type="number"
              min="1"
              value={formData.totalSessions}
              onChange={(e) => setFormData(prev => ({ ...prev, totalSessions: parseInt(e.target.value) }))}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: SubscriptionStatus) => setFormData(prev => ({ ...prev, status: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Subscription"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
