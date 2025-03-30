"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface NotificationsTabProps {
  canUpdate: boolean;
  isSaving: boolean;
  handleSave: (type: string) => void;
}

export default function NotificationsTab({ canUpdate, isSaving, handleSave }: NotificationsTabProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications about team activity
              </p>
            </div>
            <Switch defaultChecked={true} disabled={!canUpdate} />
          </div>
          
          <div className="flex items-center justify-between py-4 border-b">
            <div className="space-y-0.5">
              <Label className="text-base">Case Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when cases are updated or completed
              </p>
            </div>
            <Switch defaultChecked={true} disabled={!canUpdate} />
          </div>
          
          <div className="flex items-center justify-between py-4 border-b">
            <div className="space-y-0.5">
              <Label className="text-base">Billing Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about billing and subscription changes
              </p>
            </div>
            <Switch defaultChecked={true} disabled={!canUpdate} />
          </div>
          
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label className="text-base">Team Member Activity</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about team member actions and changes
              </p>
            </div>
            <Switch defaultChecked={false} disabled={!canUpdate} />
          </div>
        </div>
        
        {canUpdate && (
          <div className="mt-8 flex justify-end">
            <Button 
              variant="default"
              onClick={() => handleSave('Notification')}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save notification settings'}
              {!isSaving && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}