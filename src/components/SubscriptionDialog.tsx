
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const SubscriptionDialog = ({ open, onOpenChange, onSuccess }: SubscriptionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = () => {
    setIsSubmitting(true);

    // Simulate subscription process
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      toast({
        title: "Subscription successful",
        description: "Your room now supports unlimited participants!",
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade Your Room</DialogTitle>
          <DialogDescription>
            Upgrade to Premium to allow more than 5 participants in your room
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="bg-card p-4 rounded-lg border">
            <div className="font-medium mb-2">Free</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Real-time code editing</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Live chat</span>
              </li>
              <li className="flex items-center">
                <X className="h-4 w-4 mr-2 text-red-500" />
                <span className="text-muted-foreground">Maximum 5 participants</span>
              </li>
              <li className="flex items-center">
                <X className="h-4 w-4 mr-2 text-red-500" />
                <span className="text-muted-foreground">No live preview</span>
              </li>
            </ul>
            <div className="mt-4 text-center font-medium">
              Current Plan
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border border-primary">
            <div className="font-medium mb-2">Premium</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Real-time code editing</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Live chat</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Unlimited participants</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Live code preview</span>
              </li>
            </ul>
            <div className="mt-4 text-center font-medium">
              $9.99/month
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubscribe} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Subscribe Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
