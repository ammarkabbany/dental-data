import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  src: string;
  className?: string;
  w?: number;
  h?: number; 
}

export default function Logo({src, className, w, h}: LogoProps) {
  return (
    <Image
      src={src}
      width={w ?? 64}
      height={h ?? 64}
      alt="logo"
      // layout="static"
      className={cn("size-[86px] object-cover", className)}
    />
  )
}

//<Logo src='/old-fav.ico' className='size-16' />