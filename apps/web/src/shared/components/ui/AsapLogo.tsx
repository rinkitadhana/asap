import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const AsapLogo = ({ icon, name }: { icon?: boolean, name?: boolean }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const darkMode = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-2">
      {icon && mounted && (
        <Image
          src={darkMode ? "/logo/rounded-logo-dark.png" : "/logo/rounded-logo-light.png"}
          className="size-[32px] select-none"
          alt="Asap"
          width={40}
          height={40}
        />
      )}
      {icon && !mounted && (
        <div className="size-[32px]" />
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
