import { Button } from "@/components/ui/button";
import { useGetTemplates } from "@/features/templates/hooks/use-get-templates";
import { useTemplatesStore } from "@/store/templates-store";
import { useEffect } from "react";
import { Star, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplatesSidebar({ applyTemplate }: { applyTemplate: (template: any | undefined) => void }) {
  const { favoriteTemplates, recentTemplates, getTemplateById, setTemplates, applyTemplate: tsApply } = useTemplatesStore();
  const { data, isLoading } = useGetTemplates();

  useEffect(() => {
    tsApply(undefined)
    if (!isLoading && data) {
      setTemplates(data);
    }
  }, [isLoading, data])

  return (
    <aside className="w-64 flex flex-col border-r">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Favorites Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-500" />
              <h2 className="font-semibold">Favorites</h2>
            </div>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : favoriteTemplates.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-1.5"
                >
                  {favoriteTemplates.map((template) => (
                    <Button
                      key={template}
                      variant="secondary"
                      size="sm"
                      onClick={() => applyTemplate(getTemplateById(template))}
                      className="w-full justify-start font-normal hover:bg-accent/80 transition-colors"
                    >
                      {getTemplateById(template)?.name}
                    </Button>
                  ))}
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground px-2"
                >
                  No favorite templates yet
                </motion.p>
              )}
            </AnimatePresence>
          </section>

          {/* Recent Templates Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-500" />
              <h2 className="font-semibold">Recent</h2>
            </div>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : recentTemplates.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-1.5"
                >
                  {recentTemplates.map((template) => (
                    <Button
                      key={template}
                      variant="secondary"
                      size="sm"
                      onClick={() => applyTemplate(getTemplateById(template))}
                      className="w-full justify-start font-normal hover:bg-accent/80 transition-colors"
                    >
                      {getTemplateById(template)?.name}
                    </Button>
                  ))}
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground px-2"
                >
                  No recent templates
                </motion.p>
              )}
            </AnimatePresence>
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}
