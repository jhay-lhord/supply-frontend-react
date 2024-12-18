export const TimeAgo = (datetime: string) => {
  const time = new Date(datetime as string | number);
  const now = new Date();

  const diffInSeconds = Math.floor(
    (now.getTime() - time.getTime()) / 1000
  );

  let timeAgo = "";
  if (diffInSeconds < 60) {
    timeAgo = `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    timeAgo = `${minutes} minutes ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    timeAgo = `${hours} hours ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    timeAgo = `${days} days ago`;
  }

  return timeAgo
};
