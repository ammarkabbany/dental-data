import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

interface UpgradePromptProps {
  featureName?: string;
}

export function UpgradePrompt({ featureName = "this feature" }: UpgradePromptProps) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
      <div className="space-y-4 max-w-md text-center">
        <div className="mx-auto bg-yellow-100 dark:bg-yellow-800/20 w-min border-yellow-300 border-2 p-2 rounded-full">
          <Crown className="size-12 text-yellow-500" />
        </div>
        <h3 className="text-lg font-bold">Upgrade to Access {featureName}</h3>
        <p className="text-muted-foreground">
          Premium features require an upgraded plan.
          <br />
          Upgrade now to unlock all capabilities.
        </p>
        {/* <Button className="mt-4 mx-auto">Upgrade Now</Button> */}
      </div>
    </div>
  );
}