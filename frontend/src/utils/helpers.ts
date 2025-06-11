function ISOToString(ISODate: string) {
  const date = new Date(ISODate);
  return date.toLocaleString("en-Us", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export { ISOToString };
