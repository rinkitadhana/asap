import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

const AsapLogo = ({ icon, name }: { icon?: boolean, name?: boolean }) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  return (
    <div className="flex items-center gap-2">
      {icon && (
        <Image
          src= {darkMode ? "/img/logo/rounded-logo-dark.png" : "/img/logo/rounded-logo-light.png"}
          className="size-[32px]"
          alt="Asap"
          width={40}
          height={40}
        />
      )}
      {
        name && (
          <h1 className="text-xl font-bold">Asap</h1>
        )
      }
    </div>
  );
};

export default AsapLogo;
