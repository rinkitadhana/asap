import React from "react"
import { X } from "lucide-react"
import Header from "./Header"

type SidebarType = 'info' | 'users' | 'chat' | null
interface SpaceWrapperProps {
  children: React.ReactNode
  activeSidebar: SidebarType
  closeSidebar: () => void
}

// Sidebar content components
const InfoContent = ({ onClose }: { onClose: () => void }) => (
  <div className="p-4 flex flex-col h-full">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Info</h3>
      <button onClick={onClose} className="select-none p-1.5 rounded-full bg-call-background hover:bg-primary-hover border border-call-border cursor-pointer transition-all duration-300">
        <X size={17} />
      </button>
    </div>

    <div className="flex-1 space-y-3 my-8">
      <div className="text-sm text-secondary-text text-center">
        No info yet.
      </div>
    </div>
  </div >
)

const UsersContent = ({ onClose }: { onClose: () => void }) => (
  <div className="p-4 flex flex-col h-full">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">People</h3>
      <button onClick={onClose} className="select-none p-1.5 rounded-full bg-call-background hover:bg-primary-hover border border-call-border cursor-pointer transition-all duration-300">
        <X size={17} />
      </button>
    </div>

    <div className="flex-1 space-y-3 my-8">
      <div className="text-sm text-secondary-text text-center">
        No people yet.
      </div>
    </div>
  </div >
)

const ChatContent = ({ onClose }: { onClose: () => void }) => (
  <div className="p-4 flex flex-col h-full">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Chat</h3>
      <button onClick={onClose} className="select-none p-1.5 rounded-full bg-call-background hover:bg-primary-hover border border-call-border cursor-pointer transition-all duration-300">
        <X size={17} />
      </button>
    </div>

    <div className="flex-1 space-y-3 my-8">
      <div className="text-sm text-secondary-text text-center">
        No chat yet.
      </div>
    </div>
  </div >
)

const SpaceWrapper = ({ children, activeSidebar, closeSidebar }: SpaceWrapperProps) => {
  const renderSidebarContent = () => {
    switch (activeSidebar) {
      case 'info':
        return <InfoContent onClose={closeSidebar} />
      case 'users':
        return <UsersContent onClose={closeSidebar} />
      case 'chat':
        return <ChatContent onClose={closeSidebar} />
      default:
        return null
    }
  }

  return (
    <section className="bg-call-background h-screen flex items-center p-2">
      <div className="relative flex-1 flex flex-col items-center justify-center h-full max-w-full overflow-hidden">
        <Header />
        <div className="w-full flex-1 min-h-0 px-2 pt-2">
          {children}
        </div>

      </div>
      {/* Conditional Sidebar */}
      {activeSidebar && (
        <div className="flex justify-center items-center h-full gap-2 flex-shrink-0">
          <div className="flex flex-col justify-start items-stretch border border-call-border h-full w-[350px] rounded-2xl bg-call-primary overflow-hidden">
            {renderSidebarContent()}
          </div>
        </div>
      )}
    </section>
  )
}

export default SpaceWrapper
