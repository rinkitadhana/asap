import { ThemeSwitcher } from "@/shared/components/ThemeSwitcher";
import { UserPlus } from "lucide-react";
import React from "react";
import { BsPatchQuestion } from "react-icons/bs";
import AsapLogo from "@/shared/components/ui/AsapLogo";
import { useParams } from "next/navigation";
import { useGetSpaceByJoinCode } from "@/shared/hooks/useSpace";

const SpaceHeader = ({ prejoin }: { prejoin?: boolean }) => {
  const params = useParams();
  const roomId = params.roomId as string;
  const { data: spaceData, isLoading } = useGetSpaceByJoinCode(roomId);

  return (
    <header className="w-full px-2 select-none z-50">
      <div className="flex items-center justify-between py-2 w-full rounded-xl">
        <div className="flex items-center gap-2">
          <AsapLogo icon name />
          <div className="h-6 border-l border-primary-border mx-1" />
          <div className=" text-secondary-text text-sm">
            {isLoading ? (
              <div className="animate-pulse">Loading space info...</div>
            ) : (
              spaceData?.title || "Untitled Space"
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher
            scrolled={false}
            className="p-2.5 border border-call-border rounded-xl hover:bg-primary-hover transition-all duration-200 bg-call-primary cursor-pointer select-none"
          />
          <div className="h-7 border-l border-primary-border mx-1" />
          <div className="flex items-center gap-2 py-2.5 px-3 border border-call-border rounded-xl hover:bg-primary-hover transition-all duration-200 bg-call-primary cursor-pointer select-none">
            <BsPatchQuestion size={17} />
            <span className="font-medium text-[15px] leading-tight">Help</span>
          </div>
          {!prejoin && (
            <div className="flex items-center gap-2 py-2.5 px-3 border border-call-border rounded-xl hover:bg-primary-hover transition-all duration-200 bg-call-primary cursor-pointer select-none">
              <UserPlus size={17} />
              <span className="font-medium text-[15px] leading-tight">
                Invite
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SpaceHeader;
