import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";


interface UserAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const UserAvatar = ({ image, name, className }: UserAvatarProps) => {
  if (image && image !== "?") {
    return (
      <div className={cn("size-10 rounded-full relative overflow-hidden ring ring-offset-0", className)}>
        <Image src={image} alt={name} sizes="24" fill className="object-cover" />
      </div>
    )
  }

  return (
    <Avatar className={cn("size-10 rounded-full", className)}>
      <AvatarFallback className="bg-blue-600 font-semibold text-sm uppercase rounded-md">
        {image === "?" ? "?" : name[0]}
      </AvatarFallback>
    </Avatar>
  )
}