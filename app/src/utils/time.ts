export const formatTime = (ms: number) => {
  const seconds = ms / 1000;
  return seconds.toFixed(2).toString();
};
