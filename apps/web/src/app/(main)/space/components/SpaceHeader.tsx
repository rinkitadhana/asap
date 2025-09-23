import SpaceLogo from '@/app/(main)/space/components/ui/SpaceLogo'
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher'
import { UserPlus } from 'lucide-react'
import React from 'react'
import { BsPatchQuestion } from 'react-icons/bs'
import BackButton from './ui/BackButton'

const SpaceHeader = ({ prejoin }: { prejoin?: boolean }) => {
    return (
        <header className="w-full px-2 select-none z-50">
            <div className="flex items-center justify-between py-2 w-full rounded-xl">
                <div className="flex items-center gap-2">
                    <BackButton />
                    <SpaceLogo />
                    <div className="h-6 border-l border-primary-border mx-1" />
                    <div className=" text-secondary-text text-sm">
                        Rinkit Adhana&apos;s Space
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitcher scrolled={false} className="p-2.5 border border-call-border rounded-xl hover:bg-primary-hover transition-all duration-200 bg-call-primary cursor-pointer select-none" />
                    <div className="h-7 border-l border-primary-border mx-1" />
                    <div className="flex items-center gap-2 py-2.5 px-3 border border-call-border rounded-xl hover:bg-primary-hover transition-all duration-200 bg-call-primary cursor-pointer select-none">
                        <BsPatchQuestion size={17} />
                        <span className="font-medium text-[15px] leading-tight">
                            Help
                        </span>
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
    )
}

export default SpaceHeader
