export const isErr = (state: unknown): state is Err => {
  return typeof state === "object" && state !== null && "error" in state;
};

export const getTimeText = (isoString: string): string[] => {
  const date = new Date(isoString);
  // const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // const _day = Math.floor(Math.random() * 10);

  return [`${year}/${month}/${day}`, `${hours}:${minutes}`];
};
