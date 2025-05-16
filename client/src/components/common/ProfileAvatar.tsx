import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  src: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  bordered?: boolean;
  borderColor?: string;
}

export default function ProfileAvatar({ 
  src, 
  name, 
  size = "md", 
  bordered = false,
  borderColor = "border-primary-300"
}: ProfileAvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-24 h-24",
  };
  
  const borderClass = bordered ? `border-2 ${borderColor}` : "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Avatar className={`${sizeClasses[size]} ${borderClass}`}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className="bg-accent-200 text-accent-700">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
