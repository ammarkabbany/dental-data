
import { Crown, Sparkles, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function PremiumUpgradeCard() {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-md">
      {/* Decorative elements */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />

      <div className="relative">
        <CardContent className="">
          <div className="mb-4 flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-300" />
            <h3 className="text-base font-semibold">Upgrade Now</h3>
          </div>

          <div className="space-y-2 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>
                Premium features
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>
                Higher limits
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>Advanced analytics</span>
            </div>
          </div>

        </CardContent>

        <CardFooter className="">
          <Button className="w-full bg-white font-medium text-purple-700 hover:bg-white/90">
            <span>Upgrade</span>
            <Zap className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
