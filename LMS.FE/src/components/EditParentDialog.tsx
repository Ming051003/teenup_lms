import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParentResponse, UpdateParentRequest } from "@/types/api";
import { Loader2 } from "lucide-react";

interface EditParentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  parent: ParentResponse | null;
  onUpdate: (id: number, data: UpdateParentRequest) => void;
  isLoading?: boolean;
}

export function EditParentDialog({
  isOpen,
  onClose,
  parent,
  onUpdate,
  isLoading = false
}: EditParentDialogProps) {
  const [formData, setFormData] = useState<UpdateParentRequest>({
    name: "",
    phone: "",
    email: ""
  });

  // Reset form when parent changes
  useEffect(() => {
    if (parent) {
      setFormData({
        name: parent.name,
        phone: parent.phone,
        email: parent.email
      });
    }
  }, [parent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parent && !isLoading) {
      onUpdate(parent.id, formData);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!parent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Parent</DialogTitle>
          <DialogDescription>
            Update {parent.name}'s information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Parent Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter parent name"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number (10-11 digits)"
              pattern="^[0-9]{10,11}$"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
              disabled={isLoading}
            />
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
                "Update Parent"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
