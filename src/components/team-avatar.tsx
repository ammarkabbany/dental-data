import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";


interface TeamAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const TeamAvatar = ({ image, name, className }: TeamAvatarProps) => {
  if (image) {
    return (
      <div className="size-10 relative rounded-md overflow-hidden">
        <Image src={image} alt={name} sizes="24" fill className="object-cover" />
      </div>
    )
  }

  return (
    <Avatar className={cn("size-10 rounded-md", className)}>
      <AvatarFallback className="text-white bg-blue-600 font-semibold text-sm uppercase rounded-md">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}