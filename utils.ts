
export const formatTime = (time: number) => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  const ms = Math.floor((time % 1) * 100);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

export const parseTime = (str: string): number | null => {
  const parts = str.split(':');
  let totalSeconds = 0;
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]);
    const secs = parseFloat(parts[1]);
    if (isNaN(mins) || isNaN(secs)) return null;
    totalSeconds = mins * 60 + secs;
  } else if (parts.length === 1) {
    const secs = parseFloat(parts[0]);
    if (isNaN(secs)) return null;
    totalSeconds = secs;
  } else {
    return null;
  }
  return totalSeconds;
};
