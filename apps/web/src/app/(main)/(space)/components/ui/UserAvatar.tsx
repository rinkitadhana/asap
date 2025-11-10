import React from "react";
import Image from "next/image";

interface UserAvatarProps {
  username?: string;
  userProfile: string;
  size?: "small" | "medium" | "large";
  className?: string;
  preJoin?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  username,
  userProfile,
  size = "large",
  className = "",
  preJoin = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {preJoin ? (
        <div className="w-full h-full bg-call-primary/50 flex items-center justify-center font-semibold">
           Camera is off!
        </div>
      ) : (
      <Image
        src={userProfile}
        alt={username ? `${username}'s profile` : "User Profile"}
        width={size === "small" ? 40 : size === "medium" ? 60 : 100}
        height={size === "small" ? 40 : size === "medium" ? 60 : 100}
        className={`rounded-full ${className}`}
      />
      )}
    </div>
  );
};

export default UserAvatar;
