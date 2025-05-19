export const isErr = (state: unknown): state is Err => {
  return typeof state === "object" && state !== null && "error" in state;
};
