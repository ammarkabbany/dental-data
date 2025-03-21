import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export function QuickActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: any
  label: string
  onClick?: () => void
  variant?: "default" | "warning" | "danger" | "success"
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={cn(
              "h-8 w-8 rounded-full bg-[#1f1f3a]/50 hover:bg-[#1f1f3a]",
              variant === "danger" && "hover:bg-red-900/50 hover:text-red-400",
              variant === "warning" && "hover:bg-amber-900/50 hover:text-amber-400",
              variant === "success" && "hover:bg-emerald-900/50 hover:text-emerald-400",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}