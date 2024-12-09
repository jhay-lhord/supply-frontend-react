export const formatDate = (created_at: Date) => {
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formattedDate
};

export const formatPrDate = (created_at: Date) => {
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  return formattedDate
};
