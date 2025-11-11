import React from "react";
import Image from "next/image";

interface UserAvatarProps {
  name?: string;
  avatar: string;
  className?: string;
  preJoin?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatar,
  className = "",
  preJoin = false,
}) => {
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.trim()[0].toUpperCase();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {preJoin ? (
        <div className="w-full h-full bg-call-primary/50 flex items-center justify-center font-semibold text-base md:text-lg">
           Camera is off!
        </div>
      ) : avatar ? (
        <div className="relative w-[40%] min-w-[120px] aspect-square max-w-[120px] rounded-full">
          <Image
            src={avatar}
            alt={name ? `${name}'s profile` : "User Profile"}
            fill
            className={`rounded-full object-cover ${className}`}
          />
        </div>
      ) : (
        <div
          className={`rounded-full bg-purple-500 flex items-center justify-center font-semibold text-white w-[40%] min-w-[120px] aspect-square max-w-[120px] ${className}`}
          style={{ fontSize: 'clamp(1.5rem, 5vw, 3.5rem)' }}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
