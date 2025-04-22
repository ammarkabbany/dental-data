import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <Avatar
        className={cn(
          "size-10 rounded-full relative overflow-hidden ring ring-offset-0",
          className
        )}
      >
        <AvatarImage src={image} />
      </Avatar>
    );
  }

  return (
    <Avatar className={cn("size-10 rounded-full", className)}>
      <AvatarFallback className="bg-blue-600 font-semibold text-sm uppercase rounded-md">
        {image === "?" ? "?" : name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
