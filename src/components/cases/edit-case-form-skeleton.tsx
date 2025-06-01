import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const EditCaseFormSkeleton = () => {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-col px-7">
        <Skeleton className="h-8 w-3/4 mb-2" /> {/* Title Placeholder */}
        <Skeleton className="h-4 w-1/2" />    {/* Description Placeholder */}
        <div className="mt-2">
          <Skeleton className="h-px w-full" /> {/* Separator Placeholder */}
        </div>
      </CardHeader>
      <CardContent className="w-full">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column Skeletons */}
          <div className="!flex !flex-col gap-y-8"> {/* Increased gap to match form fields + labels */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-2">
                <Skeleton className="h-4 w-1/3" /> {/* Label */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" /> {/* Label */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-2">
                <Skeleton className="h-4 w-1/3" /> {/* Label */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" /> {/* Label */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <div className="flex items-center justify-end gap-4 mt-4">
              <Skeleton className="h-12 w-24" /> {/* Cancel Button */}
              <Skeleton className="h-12 w-32" /> {/* Save Button */}
            </div>
          </div>
          {/* Right Column Skeleton (TeethFormData) */}
          <div className="mt-4">
            <Skeleton className="h-[300px] w-full" /> {/* Placeholder for TeethFormData */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
