/**
 * Generates or retrieves a persistent participant session ID
 * This ID is used to track individual participants across sessions
 * If a user leaves and rejoins, they will get the same session ID
 * Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (UUID v4)
 */

const PARTICIPANT_SESSION_ID = "asap_participant_session_id";

const generateParticipantSessionId = (): string => {
  // Only run in browser environment
  if (typeof window === "undefined") {
    return crypto.randomUUID();
  }

  try {
    // Check if we already have a session ID in localStorage
    const existingSessionId = localStorage.getItem(PARTICIPANT_SESSION_ID);

    if (existingSessionId) {
      console.log("Using existing participant session ID:", existingSessionId);
      return existingSessionId;
    }

    // Generate a new session ID
    const newSessionId = crypto.randomUUID();

    // Store it in localStorage for future sessions
    localStorage.setItem(PARTICIPANT_SESSION_ID, newSessionId);

    console.log("Generated new participant session ID:", newSessionId);
    return newSessionId;
  } catch (error) {
    // Fallback if localStorage is not available
    console.error("Error accessing localStorage:", error);
    return crypto.randomUUID();
  }
};

/**
 * Clears the stored participant session ID from localStorage
 * Useful for logout or testing purposes
 */
export const clearParticipantSessionId = (): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(PARTICIPANT_SESSION_ID);
      console.log("Participant session ID cleared");
    } catch (error) {
      console.error("Error clearing participant session ID:", error);
    }
  }
};

export default generateParticipantSessionId;
