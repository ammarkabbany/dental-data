import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({src, className}: {src: string, className?: string}) {
  return (
    <Image
      src={src}
      width={64}
      height={64}
      alt="logo"
      // layout="static"
      className={cn("size-[86px] object-cover", className)}
    />
  )
}

//<Logo src='/old-fav.ico' className='size-16' />