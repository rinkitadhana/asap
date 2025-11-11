// Centralized type definitions for the space module

export type SidebarType = "info" | "users" | "chat" | null;

export interface PreJoinSettings {
  videoEnabled: boolean;
  audioEnabled: boolean;
  name: string;
}

export interface Player {
  url: MediaStream;
  muted: boolean;
  playing: boolean;
  speakerMuted: boolean;
  name: string;
}

export interface Players {
  [key: string]: Player;
}

export interface ControlsProps {
  muted: boolean;
  playing: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  leaveRoom: () => void;
  speakerMuted: boolean;
  toggleSpeaker: () => void;
  toggleSidebar: (sidebarType: SidebarType) => void;
  activeSidebar: SidebarType;
}

export interface SpaceScreenProps {
  toggleSidebar: (sidebarType: SidebarType) => void;
  activeSidebar: SidebarType;
  preJoinSettings: PreJoinSettings | null;
}

export interface SpaceWrapperProps {
  children: React.ReactNode;
  activeSidebar: SidebarType;
  closeSidebar: () => void;
}

export interface PreJoinScreenProps {
  onJoinCall: (settings: PreJoinSettings) => void;
  roomId: string;
}

export interface UserMediaProps {
  url: string | MediaStream | null;
  muted: boolean;
  playing: boolean;
  className: string;
  myVideo?: boolean;
  name?: string;
  avatar?: string;
  preJoin?: boolean;
  speakerMuted?: boolean;
  hideElements?: boolean;
}

export interface GridLayout {
  rows: number;
  cols: number;
  bottomSpan?: boolean;
}

export interface SidebarContentProps {
  onClose: () => void;
}
