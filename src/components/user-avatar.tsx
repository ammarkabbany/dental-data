import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UserAvatarProps {
  image?: string;
  name: string;
  className?: string;
  imgClassName?: string;
}

export const UserAvatar = ({ image, name, className, imgClassName }: UserAvatarProps) => {
  if (image && image !== "?") {
    return (
      <Avatar
        className={cn(
          "size-10 rounded-full relative overflow-hidden ring ring-offset-0",
          className
        )}
      >
        <Image unoptimized src={image} alt={name} sizes="24" fill className="object-cover" />
      </Avatar>
    );
  }

  return (
    <Avatar className={cn("size-10 rounded-full", className)}>
      <AvatarFallback className={cn("bg-blue-600 font-semibold text-sm uppercase rounded-md", imgClassName)}>
        {image === "?" ? "?" : name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
