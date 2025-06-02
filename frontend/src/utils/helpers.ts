function ISOToString(ISODate: string) {
  const date = new Date(ISODate);
  return date.toLocaleString();
}

export { ISOToString };
