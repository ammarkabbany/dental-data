"use client";
import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Video Showcase Item Component
interface VideoShowcaseItemProps {
  title: string;
  description: string;
  videoSrc: string;
  delay: number;
  index: number;
}

const VideoShowcaseItem: React.FC<VideoShowcaseItemProps> = ({
  title,
  description,
  videoSrc,
  delay,
  index
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, {
    once: false, // Changed to false to allow replay
    margin: "-100px"
  });

  // Replay video when it comes back into view
  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.25, 1, 0.5, 1] 
      }}
      className={`flex flex-col ${
        index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
      } items-center gap-8 lg:gap-12`}
    >
      {/* Content */}
      <div className="flex-1 space-y-4 text-center lg:text-left">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground dark:text-gray-100">
          {title}
        </h3>
        <p className="text-lg text-muted-foreground dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Video Container - Made bigger */}
      <div className="flex-1 w-full max-w-4xl"> {/* Increased from max-w-2xl to max-w-4xl */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl dark:shadow-neutral-900/50 bg-muted/20 dark:bg-neutral-800/40 border border-border/50">
          <video
            ref={videoRef}
            className="w-full h-auto rounded-xl"
            muted
            autoPlay
            loop
            playsInline
            poster={`/videos/${title.toLowerCase().replace(/\s+/g, '-')}-poster.jpg`}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Subtle overlay for better visual integration */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-xl" />
        </div>
      </div>
    </motion.div>
  );
};

// Main Video Showcase Section Component
export const VideoShowcaseSection: React.FC = () => {
  return (
    <section id="showcase" className="w-full py-24 md:py-32 lg:py-40 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12 md:mb-16">
          <Badge
            variant="outline"
            className="px-4 py-1 text-sm font-medium border-primary/50 text-primary dark:text-primary-foreground bg-primary/10 dark:bg-primary/20"
          >
            See It In Action
          </Badge>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Watch DentaAuto in Action
          </h2>
          <p className="max-w-[900px] mx-auto text-lg text-gray-600 md:text-xl dark:text-gray-300 font-light">
            See how our platform streamlines your dental lab operations with these feature previews.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-16 md:space-y-20"> {/* Increased from max-w-4xl to max-w-6xl */}
          {[
            {
              title: "Fast Case Entry",
              description: "Create new cases in seconds with our streamlined intake form",
              videoSrc: "/videos/case-entry.mov",
              delay: 0.1
            },
            {
              title: "Inline Editing",
              description: "Edit doctor and material information directly in the table with real-time updates",
              videoSrc: "/videos/inline-editing.mov",
              delay: 0.2
            },
            // {
            //   title: "Material Management",
            //   description: "Easily manage your inventory with our intuitive material tracking system",
            //   videoSrc: "/videos/material-management.mp4",
            //   delay: 0.3
            // },
            {
              title: "Cases Export",
              description: "Save time and reduce hassle with our built-in PDF export feature — effortlessly print or download detailed case summaries whenever you need them.",
              videoSrc: "/videos/cases-export.mov",
              delay: 0.3
            }
          ].map((item, index) => (
            <VideoShowcaseItem
              key={index}
              title={item.title}
              description={item.description}
              videoSrc={item.videoSrc}
              delay={item.delay}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}; 