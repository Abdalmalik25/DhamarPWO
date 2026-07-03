export const errorTracker = {
  captureException: (error: Error) => console.error(error),
  captureMessage: (msg: string) => console.log(msg),
};
