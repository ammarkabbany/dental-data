import { Card, CardContent, CardFooter } from "./ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export default function StatsCard({
  title,
  value,
  icon,
  children,
}: StatsCardProps) {
  return (
    //  dark:shadow-white/15 shadow-neutral-400/75
    <Card className="flex h-[150px] shadow-xl dark:shadow-neutral-700/50 backdrop-blur-sm transition-all duration-300">
      <CardContent className="w-full flex flex-row justify-start items-center gap-4">
        <div className="p-4 rounded-full flex items-center text-white from-[#667eea] to-[#764ba2] bg-gradient-to-r shadow-lg dark:shadow-white/15 shadow-neutral-400/75">
          {icon}
        </div>
        <div className="flex flex-col">
          <p>{title}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">
              {value}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="ml-auto">
        {children}
      </CardFooter>
    </Card>
  );
}
