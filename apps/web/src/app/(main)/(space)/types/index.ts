/**
 * TYPE DEFINITIONS FOR VIDEO CALLING SYSTEM
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the video calling feature. Understanding these types is key to understanding
 * how the system works.
 */

// ============================================================================
// SIDEBAR TYPES
// ============================================================================

/**
 * Which sidebar is currently open (if any)
 * - info: Space details and settings
 * - users: List of participants
 * - chat: Chat messages
 * - null: No sidebar open
 */
export type SidebarType = "info" | "users" | "chat" | null;

// ============================================================================
// PRE-JOIN SCREEN
// ============================================================================

/**
 * Settings chosen by user before joining the call
 * These are applied to the MediaStream when the user enters
 */
export interface PreJoinSettings {
  videoEnabled: boolean;  // Should camera be on when joining?
  audioEnabled: boolean;  // Should mic be on when joining?
  name: string;           // Display name for the call
  avatar?: string;        // Profile picture URL (optional)
}

// ============================================================================
// PARTICIPANT/PLAYER STATE
// ============================================================================

/**
 * Represents a single participant in the call
 * This is the core data structure for managing video/audio streams
 * 
 * FIELDS EXPLAINED:
 * - url: The actual video/audio stream OR a recorded video URL
 * - muted: Is THEIR microphone muted? (affects their audio track)
 * - playing: Is THEIR camera on? (affects their video track visibility)
 * - speakerMuted: Have YOU muted THEIR audio? (affects your volume control)
 * - name: Display name shown in UI
 * - avatar: Profile picture (shown when camera is off)
 */
export interface Player {
  url: MediaStream | string;  // Live stream or recorded video URL
  muted: boolean;             // Their mic state
  playing: boolean;           // Their camera state
  speakerMuted: boolean;      // Your speaker state for this user
  name?: string;              // Display name
  avatar?: string;            // Profile picture URL
}

/**
 * Map of all participants in the call
 * Key: Peer ID (unique identifier from PeerJS)
 * Value: Player object with their stream and state
 * 
 * EXAMPLE:
 * {
 *   "peer-abc123": { url: MediaStream, muted: false, playing: true, ... },
 *   "peer-def456": { url: MediaStream, muted: true, playing: true, ... }
 * }
 */
export interface Players {
  [key: string]: Player;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Props for VideoCallControls component (bottom control bar)
 * Contains the current state and functions to control audio/video
 */
export interface ControlsProps {
  muted: boolean;                               // Current mic state
  playing: boolean;                             // Current camera state
  toggleAudio: () => void;                      // Mute/unmute mic
  toggleVideo: () => void;                      // Camera on/off
  leaveRoom: () => void;                        // Exit the call
  speakerMuted: boolean;                        // Current speaker state
  toggleSpeaker: () => void;                    // Mute/unmute speaker
  toggleSidebar: (sidebarType: SidebarType) => void;  // Open/close sidebars
  activeSidebar: SidebarType;                   // Currently open sidebar
}

/**
 * Props for SpaceScreen component (main video call UI)
 */
export interface SpaceScreenProps {
  toggleSidebar: (sidebarType: SidebarType) => void;
  activeSidebar: SidebarType;
  preJoinSettings: PreJoinSettings | null;  // Settings from pre-join screen
}

/**
 * Props for SpaceWrapper component (layout wrapper)
 */
export interface SpaceWrapperProps {
  children: React.ReactNode;
  activeSidebar: SidebarType;
  closeSidebar: () => void;
}

/**
 * Props for PreJoinScreen component (before entering call)
 */
export interface PreJoinScreenProps {
  onJoinCall: (settings: PreJoinSettings) => void;
  roomId: string;
}

/**
 * Props for UserMedia component (renders individual video/audio)
 */
export interface UserMediaProps {
  url: string | MediaStream | null;  // Stream or video URL
  muted: boolean;                     // Is their mic muted?
  playing: boolean;                   // Is their camera on?
  className: string;                  // CSS classes for video element
  myVideo?: boolean;                  // Is this YOUR video? (for mirror effect)
  name?: string;                      // Display name
  avatar?: string;                    // Profile picture
  preJoin?: boolean;                  // Is this in pre-join screen?
  speakerMuted?: boolean;             // Have you muted their audio?
  hideElements?: boolean;             // Hide name/status overlays?
}

// ============================================================================
// GRID LAYOUT
// ============================================================================

/**
 * Grid layout configuration for displaying multiple participants
 * 
 * EXAMPLES:
 * - 1 user: { rows: 1, cols: 1 }
 * - 2 users: { rows: 1, cols: 2 }
 * - 3 users: { rows: 2, cols: 2, bottomSpan: true } (2 top, 1 bottom spanning full width)
 * - 4 users: { rows: 2, cols: 2 }
 */
export interface GridLayout {
  rows: number;           // Number of rows in grid
  cols: number;           // Number of columns in grid
  bottomSpan?: boolean;   // Should last item span full width? (for 3 users)
}

// ============================================================================
// SIDEBAR
// ============================================================================

/**
 * Props for sidebar components (Info, Users, Chat)
 */
export interface SidebarContentProps {
  onClose: () => void;  // Function to close the sidebar
}
