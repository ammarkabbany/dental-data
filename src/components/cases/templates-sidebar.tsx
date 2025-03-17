import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { CaseTemplate, useCaseTemplateStore } from "~/store/CaseTemplateStore";

export default function TemplatesSidebar({ applyTemplate }: { applyTemplate: (template: any | undefined) => void }) {
  const { favoriteTemplates, recentTemplates, getTemplateById, loading } = {
    favoriteTemplates: [],
    recentTemplates: [],
    getTemplateById: () => ({ name: "Default Template" }),
    loading: false,
  }
  const searchParams = useSearchParams()

  // useEffect(() => {
  //   const templateId = searchParams.get("templateId");

  //   if (templateId) {
  //     const template = getTemplateById(templateId);

  //     if (template) {
  //       applyTemplate(template);
  //     }
  //   }
  // }, [searchParams])

  return (
    <div className="w-64 p-4 sm:border-r"> {/* Sidebar container */}
      {/* Favorites Section */}
      <h2 className="text-sm md:text-lg font-semibold mb-2">⭐ Favorite Templates</h2>
      <div className="space-y-2 mb-4">
        {!loading && favoriteTemplates.length > 0 ? (
          favoriteTemplates.map((template) => (
            <Button
              key={template}
              variant="secondary"
              size={"sm"}
              // onClick={() => applyTemplate(getTemplateById(template))}
              className="w-full px-3 py-2 justify-start text-left"
            >
              {/* {getTemplateById(template)?.name} */} Template
            </Button>
          ))
        ) : (
          <p className="text-muted-foreground text-sm px-2">No favorite templates</p>
        )}
      </div>

      {/* Recent Templates Section */}
      <h2 className="text-sm md:text-lg font-semibold mb-2">📌 Recent Templates</h2>
      <div className="space-y-2">
        {!loading && recentTemplates.length > 0 ? (
          recentTemplates.map((template) => (
            <Button
              key={template}
              size={"sm"}
              // onClick={() => applyTemplate(getTemplateById(template))}
              className="w-full px-3 py-2 justify-start rounded-md"
            >
              {/* {getTemplateById(template)?.name} */} Template
            </Button>
          ))
        ) : (
          <p className="text-muted-foreground text-sm px-2">No recent templates</p>
        )}
      </div>
    </div>
  );
}
