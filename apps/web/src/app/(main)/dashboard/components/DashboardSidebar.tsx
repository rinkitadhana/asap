"use client";
import Logo from "@/shared/components/ui/AsapLogo";
import { supabase } from "@/shared/lib/supabaseClient";
import { FolderClosed, House, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { BsLayoutSidebarInset } from "react-icons/bs";
import Image from "next/image";


const DashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      
      if (user) {
        // Extract user data from user_metadata (Google OAuth stores it here)
        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'
        const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || null
        
        setUserName(name)
        setUserAvatar(avatar)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    const savedSidebarState = localStorage.getItem("sidebarOpen");
    if (savedSidebarState) {
      setIsOpen(savedSidebarState === "true");
    }
    setIsMounted(true);
  }, []);

  // Prevent flash by not rendering until we've read from localStorage
  if (!isMounted) {
    return null;
  }

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("sidebarOpen", String(newState));
  };

  const links = [
    {
      icon: <House size={22} />,
      name: "Home",
      href: "/dashboard/home",
    },
    {
      icon: <FolderClosed size={22} />,
      name: "Project",
      href: "/dashboard/project",
    },
  ];

  return (
    <div
      className={`flex flex-col justify-between items-center py-2 ${
        isOpen ? "w-[180px]" : "w-fit"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-6 w-full">
        <div
          className={`flex gap-2 pl-1 items-center -pl-2 w-full ${
            isOpen ? "justify-between" : "justify-center"
          }`}
        >
          {isOpen && <Logo />}
          <button
            title={isOpen ? "Close sidebar" : "Open sidebar"}
            onClick={toggleSidebar}
            className="hover:bg-primary-hover p-2 rounded-md cursor-pointer transition-all duration-200"
          >
            <BsLayoutSidebarInset size={20} />
          </button>
        </div>

        <nav className="flex flex-col items-center justify-center gap-2 w-full">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              title={link.name}
              className={`py-2 px-3 rounded-xl border select-none transition-all duration-200 w-full flex items-center gap-2 ${
                pathname === link.href
                  ? "bg-call-primary border-call-border"
                  : "hover:bg-call-primary border-transparent hover:border-call-border"
              }`}
            >
              <span>{link.icon}</span>
              {isOpen && <span className="truncate">{link.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 w-full select-none">
        <div className="flex items-center gap-2 hover:bg-call-primary rounded-xl border border-transparent hover:border-call-border py-2 px-3 cursor-pointer transition-all duration-200 w-full">
          <div title={userName || "User"}>
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt={userName || "User"}
                width={30}
                height={30}
                className="rounded-full object-cover"
              />
            ) : (
              <UserIcon size={22} />
            )}
          </div>
          {isOpen && <span className="truncate">{userName || "User"}</span>}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
