import React from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  username?: string;
  userProfile?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  username, 
  userProfile, 
  size = 'large',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'size-[40px] text-lg',
    medium: 'size-[60px] text-2xl',
    large: 'size-[100px] text-4xl'
  };

  if (userProfile) {
    return (
      <Image 
        src={userProfile} 
        alt="User Profile" 
        width={size === 'small' ? 40 : size === 'medium' ? 60 : 100}
        height={size === 'small' ? 40 : size === 'medium' ? 60 : 100}
        className={`rounded-full ${className}`} 
      />
    );
  }

  return (
    <div className="select-none rounded-full bg-green-400/20 flex items-center justify-center">
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        {username ? (
          <span className="text-foreground font-medium">
            {username.charAt(0).toUpperCase()}
          </span>
        ) : (
          <span className="text-foreground font-medium">
            ?
          </span>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
