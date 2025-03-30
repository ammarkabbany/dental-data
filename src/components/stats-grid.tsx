import { cn } from "@/lib/utils";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { motion } from "framer-motion";

export interface StatsCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  href?: string;
  icon: React.ReactNode;
}

export function StatsCard({ title, value, change, icon, href }: StatsCardProps) {
  const isPositive = change?.trend === "up";
  const trendColor = isPositive ? "text-emerald-500" : "text-red-500";

  return (
    <motion.div 
      className="relative p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <ArrowTopRightIcon
            className="size-5 absolute right-0 top-0 opacity-0 group-has-[a:hover]:opacity-100 transition-opacity text-emerald-500"
            aria-hidden="true"
          />
        </motion.div>
        {/* Icon */}
        <motion.div 
          className="max-[480px]:hidden size-10 shrink-0 rounded-full bg-emerald-600/25 border border-emerald-600/50 flex items-center justify-center text-emerald-500"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>
        {/* Content */}
        <div>
          {href ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href={href}
                className="font-medium tracking-widest text-xs uppercase text-muted-foreground/60 before:absolute before:inset-0"
              >
                {title}
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              className="font-medium tracking-widest text-xs uppercase text-muted-foreground/60 before:absolute before:inset-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.div>
          )}
          <motion.div 
            className="text-2xl font-semibold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {value}
          </motion.div>
          {change && (
            <motion.div 
              className="text-xs text-muted-foreground/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className={cn("font-medium", trendColor)}>
                {isPositive ? "↗" : "↘"} {change?.value}
              </span>{" "}
              vs last month
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface StatsGridProps {
  stats: StatsCardProps[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 min-[1200px]:grid-cols-4 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}