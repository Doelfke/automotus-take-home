/**
 * Formats a timestamp into a human-readable relative time string
 */
function formatTimeAgo(timestamp: string) {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

/**
 * Formats a timestamp into a time string (e.g., "2:30 PM")
 */
function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Calculates the duration in minutes from a timestamp to now
 */
function getMinutesSince(timestamp: string) {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  return Math.floor((now - then) / (1000 * 60));
}

/**
 * Formats a duration in minutes to a human-readable string
 */
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Calculates overstay duration in minutes (returns 0 if not overstayed)
 */
function getOverstayMinutes(arrivalTime: string, timeLimit: number) {
  const parkedMinutes = getMinutesSince(arrivalTime);
  const overstay = parkedMinutes - timeLimit;
  return overstay > 0 ? overstay : 0;
}

export const timeUtils = {
  formatTimeAgo,
  formatTime,
  getMinutesSince,
  formatDuration,
  getOverstayMinutes,
};
